import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
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
    default: 1,
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
