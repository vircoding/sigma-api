import jwt from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager.js";

export const requireRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("no token");

    const { uid } = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    req.uid = uid;
    next();
  } catch (error) {
    if (!tokenVerificationErrors[error.message])
      return res.status(401).json({ error: "Non-documentated error" });
    return res.status(401).json({ error: tokenVerificationErrors[error.message] });
  }
};
