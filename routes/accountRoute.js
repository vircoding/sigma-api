import { Router } from "express";

const router = Router();

// GET
router.get("/"); // Get Account Info
router.get("/posts"); // Get Account Posts
router.get("/favorites"); // Get Account Favorites

// POST
router.post("/"); // Insert Post

// PATCH
router.patch("/client"); // Update Client
router.patch("/agent"); // Update Agent
router.patch("/post/:id"); // Update Post

// PUT
router.put("/favorites/:id"); // Add To Favorites

export default router;
