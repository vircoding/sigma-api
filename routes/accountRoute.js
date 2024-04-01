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
);
// router.post("/posts", requireToken, postValidator, uploads.single("image"), insertPost); // Insert Post
// router.post("/posts/images", requireToken, uploads.array("images", 10), (req, res) => {
//   req.files.map(saveImage);
//   const urls = req.files.map((item) => {
//     return `https://sigma-api-ehki.onrender.com/uploads/${item.originalname}`;
//   });
//   res.json({ urls });
// });

// PATCH
router.patch(
  "/",
  avatarUploads.single("avatar"),
  parsePostReq,
  requireToken,
  updateUserValidator,
  updateUser
); // Update User
router.patch("/posts/:id", requireToken, paramValidator, postValidator, updatePost); // Update Post

// PUT
router.put("/favorites/:id", requireToken, paramValidator, addFavorite); // Add To Favorites

// DELETE
router.delete("/posts/:id", requireToken, paramValidator, deletePost); // Delete Post

export default router;
