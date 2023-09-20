import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contact_details: {
    type: [
      {
        contact_type: {
          type: String,
          enum: ["phone", "whatsapp"],
          trim: true,
          required: true,
        },
        contact: {
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
