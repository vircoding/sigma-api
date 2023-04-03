import { Post } from "../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ uid: req.uid });

    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not founded" });

    return res.json({ post });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
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

export const removePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "No existe el post" });

    if (!post.uid.equals(req.uid))
      return res.status(401).json({ error: "No le pertenece ese id 🤡" });

    await post.deleteOne();

    return res.json({ post });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    return res.status(500).json({ error: "Server error" });
  }
};
