import { Router } from "express";

const router = Router();

// GET
router.get("/"); // Refresh

// POST
router.post("/login"); // Login
router.post("/register/client"); // Register Client
router.post("/register/agent"); // Register Agent

export default router;
