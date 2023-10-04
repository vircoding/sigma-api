import { Post } from "../models/Post.js";
import { Sale } from "../models/Sale.js";
import { Rent } from "../models/Rent.js";
import { Exchange } from "../models/Exchange.js";
import { formatPostRes } from "../utils/formatResponses.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total_posts = await Post.find().countDocuments();

    return res.json({
      posts: posts.map((item) => {
        return formatPostRes(item);
      }),
      page: total_posts === 0 ? 0 : page,
      total_posts,
      total_pages: Math.ceil(total_posts / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getSales = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const sales = await Sale.find()
      .skip((page - 1) * limit)
      .limit();

    const total_sales = await Sale.find().countDocuments();

    return res.json({
      sales: sales.map((item) => {
        return formatPostRes(item);
      }),
      page: total_sales === 0 ? 0 : page,
      total_sales,
      total_pages: Math.ceil(total_sales / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getRents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const rents = await Rent.find()
      .skip((page - 1) * limit)
      .limit();

    const total_rents = await Rent.find().countDocuments();

    return res.json({
      rents: rents.map((item) => {
        return formatPostRes(item);
      }),
      page: total_rents === 0 ? 0 : page,
      total_rents,
      total_pages: Math.ceil(total_rents / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getExchanges = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const exchanges = await Exchange.find()
      .skip((page - 1) * limit)
      .limit();

    const total_exchanges = await Exchange.find().countDocuments();

    return res.json({
      exchanges: exchanges.map((item) => {
        return formatPostRes(item);
      }),
      page: total_exchanges === 0 ? 0 : page,
      total_exchanges,
      total_pages: Math.ceil(total_exchanges / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not founded" });

    return res.json(formatPostRes(post));
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const visitPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not founded" });

    post.meta.visits_count += 1;

    await post.save();

    return res.json({ ok: true });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
