import jwt from "jsonwebtoken";

export const generateToken = (uid) => {
  const expiresIn = 60 * 15; // 15 Minutes

  try {
    const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn });
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const generateRefreshToken = (uid, res) => {
  const expiresIn = 60 * 60 * 24 * 31; // 31 Days
  try {
    const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, { expiresIn });
    if (process.env.MODE === "development") {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        // secure: !(process.env.MODE === "development"),
        secure: false,
        expires: new Date(Date.now() + expiresIn * 1000),
        domain: "localhost",
        path: "/",
      });
    } else if (process.env.MODE === "production") {
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        // secure: !(process.env.MODE === "development"),
        secure: true,
        expires: new Date(Date.now() + expiresIn * 1000),
        domain: "sigmacuba.com",
        path: "/",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const tokenVerificationErrors = {
  "no token": "There's no token",
  "no bearer": "Non-valid token format, please use Bearer",
  "invalid signature": "Non-valid jwt sign",
  "jwt expired": "JWT expired",
  "jwt malformed": "Non-valid JWT format",
  "invalid token": "Non-valid token",
  "invalid algorithm": "Non-valid algorithm",
};
