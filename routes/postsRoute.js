import { Router } from "express";
import {
  getPosts,
  getSales,
  getRents,
  getExchanges,
  getPost,
  getPopularPosts,
  getPopularSales,
  getPopularRents,
  getPopularExchanges,
  visitPost,
} from "../controllers/postsController.js";
import { paramValidator } from "../middlewares/requestValidator.js";

const router = Router();

GET;
router.get("/", getPosts); // Get All Posts
router.get("/sales", getSales); // Get All Sales
router.get("/rents", getRents); // Get All Rents
router.get("/exchanges", getExchanges); // Get All Exchanges
router.get("/:id", paramValidator, getPost); // Get Post
router.get("/popular", getPopularPosts); // Get All Popular
router.get("/popular/sales", getPopularSales); // Get Popular Sales
router.get("/popular/rents", getPopularRents); // Get Popular Rents
router.get("/popular/exchanges", getPopularExchanges); // Get Popular Exchanges

PUT;
router.put("/:id", paramValidator, visitPost); // Visit Post

export default router;
