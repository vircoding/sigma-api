import mongoose from "mongoose";
import { Post } from "../models/Post.js";

export const Sale = Post.discriminator(
  "sale",
  new mongoose.Schema({
    price: {
      type: Number,
      required: true,
    },
  })
);
