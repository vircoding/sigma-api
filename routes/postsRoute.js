import { Router } from "express";

const router = Router();

// GET
router.get("/"); // Get All Posts
router.get("/sales"); // Get All Sales
router.get("/rents"); // Get All Rents
router.get("/exchanges"); // Get All Exchanges
router.get("/:id"); // Get Post
router.get("/popular"); // Get All Popular
router.get("/popular/sales"); // Get Popular Sales
router.get("/popular/rents"); // Get Popular Rents
router.get("/popular/exchanges"); // Get Popular Exchanges

// PUT
router.put("/:id"); // Visit Post

export default router;
