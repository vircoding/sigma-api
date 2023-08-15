import { Router } from "express";
import { paramValidator } from "../middlewares/requestValidator.js";
import { getAgentInfo, getAgentPosts } from "../controllers/agentsController.js";

const router = Router();

router.get("/:id", paramValidator, getAgentInfo);
router.get("/:id/posts", paramValidator, getAgentPosts);

export default router;
