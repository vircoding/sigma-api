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
  const expiresIn = 60 * 60 * 24 * 30; // 30 Days
  try {
    const refreshToken = jwt.sign({ uid }, process.env.JWT_REFRESH, { expiresIn });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODE === "developer"),
      expires: new Date(Date.now() + expiresIn * 1000),
    });
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
