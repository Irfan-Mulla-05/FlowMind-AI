import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDb = async () => {
  if (!env.mongoUri) {
    const msg = "MONGODB_URI is not defined. Set it in backend/.env or environment variables.";
    console.error(msg);
    throw new Error(msg);
  }

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err.message || err);
  });

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    throw err;
  }
};
