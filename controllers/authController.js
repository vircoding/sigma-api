import { User } from "../models/User.js";
import { Client } from "../models/Client.js";
import { Agent } from "../models/Agent.js";
import { generateToken, generateRefreshToken } from "../utils/tokenManager.js";
import { formatUserRes } from "../utils/formatResponses.js";
import { saveAvatar } from "../utils/saveImage.js";

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

export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "sigma-api-ehki.onrender.com",
      path: "/",
    });
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
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

    const response = formatUserRes(user);
    response.credentials.token = token;
    response.credentials.expiresIn = expiresIn;

    return res.json(response);
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

      const response = formatUserRes(client);
      response.credentials.token = token;
      response.credentials.expiresIn = expiresIn;

      return res.json(response);
    } else if (req.body.role === "agent") {
      const agent = new Agent({
        avatar:
          process.env.MODE === "developer"
            ? "http://localhost:5000/standard-avatar.jpg"
            : "https://sigmacuba.com/standard-avatar.jpg",
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

      // Renaming Avatar
      const uid = agent._id;
      const avatar = saveAvatar(req.file, uid);
      agent.avatar = avatar;
      await agent.save();

      const response = formatUserRes(agent);
      response.credentials.token = token;
      response.credentials.expiresIn = expiresIn;

      return res.json(response);
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ error: "User exists already" });
    }
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
