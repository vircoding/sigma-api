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
          required: true,
        },
        frequency: {
          type: String,
          enum: ["daily", "monthly"],
          required: true,
        },
      },
      required: true,
    },
  })
);
