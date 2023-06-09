import { Router } from "express";
import {
  getPosts,
  getPost,
  setPost,
  removePost,
  updatePost,
  visitPost,
  getPopularSales,
  getPopularRents,
} from "../controllers/postsController.js";
import { requireToken } from "../middlewares/requireToken.js";
import { paramValidator, postValidator } from "../middlewares/requestValidator.js";

const router = Router();

router.get("/sales", getPopularSales);
router.get("/rents", getPopularRents);
router.get("/user", requireToken, getPosts);
router.get("/:id", paramValidator, getPost);
router.post("/", requireToken, postValidator, setPost);
router.delete("/:id", requireToken, paramValidator, removePost);
router.patch("/:id", requireToken, paramValidator, postValidator, updatePost);
router.put("/:id", paramValidator, visitPost);

export default router;
