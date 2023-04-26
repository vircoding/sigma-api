import { User } from "../models/User.js";
import { Client } from "../models/Client.js";
import { Agent } from "../models/Agent.js";
import { generateToken, generateRefreshToken } from "../utils/tokenManager.js";

export const registerClient = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const client = new Client({
      email,
      password,
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
      username,
    });
    await client.save();

    const { token, expiresIn } = generateToken(client.id);
    generateRefreshToken(client.id, res);

    return res.status(201).json({ token, expiresIn });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ error: "User exists already" });
    }
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const registerAgent = async (req, res) => {
  const { email, password, firstname, lastname, phone, bio, public_email } = req.body;
  try {
    const agent = new Agent({
      email,
      password,
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
      firstname,
      lastname,
      phone,
      bio,
      public_email,
    });
    await agent.save();

    const { token, expiresIn } = generateToken(agent.id);
    generateRefreshToken(agent.id, res);

    return res.status(201).json({ token, expiresIn });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(403).json({ error: "User exists already" });
    }
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

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    user.visits = user.connections.push({
      date: new Date(),
      ip: req.ip,
      browser: req.headers["user-agent"],
      device: req.headers["user-agent"].match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
        ? "Mobile"
        : "Desktop",
    });

    if (user.visits > 50) {
      user.connections.shift();
      user.visits = user.connections.length;
    }

    await user.save();

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const refresh = (req, res) => {
  try {
    const { token, expiresIn } = generateToken(req.uid);
    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const user = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    if (user.__t === "client") {
      return res.json({
        username: user.username,
      });
    } else if (user.__t === "agent") {
      return res.json({
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        bio: user.bio,
        public_email: user.public_email,
      });
    }
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken");
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
