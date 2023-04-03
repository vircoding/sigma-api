import { Post } from "../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ uid: req.uid });

    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
