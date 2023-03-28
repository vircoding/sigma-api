import { User } from "../models/User.js";
import { generateToken, generateRefreshToken } from "../utils/tokenManager.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    return res.status(201).json({ ok: true });
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

export const infoUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    return res.json({ username: user.username, email: user.email, uid: user.id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const refresh = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("no token");

    const { uid } = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    const { token, expiresIn } = generateToken(uid);

    return res.json({ token, expiresIn });
  } catch (error) {
    const tokenVerificationErrors = {
      "no token": "There's no token",
      "no bearer": "Non-valid token format, please use Bearer",
      "invalid signature": "Non-valid jwt sign",
      "jwt expired": "JWT expired",
      "jwt malformed": "Non-valid JWT format",
      "invalid token": "Non-valid token",
      "invalid algorithm": "Non-valid algorithm",
    };

    if (!tokenVerificationErrors[error.message])
      return res.status(401).json({ error: "Non-documentated error" });
    return res.status(401).json({ error: tokenVerificationErrors[error.message] });
  }
};
