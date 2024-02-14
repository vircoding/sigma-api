import { Router } from "express";
import multer from "multer";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import { loginValidator, userValidator } from "../middlewares/requestValidator.js";
import { refresh, logout, login, register } from "../controllers/authController.js";
import { parsePostReq } from "../middlewares/parseReq.js";

const router = Router();
const avatarUploads = multer({ dest: "uploads/avatars/" });

// GET
router.get("/", requireRefreshToken, refresh); // Refresh
router.get("/logout", logout); // Logout

// POST
router.post("/login", loginValidator, login); // Login
router.post(
  "/register",
  // (req, res, next) => {
  //   try {
  //     const data = JSON.parse(req.body.data);
  //     if (data.type === "client" && req.body.avatar) {
  //       throw new Error("Files Sended");
  //     } else {
  //       next();
  //     }
  //   } catch (error) {
  //     if (error === "Files Sended") return res.status(403).json({ error });
  //     else return res.status(500).json({ error: "Server error" });
  //   }
  // },
  avatarUploads.single("avatar"),
  parsePostReq,
  userValidator,
  register
); // Register

export default router;
