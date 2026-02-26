import type { Express } from "express";
import { type Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import os from "os";

import { connectDB } from "./db";
import { User } from "./models/User";
import { Product } from "./models/Product";
import { Cart } from "./models/Cart";
import { Contact } from "./models/Contact";
import { Order } from "./models/Order";
import { protect, admin, AuthRequest } from "./middleware/auth";
import { razorpay, verifyRazorpaySignature } from "./utils/razorpay";

const upload = multer({ dest: os.tmpdir() });

const generateToken = (id: string, role: string) => {
  return jwt.sign({ _id: id, role }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Connect to DB
  await connectDB();

  // Seed data function to create an admin user and initial products if empty
  async function seedData() {
    try {
      const adminExists = await User.findOne({ role: "admin" });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);
        await User.create({
          name: "Admin",
          email: "admin@example.com",
          password: hashedPassword,
          role: "admin",
        });
        console.log("Admin user seeded: admin@example.com / admin123");
      }

      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        await Product.insertMany([
          { name: "iPhone 15 Case", description: "Clear protective case", price: 19.99, category: "Mobile accessories", image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=500&auto=format&fit=crop&q=60", stock: 100 },
          { name: "Matte Lipstick", description: "Long-lasting matte lipstick", price: 24.99, category: "Cosmetics", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=60", stock: 50 },
          { name: "Coffee Maker", description: "Programmable coffee maker", price: 79.99, category: "Home & kitchen", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60", stock: 20 },
        ]);
        console.log("Sample products seeded");
      }
    } catch (err) {
      console.log("Seeding failed:", err);
    }
  }

  // Run seed
  seedData().catch(console.error);

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const userExists = await User.findOne({ email: input.email });
      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(input.password, salt);
      const user = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        role: input.role || "user",
      });
      const token = generateToken(user._id.toString(), user.role);
      res.status(201).json({ token, user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Server Error" });
    }
  });

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await User.findOne({ email: input.email });
      if (user && (await bcrypt.compare(input.password, user.password))) {
        const token = generateToken(user._id.toString(), user.role);
        res.json({ token, user });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  // Product Routes
  app.get(api.products.list.path, async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const category = req.query.category ? { category: req.query.category } : {};
    const search = req.query.search ? { name: { $regex: req.query.search, $options: "i" } } : {};
    
    const count = await Product.countDocuments({ ...category, ...search });
    const products = await Product.find({ ...category, ...search })
      .limit(limit)
      .skip(limit * (page - 1));
    
    res.json({ products, total: count, page, pages: Math.ceil(count / limit) });
  });

  app.post(api.products.create.path, protect, admin, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await Product.create(input);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put(api.products.update.path, protect, admin, async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: "Update failed" });
    }
  });

  app.delete(api.products.delete.path, protect, admin, async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).send();
  });

  app.post(api.products.bulkUpload.path, protect, admin, upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
    const products: any[] = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (data) => products.push(data))
      .on("end", async () => {
        try {
          await Product.insertMany(products);
          fs.unlinkSync(req.file!.path);
          res.json({ message: "Bulk upload successful", count: products.length });
        } catch (err) {
          res.status(500).json({ message: "Error uploading products" });
        }
      });
  });

  // Cart Routes
  app.get(api.cart.get.path, protect as any, async (req: any, res: any) => {
    let cart = await Cart.findOne({ userId: req.user!._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user!._id, items: [] });
    }
    res.json(cart);
  });

  app.post(api.cart.add.path, protect as any, async (req: any, res: any) => {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user!._id });
    if (!cart) {
      cart = new Cart({ userId: req.user!._id, items: [] });
    }
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.json(cart);
  });

  app.delete(api.cart.remove.path, protect as any, async (req: any, res: any) => {
    const cart = await Cart.findOne({ userId: req.user!._id });
    if (cart) {
      cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  });

  // Order Routes
  app.post(api.orders.create.path, protect as any, async (req: any, res: any) => {
    const { paymentMethod } = req.body;
    const cart = await Cart.findOne({ userId: req.user!._id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = cart.items.map((item: any) => {
      totalAmount += item.quantity * item.productId.price;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      };
    });

    const order = new Order({
      userId: req.user!._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
    });

    if (paymentMethod === "online") {
      const options = {
        amount: totalAmount * 100, // Razorpay uses minimum currency unit
        currency: "INR",
        receipt: order._id.toString(),
      };
      try {
        const razorpayOrder = await razorpay.orders.create(options);
        order.razorpayOrderId = razorpayOrder.id;
      } catch (err) {
        console.error("Razorpay order creation failed. Falling back to simple order.");
      }
    }

    await order.save();
    
    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({ order, razorpayOrderId: order.razorpayOrderId });
  });

  app.get(api.orders.list.path, protect as any, async (req: any, res: any) => {
    let orders;
    if (req.user!.role === "admin") {
      orders = await Order.find().populate("userId", "name email");
    } else {
      orders = await Order.find({ userId: req.user!._id });
    }
    res.json(orders);
  });

  app.post(api.orders.verifyPayment.path, protect as any, async (req: any, res: any) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    
    if (isValid) {
      await Order.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { paymentStatus: "paid" });
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  });

  app.patch(api.orders.updateStatus.path, protect as any, admin as any, async (req: any, res: any) => {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.orderStatus }, { new: true });
    res.json(order);
  });

  // Contact Route
  app.post("/api/contacts", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const contact = await Contact.create({ name, email, message });
      res.status(201).json(contact);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  // Admin Routes
  app.get(api.admin.users.path, protect as any, admin as any, async (req: any, res: any) => {
    const users = await User.find().select("-password");
    res.json(users);
  });

  app.get(api.admin.dashboard.path, protect as any, admin as any, async (req: any, res: any) => {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const sales = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    res.json({
      totalSales: sales.length > 0 ? sales[0].total : 0,
      totalOrders,
      totalUsers,
      totalProducts
    });
  });

  return httpServer;
}
