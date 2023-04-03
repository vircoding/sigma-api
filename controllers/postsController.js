import { Post } from "../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ uid: req.uid });

    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const setPost = async (req, res) => {
  try {
    const { buy, price } = req.body;
    const post = new Post({ buy, price, uid: req.uid });
    const newPost = await post.save();

    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
