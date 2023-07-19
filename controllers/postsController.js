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
    try {
      const sale = new Sale({
        uid: req.uid,
        address: {
          province: req.body.province,
          municipality: req.body.municipality,
        },
        features: {
          bed_room: req.body.bed_room,
          bath_room: req.body.bath_room,
          garage: req.body.garage,
          garden: req.body.garden,
          pool: req.body.pool,
          furnished: req.body.furnished,
        },
        phone: req.body.phone,
        description: req.body.description,
        currency: req.body.currency,
        price: req.body.amount,
        date: new Date(),
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
          bed_room: req.body.bed_room,
          bath_room: req.body.bath_room,
          garage: req.body.garage,
          garden: req.body.garden,
          pool: req.body.pool,
          furnished: req.body.furnished,
        },
        phone: req.body.phone,
        description: req.body.description,
        currency: req.body.currency,
        frequency: req.body.frequency,
        tax: req.body.amount,
        date: new Date(),
        visits_count: 0,
      });
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
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not founded" });

    if (!post.uid.equals(req.uid)) return res.status(401).json({ error: "UID doesn't match" });

    if (post.__t === req.body.type) {
      try {
        if (post.__t === "sale") {
          post.price = req.body.amount;
        } else {
          post.tax = req.body.amount;
          post.frequency = req.body.frequency;
        }
        post.address.province = req.body.province;
        post.address.municipality = req.body.municipality;
        post.features.bed_room = req.body.bed_room;
        post.features.bath_room = req.body.bath_room;
        post.features.garage = req.body.garage;
        post.features.garden = req.body.garden;
        post.features.pool = req.body.pool;
        post.features.furnished = req.body.furnished;
        post.phone = req.body.phone;
        post.description = req.body.description;
        post.currency = req.body.currency;

        post.save();
        return res.json({ post });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
      }
    } else {
      if (req.body.type === "sale") {
        try {
          const sale = new Sale({
            uid: req.uid,
            address: {
              province: req.body.province,
              municipality: req.body.municipality,
            },
            features: {
              bed_room: req.body.bed_room,
              bath_room: req.body.bath_room,
              garage: req.body.garage,
              garden: req.body.garden,
              pool: req.body.pool,
              furnished: req.body.furnished,
            },
            phone: req.body.phone,
            description: req.body.description,
            currency: req.body.currency,
            price: req.body.amount,
            date: post.date,
            visits: post.visits,
            visits_count: post.visits_count,
          });
          const newSale = await sale.save();

          await post.deleteOne();

          return res.status(201).json(newSale);
        } catch (error) {
          console.log(error);
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
              bed_room: req.body.bed_room,
              bath_room: req.body.bath_room,
              garage: req.body.garage,
              garden: req.body.garden,
              pool: req.body.pool,
              furnished: req.body.furnished,
            },
            phone: req.body.phone,
            description: req.body.description,
            currency: req.body.currency,
            frequency: req.body.frequency,
            tax: req.body.amount,
            date: post.date,
            visits_count: post.visits_count,
          });
          const newRent = await rent.save();

          await post.deleteOne();

          return res.status(201).json(newRent);
        } catch (error) {
          console.log(error);
          return res.status(500).json({ error: "Server error" });
        }
      }
    }
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    return res.status(500).json({ error: "Server error" });
  }
};

export const visitPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not founded" });

    post.visits_count += 1;

    await post.save();

    res.status(200).json({ post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPopularSales = async (req, res) => {
  try {
    const popular = await Sale.aggregate([
      { $group: { _id: "$visits_count", posts: { $push: "$$ROOT" } } },
      { $sort: { _id: -1 } },
      { $limit: 10 },
      { $unwind: "$posts" },
      { $replaceRoot: { newRoot: "$posts" } },
    ]);
    res.json(popular);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getPopularRents = async (req, res) => {
  try {
    const popular = await Rent.aggregate([
      { $group: { _id: "$visits_count", posts: { $push: "$$ROOT" } } },
      { $sort: { _id: -1 } },
      { $limit: 10 },
      { $unwind: "$posts" },
      { $replaceRoot: { newRoot: "$posts" } },
    ]);
    res.json(popular);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
