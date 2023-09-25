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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(403).json({ error: "Invalid Credentials" });

    const passwordVal = await user.comparePassword(req.body.password);
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
  try {
    if (req.body.role === "client") {
      const client = new Client({
        email: req.body.email,
        password: req.body.password,
        info: {
          username: req.body.info.username,
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

      const { token, expiresIn } = generateToken(client._id);
      generateRefreshToken(client._id, res);

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
    } else if (req.body.role === "agent") {
      const agent = new Agent({
        email: req.body.email,
        password: req.body.password,
        info: {
          firstname: req.body.info.firstname,
          lastname: req.body.info.lastname,
          bio: req.body.info.bio,
        },
        contact_details: {
          public_email: req.body.contact_details.public_email,
          whatsapp: {
            code: req.body.contact_details.whatsapp.code,
            phone: req.body.contact_details.whatsapp.phone,
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

      const { token, expiresIn } = generateToken(agent._id);
      generateRefreshToken(agent._id, res);

      await agent.save();

      return res.json({
        info: {
          firstname: agent.info.firstname,
          lastname: agent.info.lastname,
          bio: agent.info.bio,
        },
        contact_details: {
          public_email: agent.contact_details.public_email,
          whatsapp: {
            code: agent.contact_details.whatsapp.code,
            phone: agent.contact_details.whatsapp.phone,
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
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ error: "User exists already" });
    }
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
