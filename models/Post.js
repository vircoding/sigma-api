import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  address: {
    type: {
      province: {
        type: String,
        required: true,
      },
      municipality: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  features: {
    type: {
      living_room: {
        type: Number,
        required: true,
        default: 0,
      },
      bed_room: {
        type: Number,
        required: true,
        default: 0,
      },
      bath_room: {
        type: Number,
        required: true,
        default: 0,
      },
      dinning_room: {
        type: Number,
        required: true,
        default: 0,
      },
      kitchen: {
        type: Number,
        required: true,
        default: 0,
      },
      garage: {
        type: Number,
        required: true,
        default: 0,
      },
      garden: {
        type: Number,
        required: true,
        default: 0,
      },
      pool: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  visits_count: {
    type: Number,
    required: true,
    default: 1,
  },
});

export const Post = model("Post", postSchema);
