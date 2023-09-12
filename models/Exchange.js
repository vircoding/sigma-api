import mongoose from "mongoose";
import { Post } from "../models/Post.js";

export const Exchange = Post.discriminator(
  "exchange",
  new mongoose.Schema({
    offer_details: {
      type: {
        offers: {
          type: Number,
          enum: [1, 2, 3],
          required: true,
        },
        needs: {
          type: Number,
          enum: [1, 2, 3],
          default: null,
        },
      },
      required: true,
    },
  })
);
