import mongoose from "mongoose";
import { User } from "../models/User.js";

export const Agent = User.discriminator(
  "agent",
  new mongoose.Schema({
    avatar: {
      type: String,
      required: true,
    },
    info: {
      type: {
        firstname: {
          type: String,
          trim: true,
          required: true,
        },
        lastname: {
          type: String,
          trim: true,
          required: true,
        },
        bio: {
          type: String,
          trim: true,
        },
      },
      required: true,
    },
    contact_details: {
      type: {
        public_email: {
          type: String,
          trim: true,
          required: true,
        },
        whatsapp: {
          type: {
            code: {
              type: String,
              trim: true,
              required: true,
            },
            phone: {
              type: String,
              trim: true,
              required: true,
            },
          },
          required: true,
        },
      },
      required: true,
    },
  })
);
