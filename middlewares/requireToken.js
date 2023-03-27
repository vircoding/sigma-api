import jwt from "jsonwebtoken";

export const requireToken = (req, res, next) => {
  try {
    let token = req.headers?.authorization;
    if (!token) throw new Error("no token");

    token = token.split(" ")[1];
    if (!token) throw new Error("no bearer");

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;

    next();
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
