import mongoose from "mongoose";
import { Post } from "../models/Post.js";

export const Rent = Post.discriminator(
  "rent",
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
        frequency: {
          type: String,
          enum: ["daily", "monthly"],
          trim: true,
          required: true,
        },
      },
      required: true,
    },
  })
);
