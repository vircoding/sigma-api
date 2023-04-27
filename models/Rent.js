import mongoose from "mongoose";
import { Post } from "../models/Post.js";

export const Rent = Post.discriminator(
  "rent",
  new mongoose.Schema({
    tax: {
      type: Number,
      required: true,
    },
  })
);
