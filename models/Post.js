import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: [
      {
        province: {
          type: String,
          required: true,
        },
        municipality: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
  features: {
    type: [
      {
        bed_room: {
          type: Number,
          required: true,
        },
        bath_room: {
          type: Number,
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
    ],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  contact_details: {
    type: [
      {
        contact_type: {
          type: String,
          enum: ["phone", "whatsapp"],
          required: true,
        },
        contact: {
          type: {
            code: {
              type: String,
              required: true,
            },
            phone: {
              type: String,
              required: true,
            },
          },
          required: true,
        },
      },
    ],
    required: true,
  },
  meta: {
    type: {
      date: {
        type: Date,
        required: true,
      },
      visits_count: {
        type: Number,
        required: true,
        default: 0,
      },
      favorite_count: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    required: true,
  },
});

export const Post = model("Post", postSchema);
