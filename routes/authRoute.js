import { Router } from "express";
import { register, agent, login, user, refresh, logout } from "../controllers/authController.js";
import {
  loginValidator,
  registerValidator,
  agentValidator,
} from "../middlewares/requestValidator.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/agent", agentValidator, agent);
router.post("/login", loginValidator, login);
router.get("/refresh", requireRefreshToken, refresh);
router.get("/logout", logout);
router.get("/user", requireToken, user);

export default router;
