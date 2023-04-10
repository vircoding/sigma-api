import { User } from "../models/User.js";
import { generateToken, generateRefreshToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    return res.status(201).json({ token, expiresIn });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "User exists already" });
    }
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(403).json({ error: "User doesn't exist already" });

    const passwordVal = await user.comparePassword(password);
    if (!passwordVal) return res.status(403).json({ error: "Wrong Password" });

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

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
    return res.json({ username: user.username, email: user.email, uid: user.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req, res) => {
  console.log(req.cookies.refreshToken);
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};
