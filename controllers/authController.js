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

// Login
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
          public_email: user.info.public_email,
          contact: {
            code: user.info.contact.code,
            phone: user.info.contact.phone,
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

// Register Client
export const registerClient = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const client = new Client({
      email,
      password,
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
      info: {
        username,
      },
    });

    const { token, expiresIn } = generateToken(client.id);
    generateRefreshToken(client.id, res);

    await client.save();

    return res.json({
      info: {
        username: client.info.username,
      },
      credentials: {
        token,
        expiresIn,
        role: client.__t,
      },
      posts: client.posts.map((item) => item.post_id),
      favorites: client.favorites.map((item) => {
        return {
          id: item.post_id,
          status: item.status,
        };
      }),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ error: "User exists already" });
    }
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Register Agent
export const registerAgent = async (req, res) => {
  const { email, password, firstname, lastname, code, phone, bio, public_email } = req.body;

  try {
    const agent = new Agent({
      email,
      password,
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
      info: {
        firstname,
        lastname,
        bio,
        public_email,
        contact: {
          code,
          phone,
        },
      },
    });

    const { token, expiresIn } = generateToken(agent.id);
    generateRefreshToken(agent.id, res);

    await agent.save();

    return res.json({
      info: {
        firstname: agent.info.firstname,
        lastname: agent.info.lastname,
        bio: agent.info.bio,
        public_email: agent.info.public_email,
        contact: {
          code: agent.info.contact.code,
          phone: agent.info.contact.phone,
        },
      },
      credentials: {
        token,
        expiresIn,
        role: agent.__t,
      },
      posts: agent.posts.map((item) => item.post_id),
      favorites: agent.favorites.map((item) => {
        return {
          id: item.post_id,
          status: item.status,
        };
      }),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ error: "User exists already" });
    }
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
