import { Router } from "express";
import { paramsValidator } from "../middlewares/requestValidator.js";
import { getAgentInfo } from "../controllers/agentsController.js";

const router = Router();

router.get("/:id", paramsValidator, getAgentInfo);

export default router;
