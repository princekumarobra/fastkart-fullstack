import { z } from "zod";
import { userSchema, productSchema, orderSchema, cartSchema, insertUserSchema, loginUserSchema, insertProductSchema, updateProductSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: { method: "POST" as const, path: "/api/auth/register" as const, input: insertUserSchema, responses: { 201: z.object({ token: z.string(), user: userSchema }), 400: errorSchemas.validation } },
    login: { method: "POST" as const, path: "/api/auth/login" as const, input: loginUserSchema, responses: { 200: z.object({ token: z.string(), user: userSchema }), 401: errorSchemas.unauthorized } },
  },
  products: {
    list: { method: "GET" as const, path: "/api/products" as const, responses: { 200: z.object({ products: z.array(productSchema), total: z.number(), page: z.number(), pages: z.number() }) } },
    create: { method: "POST" as const, path: "/api/products" as const, input: insertProductSchema, responses: { 201: productSchema, 401: errorSchemas.unauthorized } },
    update: { method: "PUT" as const, path: "/api/products/:id" as const, input: updateProductSchema, responses: { 200: productSchema } },
    delete: { method: "DELETE" as const, path: "/api/products/:id" as const, responses: { 204: z.void() } },
    bulkUpload: { method: "POST" as const, path: "/api/products/bulk" as const, responses: { 200: z.object({ message: z.string(), count: z.number() }) } },
  },
  cart: {
    get: { method: "GET" as const, path: "/api/cart" as const, responses: { 200: cartSchema } },
    add: { method: "POST" as const, path: "/api/cart" as const, input: z.object({ productId: z.string(), quantity: z.number() }), responses: { 200: cartSchema } },
    remove: { method: "DELETE" as const, path: "/api/cart/:productId" as const, responses: { 200: cartSchema } },
  },
  orders: {
    list: { method: "GET" as const, path: "/api/orders" as const, responses: { 200: z.array(orderSchema) } },
    create: { method: "POST" as const, path: "/api/orders" as const, input: z.object({ paymentMethod: z.enum(["cod", "online"]) }), responses: { 201: z.object({ order: orderSchema, razorpayOrderId: z.string().optional() }) } },
    verifyPayment: { method: "POST" as const, path: "/api/orders/verify" as const, input: z.object({ razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() }), responses: { 200: z.object({ success: z.boolean() }) } },
    updateStatus: { method: "PATCH" as const, path: "/api/orders/:id/status" as const, input: z.object({ orderStatus: z.enum(["processing", "shipped", "delivered"]) }), responses: { 200: orderSchema } },
  },
  admin: {
    users: { method: "GET" as const, path: "/api/admin/users" as const, responses: { 200: z.array(userSchema) } },
    dashboard: { method: "GET" as const, path: "/api/admin/dashboard" as const, responses: { 200: z.object({ totalSales: z.number(), totalOrders: z.number(), totalProducts: z.number(), totalUsers: z.number() }) } },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
