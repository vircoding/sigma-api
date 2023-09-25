import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Sale } from "../models/Sale.js";
import { Rent } from "../models/Rent.js";
import { Exchange } from "../models/Exchange.js";

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
        },
        contact_details: {
          public_email: user.info.public_email,
          whatsapp: {
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
        },
        contact_details: {
          public_email: user.info.public_email,
          whatsapp: {
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
      role: user.__t,
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
      const sale = new Sale({
        uid: req.uid,
        description: req.body.description,
        contact_details: {
          contact_types: {
            phone: req.body.contact_details.contact_types.phone,
            whatsapp: req.body.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: req.body.contact_details.contact.code,
            phone: req.body.contact_details.contact.phone,
          },
        },
        property_details: req.body.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        amount_details: {
          amount: req.body.amount_details.amount,
          currency: req.body.amount_details.currency,
        },
      });

      await sale.save();

      return res.json({
        id: sale._id,
        uid: sale.uid,
        type: sale.__t,
        description: sale.description,
        contact_details: {
          contact_types: {
            phone: sale.contact_details.contact_types.phone,
            whatsapp: sale.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: sale.contact_details.contact.code,
            phone: sale.contact_details.contact.phone,
          },
        },
        property_details: sale.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        amount_details: {
          amount: sale.amount_details.amount,
          currency: sale.amount_details.currency,
        },
      });
    } else if (req.body.type === "rent") {
      const rent = new Rent({
        uid: req.uid,
        description: req.body.description,
        contact_details: {
          contact_types: {
            phone: req.body.contact_details.contact_types.phone,
            whatsapp: req.body.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: req.body.contact_details.contact.code,
            phone: req.body.contact_details.contact.phone,
          },
        },
        property_details: req.body.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        amount_details: {
          amount: req.body.amount_details.amount,
          currency: req.body.amount_details.currency,
          frequency: req.body.amount_details.frequency,
        },
      });

      await rent.save();

      return res.json({
        id: rent._id,
        uid: rent.uid,
        type: rent.__t,
        description: rent.description,
        contact_details: {
          contact_types: {
            phone: rent.contact_details.contact_types.phone,
            whatsapp: rent.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: rent.contact_details.contact.code,
            phone: rent.contact_details.contact.phone,
          },
        },
        property_details: rent.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        amount_details: {
          amount: rent.amount_details.amount,
          currency: rent.amount_details.currency,
          frequency: rent.amount_details.frequency,
        },
      });
    } else if (req.body.type === "exchange") {
      const exchange = new Exchange({
        uid: req.uid,
        description: req.body.description,
        contact_details: {
          contact_types: {
            phone: req.body.contact_details.contact_types.phone,
            whatsapp: req.body.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: req.body.contact_details.contact.code,
            phone: req.body.contact_details.contact.phone,
          },
        },
        property_details: req.body.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        offer_details: {
          offers: req.body.offer_details.offers,
          needs: {
            enable: req.body.offer_details.needs.enable,
            count: req.body.offer_details.needs.count,
          },
        },
      });

      await exchange.save();

      return res.json({
        id: exchange._id,
        uid: exchange.uid,
        type: exchange.__t,
        description: exchange.description,
        contact_details: {
          contact_types: {
            phone: exchange.contact_details.contact_types.phone,
            whatsapp: exchange.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: exchange.contact_details.contact.code,
            phone: exchange.contact_details.contact.phone,
          },
        },
        property_details: exchange.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        offer_details: {
          offers: exchange.offer_details.offers,
          needs: {
            enable: exchange.offer_details.needs.enable,
            count: exchange.offer_details.needs.count,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    if (user.__t !== req.body.role) return res.status(400).json({ errror: "Roles dont match" });

    if (user.__t === "client") {
      user.info.username = req.body.info.username;

      await user.save();

      return res.json({
        info: {
          username: user.info.username,
        },
        credentials: {
          token,
          expiresIn,
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
      user.info.firstname = req.body.info.firstname;
      user.info.lastname = req.body.info.lastname;
      user.info.bio = req.body.info.bio;
      user.contact_details.public_email = req.body.contact_details.public_email;
      user.contact_details.whatsapp.code = req.body.contact_details.whatsapp.code;
      user.contact_details.whatsapp.phone = req.body.contact_details.whatsapp.phone;

      await user.save();

      return res.json({
        info: {
          firstname: user.info.firstname,
          lastname: user.info.lastname,
          bio: user.info.bio,
        },
        contact_details: {
          public_email: user.contact_details.public_email,
          whatsapp: {
            code: user.contact_details.whatsapp.code,
            phone: user.contact_details.whatsapp.phone,
          },
        },
        credentials: {
          token,
          expiresIn,
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

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not founded" });
    if (!post.uid.equals(req.uid)) return res.status(401).json({ error: "UID doesn't match" });

    post.description = req.body.description;
    post.contact_details.contact_types.phone = req.body.contact_details.contact_types.phone;
    post.contact_details.contact_types.whatsapp = req.body.contact_details.contact_types.whatsapp;
    post.contact_details.contact.code = req.body.contact_details.contact.code;
    post.property_details = req.body.property_details.map((item) => {
      return {
        address: {
          province: item.address.province,
          municipality: item.address.municipality,
        },
        features: {
          bed_room: item.features.bed_room,
          bath_room: item.features.bath_room,
          garage: item.features.garage,
          garden: item.features.garden,
          pool: item.features.pool,
          furnished: item.features.furnished,
        },
      };
    });

    if (post.__t === "sale") {
      post.amount_details.amount = req.body.amount_details.amount;
      post.amount_details.currency = req.body.amount_details.currency;

      await post.save();

      return res.json({
        id: post._id,
        uid: post.uid,
        type: post.__t,
        description: post.description,
        contact_details: {
          contact_types: {
            phone: post.contact_details.contact_types.phone,
            whatsapp: post.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: post.contact_details.contact.code,
            phone: post.contact_details.contact.phone,
          },
        },
        property_details: post.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        amount_details: {
          amount: post.amount_details.amount,
          currency: post.amount_details.currency,
        },
      });
    } else if (post.__t === "rent") {
      post.amount_details.amount = req.body.amount_details.amount;
      post.amount_details.currency = req.body.amount_details.currency;
      post.amount_details.frequency = req.body.amount_details.frequency;

      await post.save();

      return res.json({
        id: post._id,
        uid: post.uid,
        type: post.__t,
        description: post.description,
        contact_details: {
          contact_types: {
            phone: post.contact_details.contact_types.phone,
            whatsapp: post.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: post.contact_details.contact.code,
            phone: post.contact_details.contact.phone,
          },
        },
        property_details: post.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        amount_details: {
          amount: post.amount_details.amount,
          currency: post.amount_details.currency,
        },
      });
    } else if (post.__t === "exchange") {
      post.offer_details.offers = req.body.offer_details.offers;
      post.offer_details.needs.enable = req.body.offer_details.needs.enable;
      post.offer_details.needs.count = req.body.offer_details.needs.count;

      await post.save();

      return res.json({
        id: post._id,
        uid: post.uid,
        type: post.__t,
        description: post.description,
        contact_details: {
          contact_types: {
            phone: post.contact_details.contact_types.phone,
            whatsapp: post.contact_details.contact_types.whatsapp,
          },
          contact: {
            code: post.contact_details.contact.code,
            phone: post.contact_details.contact.phone,
          },
        },
        property_details: post.property_details.map((item) => {
          return {
            address: {
              province: item.address.province,
              municipality: item.address.municipality,
            },
            features: {
              bed_room: item.features.bed_room,
              bath_room: item.features.bath_room,
              garage: item.features.garage,
              garden: item.features.garden,
              pool: item.features.pool,
              furnished: item.features.furnished,
            },
          };
        }),
        offer_details: {
          offers: post.offer_details.offers,
          needs: {
            enable: post.offer_details.needs.enable,
            count: post.offer_details.needs.count,
          },
        },
      });
    }
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    return res.status(500).json({ error: "Server error" });
  }
};

export const addFavorite = async (req, res) => {
  const remove = Boolean(req.query.remove) || false;
  try {
    const user = await User.findById(req.uid);
    const { id } = req.params;

    if (remove) {
      const newFavorites = user.favorites.filter((item) => item.id.toString() !== id);
      user.favorites = newFavorites;

      await user.save();
    } else {
      const post = await Post.findById(id);

      if (!post) return res.status(404).json({ error: "Post not founded" });

      if (!user.favorites.find((item) => item.id.toString() === id)) {
        user.favorites.push({ id });
        post.favorite_count += 1;
      } else {
        const newFavorites = user.favorites.filter((item) => item.id.toString() !== id);
        user.favorites = newFavorites;
        post.favorite_count -= 1;
      }
      await user.save();
      await post.save();
    }

    res.json({
      favorites: user.favorites.map((item) => {
        return {
          id: item.id,
          status: item.status,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
