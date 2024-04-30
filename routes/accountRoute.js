import { Router } from "express";
import multer from "multer";
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
  removedImagesValidator,
  paramValidator,
} from "../middlewares/requestValidator.js";
import { parsePostReq } from "../middlewares/parseReq.js";

const router = Router();
const imagesUploads = multer({ dest: "dist/uploads/images/" });
const avatarUploads = multer({ dest: "dist/uploads/avatars/" });

// GET
router.get("/", requireToken, getUser); // Get User
router.get("/info", requireToken, getInfo); // Get Info
router.get("/role", requireToken, getRole); // Get Role
router.get("/posts", requireToken, getPosts); // Get Posts
router.get("/favorites", requireToken, getFavorites); // Get Favorites

// POST
router.post(
  "/posts",
  imagesUploads.array("images", 10),
  parsePostReq,
  requireToken,
  postValidator,
  insertPost
); // Insert Post

// PATCH
router.patch(
  "/",
  avatarUploads.single("avatar"),
  parsePostReq,
  requireToken,
  updateUserValidator,
  updateUser
); // Update User

router.patch(
  "/posts/:id",
  imagesUploads.array("images", 10),
  parsePostReq,
  requireToken,
  paramValidator,
  postValidator,
  removedImagesValidator,
  updatePost
); // Update Post

// PUT
router.put("/favorites/:id", requireToken, paramValidator, addFavorite); // Add To Favorites

// DELETE
router.delete("/posts/:id", requireToken, paramValidator, deletePost); // Delete Post

export default router;
