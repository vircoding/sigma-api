import { Router } from "express";
import { register, login, user, refresh, logout } from "../controllers/authController.js";
import { loginValidator, registerValidator } from "../middlewares/requestValidator.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/refresh", requireRefreshToken, refresh);
router.get("/logout", logout);
router.get("/user", requireToken, user);

export default router;
