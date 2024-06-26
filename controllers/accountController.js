import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Sale } from "../models/Sale.js";
import { Rent } from "../models/Rent.js";
import { Exchange } from "../models/Exchange.js";
import { formatUserRes, formatPostRes } from "../utils/formatResponses.js";
import {
  saveImage,
  removeImage,
  updateAvatar,
  getStandardImageUrl,
  unlinkImage,
  deleteOldAvatar,
} from "../utils/saveImage.js";

// Get User
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    return res.json(formatUserRes(user));
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
          public_email: user.contact_details.public_email,
          whatsapp: {
            code: user.contact_details.whatsapp.code,
            phone: user.contact_details.whatsapp.phone,
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
          post_id: item.post_id,
          status: item.status,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const insertPost = async (req, res) => {
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    if (req.body.type === "sale") {
      const sale = new Sale({
        uid: req.uid,
        author_role: user.__t,
        images: [getStandardImageUrl()],
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

      // Renaming Images
      const postId = sale._id;
      const images = req.files.map((item) => {
        return saveImage(item, postId);
      });
      sale.images = images;
      await sale.save();

      // Update User Posts Array
      user.posts.push({ post_id: sale._id });
      await user.save();

      return res.json({
        post: formatPostRes(sale),
        posts: user.posts.map((item) => item.post_id),
      });
    } else if (req.body.type === "rent") {
      const rent = new Rent({
        uid: req.uid,
        author_role: user.__t,
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

      // Renaming Images
      const postId = rent._id;
      const images = req.files.map((item) => {
        return saveImage(item, postId);
      });
      rent.images = images;
      await rent.save();

      // Update User Posts Array
      user.posts.push({ post_id: rent._id });
      await user.save();

      return res.json({
        post: formatPostRes(rent),
        posts: user.posts.map((item) => item.post_id),
      });
    } else if (req.body.type === "exchange") {
      const exchange = new Exchange({
        uid: req.uid,
        author_role: user.__t,
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

      // Renaming Images
      const postId = exchange._id;
      const images = req.files.map((item) => {
        return saveImage(item, postId);
      });
      exchange.images = images;
      await exchange.save();

      // Update User Posts Array
      user.posts.push({ post_id: exchange._id });
      await user.save();

      return res.json({
        post: formatPostRes(exchange),
        posts: user.posts.map((item) => item.post_id),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  let removedAvatar = false;
  try {
    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    if (user.__t !== req.body.role) return res.status(400).json({ errror: "Roles don't match" });

    if (user.__t === "client") {
      user.info.username = req.body.info.username;
    } else if (user.__t === "agent") {
      user.info.firstname = req.body.info.firstname;
      user.info.lastname = req.body.info.lastname;
      user.info.bio = req.body.info.bio;
      user.contact_details.public_email = req.body.contact_details.public_email;
      user.contact_details.whatsapp.code = req.body.contact_details.whatsapp.code;
      user.contact_details.whatsapp.phone = req.body.contact_details.whatsapp.phone;

      if (req.file) {
        const avatar = updateAvatar(req.file, req.uid);
        user.avatar = avatar;
        removedAvatar = true;
      }
    }

    await user.save();

    if (removedAvatar) {
      deleteOldAvatar(user._id);
    }

    res.json(formatUserRes(user));
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
    if (post.__t !== req.body.type) return res.status(400).json({ error: "Types don't match" });

    post.description = req.body.description;
    post.contact_details.contact_types.phone = req.body.contact_details.contact_types.phone;
    post.contact_details.contact_types.whatsapp = req.body.contact_details.contact_types.whatsapp;
    post.contact_details.contact.code = req.body.contact_details.contact.code;
    post.contact_details.contact.phone = req.body.contact_details.contact.phone;
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
    } else if (post.__t === "rent") {
      post.amount_details.amount = req.body.amount_details.amount;
      post.amount_details.currency = req.body.amount_details.currency;
      post.amount_details.frequency = req.body.amount_details.frequency;
    } else if (post.__t === "exchange") {
      post.offer_details.offers = req.body.offer_details.offers;
      post.offer_details.needs.enable = req.body.offer_details.needs.enable;
      post.offer_details.needs.count = req.body.offer_details.needs.count;
    }

    const newImagesCount = post.images.length + req.files.length - req.body.removed_images.length;
    const unlinkedImages = [];
    if (newImagesCount > 0 && newImagesCount <= 10) {
      const imageList = post.images;
      req.body.removed_images.forEach((item) => {
        const filename = imageList[item].replace(
          process.env.MODE === "development"
            ? `http://localhost:5000/uploads/images/`
            : `https://sigmacuba.com/uploads/images/`,
          ""
        );
        const result = removeImage(filename);
        if (result) {
          post.images = post.images.filter(
            (item) =>
              item.replace(
                process.env.MODE === "development"
                  ? `http://localhost:5000/uploads/images/`
                  : `https://sigmacuba.com/uploads/images/`,
                ""
              ) !== filename
          );
          unlinkedImages.push(
            imageList[item].replace(
              process.env.MODE === "development"
                ? `http://localhost:5000/uploads/images/`
                : `https://sigmacuba.com/uploads/images/`,
              ""
            )
          );
        }
      });
    }

    // Pushing Images
    const postId = post._id;
    req.files.forEach((item) => {
      post.images.push(saveImage(item, postId));
    });

    await post.save();

    // Unlink Images
    unlinkedImages.forEach((item) => {
      unlinkImage(item, true);
    });

    return res.json(formatPostRes(post));
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    const post = await Post.findById(id);

    if (user.favorites.find((item) => item.post_id.toString() === id)) {
      user.favorites = user.favorites.filter((item) => item.post_id.toString() !== id);

      await user.save();

      if (post) {
        post.meta.favorite_count -= 1;
        await post.save();
      }
    } else {
      if (!post) return res.status(404).json({ error: "Post not founded" });
      user.favorites.push({ post_id: id });
      post.favorite_count += 1;

      await user.save();
      await post.save();
    }

    res.json({
      favorites: user.favorites.map((item) => {
        return {
          post_id: item.post_id,
          status: item.status,
        };
      }),
    });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not founded" });

    const user = await User.findById(req.uid);
    if (!user) return res.status(404).json({ error: "User not founded" });

    if (!post.uid.equals(req.uid)) return res.status(401).json({ error: "UID doesn't match" });

    await post.deleteOne();

    post.images.forEach((item) => {
      unlinkImage(
        item.replace(
          process.env.MODE === "development"
            ? `http://localhost:5000/uploads/images/`
            : `https://sigmacuba.com/uploads/images/`,
          ""
        ),
        false
      );
    });

    await User.updateMany(
      { "favorites.post_id": id },
      { $set: { "favorites.$.status": "deleted" } }
    );

    // Updating User Posts
    const newPosts = user.posts.filter((item) => item.post_id.toString() !== id);
    user.posts = newPosts;
    await user.save();

    return res.json({ posts: user.posts.map((item) => item.post_id) });
  } catch (error) {
    if (error.kind === "ObjectId") return res.status(403).json({ error: "non-valid Post ID" });
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
