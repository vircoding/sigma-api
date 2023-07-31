import { Router } from "express";
import { paramValidator } from "../middlewares/requestValidator.js";
import { getAgentInfo } from "../controllers/agentsController.js";

const router = Router();

router.get("/:id", paramValidator, getAgentInfo);

export default router;
