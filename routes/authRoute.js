import { Router } from "express";
import {
  registerClient,
  registerAgent,
  login,
  refresh,
  logout,
  user,
  updateClient,
  updateAgent,
  favorite,
} from "../controllers/authController.js";
import {
  loginValidator,
  clientValidator,
  agentValidator,
  updateClientValidator,
  updateAgentValidator,
  paramValidator,
} from "../middlewares/requestValidator.js";
import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";

const router = Router();

router.post("/register/client", clientValidator, registerClient);
router.post("/register/agent", agentValidator, registerAgent);
router.post("/login", loginValidator, login);
router.get("/refresh", requireRefreshToken, refresh);
router.get("/logout", logout);
router.get("/", requireToken, user);
router.patch("/update/client", requireToken, updateClientValidator, updateClient);
router.patch("/update/agent", requireToken, updateAgentValidator, updateAgent);
router.put("/favorite", requireToken, paramValidator, favorite);

export default router;
