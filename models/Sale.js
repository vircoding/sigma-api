import mongoose from "mongoose";
import { Post } from "../models/Post.js";

export const Sale = Post.discriminator(
  "sale",
  new mongoose.Schema({
    amount_details: {
      type: {
        amount: {
          type: Number,
          required: true,
        },
        currency: {
          type: String,
          enum: ["usd", "cup"],
          trim: true,
          required: true,
        },
      },
      required: true,
    },
  })
);
