import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: {
      municipality: {
        type: String,
        required: true,
      },
      province: {
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
      },
      bed_room: {
        type: Number,
        required: true,
      },
      bath_room: {
        type: Number,
        required: true,
      },
      dining_room: {
        type: Number,
        required: true,
      },
      kitchen: {
        type: Number,
        required: true,
      },
      garage: {
        type: Number,
        required: true,
      },
      garden: {
        type: Number,
        required: true,
      },
      pool: {
        type: Number,
        required: true,
      },
    },
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  visits: {
    type: [
      {
        date: {
          type: Date,
          required: true,
        },
        ip: {
          type: String,
          required: true,
        },
        browser: {
          type: String,
          required: true,
        },
        device: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  visits_count: {
    type: Number,
    required: true,
    default: 1,
  },
});

export const Post = model("Post", postSchema);
