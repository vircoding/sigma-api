import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { Sale } from "../models/Sale.js";
import { Rent } from "../models/Rent.js";
import { Exchange } from "../models/Exchange.js";
import { formatPostRes } from "../utils/formatResponses.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

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

  const query = {};

  if (req.query.currency) query["amount_details.currency"] = req.query.currency;

  if (req.query.province) query["property_details.address.province"] = req.query.province;

  if (req.query.municipality)
    query["property_details.address.municipality"] = req.query.municipality;

  try {
    // const sales = await Sale.find()
    //   .skip((page - 1) * limit)
    //   .limit();

    const sales = await Sale.find(query);

    // if(req.query.currency === 'usd' || req.query.currency === 'cup') {
    //   sales = sales.where('amount_details.currency').equals(req.query.currency)
    // }

    // if(req.query.amount_gt >= 1 && req.query.amount_gt <= 999999998) {
    //   sales = sales.where('amount_details').gt(req.query.amount_gt)
    // }

    // if(req.query.amount_gt)

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

    // Loading Author
    const user = User.findById(post.uid.toString());
    if (!user) return res.status(404).json({ error: "User not founded" });

    return res.json(formatPostAndAuthorRes(post, user));
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

export const getUserPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const posts = [];

    // Finding User
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    // Finding and pushing Posts
    for (const item of user.posts.slice((page - 1) * limit, page * limit)) {
      const post = await Post.findById(item.post_id.toString());

      if (post) posts.push(post);
      else posts.push({});
    }

    const total_posts = user.posts.length;

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

export const getUserFavorites = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const favorites = [];

    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    for (const item of user.favorites.slice((page - 1) * limit, page * limit)) {
      if (item.status === "active") {
        const post = await Post.findById(item.post_id.toString());

        if (post) favorites.push(post);
        else favorites.push({});
      } else {
        favorites.push({ id: item.post_id });
      }
    }

    const total_favorites = user.favorites.length;

    return res.json({
      favorites: user.favorites.map((item, index) => {
        if (item.status === "active") return formatPostRes(favorites[index]);
        else return favorites[index];
      }),
      page: total_favorites === 0 ? 0 : page,
      total_favorites,
      total_pages: Math.ceil(total_favorites / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPopularPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const popular = await Post.aggregate([
      { $group: { _id: "$meta.visit_count", posts: { $push: "$$ROOT" } } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: 10 },
      { $unwind: "$posts" },
      { $replaceRoot: { newRoot: "$posts" } },
    ]);

    const total_posts = await Post.find().countDocuments();

    return res.json({
      posts: popular.map((item) => {
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

export const getPopularSales = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const popular = await Sale.aggregate([
      { $group: { _id: "$meta.visit_count", sales: { $push: "$$ROOT" } } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: 10 },
      { $unwind: "$sales" },
      { $replaceRoot: { newRoot: "$sales" } },
    ]);

    const total_sales = await Sale.find().countDocuments();

    return res.json({
      sales: popular.map((item) => {
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

export const getPopularRents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const popular = await Rent.aggregate([
      { $group: { _id: "$meta.visit_count", rents: { $push: "$$ROOT" } } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: 10 },
      { $unwind: "$rents" },
      { $replaceRoot: { newRoot: "$rents" } },
    ]);

    const total_rents = await Rent.find().countDocuments();

    return res.json({
      rents: popular.map((item) => {
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

export const getPopularExchanges = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const popular = await Exchange.aggregate([
      { $group: { _id: "$meta.visit_count", exchanges: { $push: "$$ROOT" } } },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: 10 },
      { $unwind: "$exchanges" },
      { $replaceRoot: { newRoot: "$exchanges" } },
    ]);

    const total_exchanges = await Exchange.find().countDocuments();

    return res.json({
      exchanges: popular.map((item) => {
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
