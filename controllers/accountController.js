import { User } from "../models/User.js";
import { Sale } from "../models/Sale.js";
import { Rent } from "../models/Rent.js";
import { Exchange } from "../models/Exchange.js";
import { Post } from "../models/Post.js";
import { Client } from "../models/Client.js";
import { Agent } from "../models/Agent.js";
import { generateToken, generateRefreshToken } from "../utils/tokenManager.js";

// Get User
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    if (user.__t === "client") {
      return res.json({
        info: {
          username: user.info.username,
        },
        credentials: {
          role: user.__t,
        },
        posts: user.posts.map((item) => item.post_id),
        favorites: user.favorites.map((item) => {
          return {
            id: item.post_id,
            status: item.status,
          };
        }),
      });
    } else if (user.__t === "agent") {
      return res.json({
        info: {
          firstname: user.info.firstname,
          lastname: user.info.lastname,
          bio: user.info.bio,
          public_email: user.info.public_email,
          contact: {
            code: user.info.contact.code,
            phone: user.info.contact.phone,
          },
        },
        credentials: {
          role: user.__t,
        },
        posts: user.posts.map((item) => item.post_id),
        favorites: user.favorites.map((item) => {
          return {
            id: item.post_id,
            status: item.status,
          };
        }),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get Info
export const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    if (user.__t === "client") {
      return res.json({
        info: {
          username: user.info.username,
        },
      });
    } else if (user.__t === "agent") {
      return res.json({
        info: {
          firstname: user.info.firstname,
          lastname: user.info.lastname,
          bio: user.info.bio,
          public_email: user.info.public_email,
          contact: {
            code: user.info.contact.code,
            phone: user.info.contact.phone,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get Role
export const getRole = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    return res.json({
      credentials: {
        role: user.__t,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get Posts
export const getPosts = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    return res.json({
      posts: user.posts.map((item) => item.post_id),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get Favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    return res.json({
      favorites: user.favorites.map((item) => {
        return {
          id: item.post_id,
          status: item.status,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Insert Post
export const insertPost = async (req, res) => {
  try {
    if (req.body.type === "sale") {
      const sale = new Sale({});

      return res.json({});
    } else if (req.body.type === "rent") {
      const rent = new Rent({});

      return res.json({});
    } else if (req.body.type === "exchange") {
      const exchange = new Exchange({});

      return res.json({});
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
