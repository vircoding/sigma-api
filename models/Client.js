import mongoose from "mongoose";
import { User } from "../models/User.js";

export const Client = User.discriminator(
  "client",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
      default: "new_user",
    },
  })
);
