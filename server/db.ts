import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI is not set. Please set it in the Secrets panel to connect to your MongoDB database.");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    console.warn("⚠️ Continuing without database connection. API endpoints will fail until MongoDB is connected.");
  }
}
