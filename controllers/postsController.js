import { Post } from "../models/Post.js";
import { Sale } from "../models/Sale.js";
import { Rent } from "../models/Rent.js";

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
  if (req.body.type === "sale") {
    console.log("Es venta");
    try {
      const sale = new Sale({
        uid: req.uid,
        address: {
          province: req.body.province,
          municipality: req.body.municipality,
        },
        features: {
          living_room: req.body.living_room,
          bed_room: req.body.bed_room,
          bath_room: req.body.bath_room,
          dinning_room: req.body.dinning_room,
          kitchen: req.body.kitchen,
          garage: req.body.garage,
          garden: req.body.garden,
          pool: req.body.pool,
        },
        phone: req.body.phone,
        description: req.body.description,
        currency: req.body.currency,
        price: req.body.amount,
        date: new Date(),
        visits: [],
        visits_count: 0,
      });
      const newSale = await sale.save();

      return res.status(201).json(newSale);
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    try {
      const rent = new Rent({
        uid: req.uid,
        address: {
          province: req.body.province,
          municipality: req.body.municipality,
        },
        features: {
          living_room: req.body.living_room,
          bed_room: req.body.bed_room,
          bath_room: req.body.bath_room,
          dinning_room: req.body.dinning_room,
          kitchen: req.body.kitchen,
          garage: req.body.garage,
          garden: req.body.garden,
          pool: req.body.pool,
        },
        phone: req.body.phone,
        description: req.body.description,
        currency: req.body.currency,
        frequency: req.body.frequency,
        tax: req.body.amount,
        date: new Date(),
        visits: [],
        visits_count: 0,
      });
      console.log("here");
      const newRent = await rent.save();

      return res.status(201).json(newRent);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
};

export const removePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not founded" });

    if (!post.uid.equals(req.uid)) return res.status(401).json({ error: "UID doesn't match" });

    await post.deleteOne();

    return res.json({ post });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    return res.status(500).json({ error: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { buy, price } = req.body;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not founded" });

    if (!post.uid.equals(req.uid)) return res.status(401).json({ error: "UID doesn't match" });

    post.buy = buy;
    post.price = price;
    post.save();

    return res.json({ post });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    return res.status(500).json({ error: "Server error" });
  }
};
