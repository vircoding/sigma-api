import { Router } from "express";
import { requireToken } from "../middlewares/requireToken.js";
import {
  getPosts,
  getSales,
  getRents,
  getExchanges,
  getPost,
  getUserPosts,
  getUserFavorites,
  getPopularPosts,
  visitPost,
} from "../controllers/postsController.js";
import { paramValidator } from "../middlewares/requestValidator.js";

const router = Router();

// GET
router.get("/", getPosts); // Get All Posts
router.get("/sales", getSales); // Get All Sales
router.get("/rents", getRents); // Get All Rents
router.get("/exchanges", getExchanges); // Get All Exchanges
router.get("/:id", paramValidator, getPost); // Get Post
router.get("/user", requireToken, getUserPosts); // Get User Posts
router.get("/user/favorites", requireToken, getUserFavorites); // Get User Favorites
router.get("/popular", getPopularPosts); // Get All Popular
router.get("/popular/sales", getPopularSales); // Get Popular Sales
router.get("/popular/rents", getPopularRents); // Get Popular Rents
router.get("/popular/exchanges", getPopularExchanges); // Get Popular Exchanges

// PUT
router.put("/:id", paramValidator, visitPost); // Visit Post

export default router;
