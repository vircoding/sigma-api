import { Router } from "express";
import {
  getPosts,
  getFavorites,
  getPost,
  setPost,
  removePost,
  updatePost,
  visitPost,
  getPopularSales,
  getPopularRents,
  favoritePost,
} from "../controllers/postsController.js";
import { requireToken } from "../middlewares/requireToken.js";
import { paramValidator, postValidator } from "../middlewares/requestValidator.js";

const router = Router();

router.get("/sales", getPopularSales);
router.get("/rents", getPopularRents);
router.get("/user", requireToken, getPosts);
router.get("/user/favorites", requireToken, getFavorites);
router.get("/:id", paramValidator, getPost);
router.post("/", requireToken, postValidator, setPost);
router.delete("/:id", requireToken, paramValidator, removePost);
router.patch("/:id", requireToken, paramValidator, postValidator, updatePost);
router.put("/visit/:id", paramValidator, visitPost);
router.put("/favorite/:id", requireToken, favoritePost);

export default router;
