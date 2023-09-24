import { Router } from "express";
import { requireToken } from "../middlewares/requireToken.js";
import {
  getUser,
  getInfo,
  getPosts,
  getFavorites,
  insertPost,
  updateClient,
  updateAgent,
  updatePost,
  addFavorite,
} from "../controllers/accountController.js";
import {
  updateClientValidator,
  updateAgentValidator,
  paramValidator,
} from "../middlewares/requestValidator.js";

const router = Router();

// GET
router.get("/", requireToken, getUser); // Get User
router.get("/info", requireToken, getInfo); // Get Info
router.get("/role", requireToken, getRole); // Get Info
router.get("/posts", requireToken, getPosts); // Get Posts
router.get("/favorites", requireToken, getFavorites); // Get Favorites

// POST
router.post("/", requireToken, postValidator, insertPost); // Insert Post

// PATCH
router.patch("/client", requireToken, updateClientValidator, updateClient); // Update Client
router.patch("/agent", requireToken, updateAgentValidator, updateAgent); // Update Agent
router.patch("/post/:id", requireToken, paramValidator, postValidator, updatePost); // Update Post

// PUT
router.put("/favorites/:id", requireToken, paramValidator, addFavorite); // Add To Favorites

export default router;
