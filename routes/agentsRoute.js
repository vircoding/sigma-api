import { Router } from "express";

const router = Router();

// GET
router.get("/"); // Get All Agents
router.get("/:id"); // Get Agent
router.get("/:id/posts"); // Get Agent Posts

export default router;
