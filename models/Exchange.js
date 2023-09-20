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
          enum: [null, 1, 2, 3],
          default: null,
        },
      },
      required: true,
    },
    property_details: {
      type: [
        {
          address: {
            type: {
              province: {
                type: String,
                trim: true,
                required: true,
              },
              municipality: {
                type: String,
                trim: true,
                required: true,
              },
            },
            required: true,
          },
          features: {
            type: {
              bed_room: {
                type: Number,
                enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                required: true,
              },
              bath_room: {
                type: Number,
                enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                required: true,
              },
              garage: {
                type: Boolean,
                required: true,
              },
              garden: {
                type: Boolean,
                required: true,
              },
              pool: {
                type: Boolean,
                required: true,
              },
              furnished: {
                type: Boolean,
                required: true,
              },
            },
            required: true,
          },
        },
      ],
      required: true,
    },
  })
);
