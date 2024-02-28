import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connection established:", process.env.MONGODB_URI);
} catch (error) {
  console.log("MongoDB connection error: " + error);
}
