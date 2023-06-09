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

    const { token, expiresIn } = generateToken(client.id);
    generateRefreshToken(client.id, res);

    await client.save();

    return res.json({
      info: {
        username: client.username,
      },
      credentials: {
        token,
        expiresIn,
        role: "client",
      },
    });
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

    const { token, expiresIn } = generateToken(agent.id);
    generateRefreshToken(agent.id, res);

    await agent.save();

    return res.json({
      info: {
        firstname: agent.firstname,
        lastname: agent.lastname,
        phone: agent.phone,
        bio: agent.bio,
        public_email: agent.public_email,
      },
      credentials: {
        token,
        expiresIn,
        role: "agent",
      },
    });
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

    if (user.__t === "client") {
      return res.json({
        info: {
          username: user.username,
        },
        credentials: {
          token,
          expiresIn,
          role: user.__t,
        },
      });
    } else if (user.__t === "agent") {
      return res.json({
        info: {
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          bio: user.bio,
          public_email: user.public_email,
        },
        credentials: {
          token,
          expiresIn,
          role: user.__t,
        },
      });
    }
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
        __t: user.__t,
      });
    } else if (user.__t === "agent") {
      return res.json({
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        bio: user.bio,
        public_email: user.public_email,
        __t: user.__t,
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
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "sigma-api-ehki.onrender.com",
      path: "/",
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findById(req.uid);

    if (!user) return res.status(404).json({ error: "User not founded" });

    user.username = username;
    user.save();

    return res.json({
      username: user.username,
      __t: user.__t,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateAgent = async (req, res) => {
  try {
    const { firstname, lastname, phone, bio, public_email } = req.body;
    const user = await User.findById(req.uid);

    if (!user) return res.status(404).json({ error: "User not founded" });

    user.firstname = firstname;
    user.lastname = lastname;
    user.phone = phone;
    user.bio = bio;
    user.public_email = public_email;
    user.save();

    return res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      bio: user.bio,
      public_email: user.public_email,
      __t: user.__t,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
