import { Router } from "express";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import { loginValidator, userValidator } from "../middlewares/requestValidator.js";
import { refresh, login, register } from "../controllers/authController.js";

const router = Router();

// GET
router.get("/", requireRefreshToken, refresh); // Refresh

// POST
router.post("/login", loginValidator, login); // Login
router.post("/register", userValidator, register); // Register

export default router;
