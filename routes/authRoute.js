import { Router } from "express";
import {
  registerClient,
  registerAgent,
  login,
  user,
  refresh,
  logout,
} from "../controllers/authController.js";
import {
  loginValidator,
  clientValidator,
  agentValidator,
} from "../middlewares/requestValidator.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";

const router = Router();

router.post("/register/client", clientValidator, registerClient);
router.post("/register/agent", agentValidator, registerAgent);
router.post("/login", loginValidator, login);
router.get("/refresh", requireRefreshToken, refresh);
router.get("/logout", logout);
router.get("/user", requireToken, user);

export default router;
