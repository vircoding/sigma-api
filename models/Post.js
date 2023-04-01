import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema({
  buy: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  uid: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Post = model("Post", postSchema);
