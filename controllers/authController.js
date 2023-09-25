import { User } from "../models/User.js";
import { Client } from "../models/Client.js";
import { Agent } from "../models/Agent.js";
import { generateToken, generateRefreshToken } from "../utils/tokenManager.js";

// Refresh
export const refresh = (req, res) => {
  try {
    const { token, expiresIn } = generateToken(req.uid);
    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ error: "Invalid Credentials" });

    const passwordVal = await user.comparePassword(password);
    if (!passwordVal) return res.status(403).json({ error: "Invalid Credentials" });

    const { token, expiresIn } = generateToken(user._id);
    generateRefreshToken(user._id, res);

    user.meta.visits = user.meta.connections.push({
      date: new Date(),
      ip: req.ip,
      browser: req.headers["user-agent"],
      device: req.headers["user-agent"].match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
        ? "Mobile"
        : "Desktop",
    });

    if (user.meta.visits > 50) {
      user.meta.connections.shift();
      user.meta.visits = user.meta.connections.length;
    }

    await user.save();

    if (user.__t === "client") {
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

export const register = async (req, res) => {
  const { role, email, password, info, contact_details } = req.body;
  let user;

  try {
    if (role === "client") {
      user = new Client({
        email,
        password,
        info: {
          username: info.username,
        },
        meta: {
          connections: [
            {
              date: new Date(),
              ip: req.ip,
              browser: req.headers["user-agent"],
              device: req.headers["user-agent"].match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
                ? "Mobile"
                : "Desktop",
            },
          ],
        },
      });
    } else if (role === "agent") {
      user = new Agent({
        email,
        password,
        info: {
          firstname: info.firstname,
          lastname: info.lastname,
          bio: info.bio,
        },
        contact_details: {
          public_email: public_email,
          whatsapp: {
            code: contact_details.whatsapp.code,
            phone: contact_details.whatsapp.phone,
          },
        },
        meta: {
          connections: [
            {
              date: new Date(),
              ip: req.ip,
              browser: req.headers["user-agent"],
              device: req.headers["user-agent"].match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
                ? "Mobile"
                : "Desktop",
            },
          ],
        },
      });
    }

    const { token, expiresIn } = generateToken(user._id);
    generateRefreshToken(user._id, res);

    await user.save();

    if (role === "client") {
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
    } else if (role === "agent") {
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
    if (error.code === 11000) {
      return res.status(403).json({ error: "User exists already" });
    }
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
