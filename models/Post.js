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
      garage: {
        type: Boolean,
        required: true,
        default: false,
      },
      garden: {
        type: Boolean,
        required: true,
        default: false,
      },
      pool: {
        type: Boolean,
        required: true,
        default: false,
      },
      furnished: {
        type: Boolean,
        required: true,
        default: false,
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
  favorite_count: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const Post = model("Post", postSchema);
