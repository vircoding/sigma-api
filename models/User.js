import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  meta: {
    type: {
      connections: {
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
      visits: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    required: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  posts: {
    type: [
      {
        post_id: {
          type: Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
      },
    ],
    required: true,
    default: [],
  },
  favorites: {
    type: [
      {
        post_id: {
          type: Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
        status: {
          type: String,
          enum: ["active", "deleted", "soldout"],
          default: "active",
        },
      },
    ],
    required: true,
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log(error);
    throw new Error("Password hash failed");
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);
