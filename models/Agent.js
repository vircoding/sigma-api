import mongoose from "mongoose";
import { User } from "../models/User.js";

export const Agent = User.discriminator(
  "agent",
  new mongoose.Schema({
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
  })
);
