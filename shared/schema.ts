import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["user", "admin"]),
  createdAt: z.string(),
});

export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  image: z.string(),
  stock: z.number(),
  createdAt: z.string(),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export const cartSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  items: z.array(cartItemSchema),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const orderSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  items: z.array(orderItemSchema),
  totalAmount: z.number(),
  paymentMethod: z.enum(["cod", "online"]),
  paymentStatus: z.enum(["pending", "paid"]),
  orderStatus: z.enum(["processing", "shipped", "delivered"]),
  createdAt: z.string(),
});

export const insertUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "admin"]).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const insertProductSchema = productSchema.omit({ _id: true, createdAt: true });
export const updateProductSchema = insertProductSchema.partial();
