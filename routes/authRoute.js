import { Router } from "express";
import multer from "multer";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import { loginValidator, userValidator } from "../middlewares/requestValidator.js";
import { refresh, logout, login, register } from "../controllers/authController.js";
import { parsePostReq } from "../middlewares/parseReq.js";

const router = Router();
const avatarUploads = multer({ dest: "dist/uploads/avatars/" });

// GET
router.get("/", requireRefreshToken, refresh); // Refresh
router.get("/logout", logout); // Logout

// POST
router.post("/login", loginValidator, login); // Login
router.post("/register", avatarUploads.single("avatar"), parsePostReq, userValidator, register); // Register

export default router;
