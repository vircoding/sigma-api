import { Router } from "express";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";
import {
  loginValidator,
  clientValidator,
  agentValidator,
} from "../middlewares/requestValidator.js";
import { refresh, login, registerClient, registerAgent } from "../controllers/authController.js";

const router = Router();

// GET
router.get("/", requireRefreshToken, refresh); // Refresh

// POST
router.post("/login", loginValidator, login); // Login
router.post("/register/client", clientValidator, registerClient); // Register Client
router.post("/register/agent", agentValidator, registerAgent); // Register Agent

export default router;
