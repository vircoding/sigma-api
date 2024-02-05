import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  contact_details: {
    type: {
      contact_types: {
        type: {
          phone: {
            type: Boolean,
            required: true,
          },
          whatsapp: {
            type: Boolean,
            required: true,
          },
        },
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
  meta: {
    type: {
      date: {
        type: Date,
        required: true,
      },
      visits_count: {
        type: Number,
        required: true,
      },
      favorite_count: {
        type: Number,
        required: true,
      },
    },
    required: true,
    default: {
      date: new Date(),
      visits_count: 0,
      favorite_count: 0,
    },
  },
});

export const Post = model("Post", postSchema);
