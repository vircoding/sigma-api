import { Router } from "express";
import { requireToken } from "../middlewares/requireToken.js";
import {
  getUser,
  getInfo,
  getRole,
  getPosts,
  getFavorites,
  insertPost,
  updateUser,
  updatePost,
  addFavorite,
  deletePost,
} from "../controllers/accountController.js";
import {
  updateUserValidator,
  postValidator,
  paramValidator,
} from "../middlewares/requestValidator.js";

const router = Router();

// GET
router.get("/", requireToken, getUser); // Get User
router.get("/info", requireToken, getInfo); // Get Info
router.get("/role", requireToken, getRole); // Get Role
router.get("/posts", requireToken, getPosts); // Get Posts
router.get("/favorites", requireToken, getFavorites); // Get Favorites

// POST
router.post("/posts", requireToken, postValidator, insertPost); // Insert Post

// PATCH
router.patch("/", requireToken, updateUserValidator, updateUser); // Update User
router.patch("/posts/:id", requireToken, paramValidator, postValidator, updatePost); // Update Post

// PUT
router.put("/favorites/:id", requireToken, paramValidator, addFavorite); // Add To Favorites

// DELETE
router.delete("/posts/:id", requireToken, paramValidator, deletePost); // Delete Post

export default router;
