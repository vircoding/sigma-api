import { Router } from "express";
import { getAgents, getAgent } from "../controllers/agentsController.js";
import { paramValidator } from "../middlewares/requestValidator.js";

const router = Router();

GET;
router.get("/", getAgents); // Get All Agents
router.get("/:id", paramValidator, getAgent); // Get Agent
// router.get("/:id/posts", paramValidator, getAgentPosts); // Get Agent Posts

export default router;
