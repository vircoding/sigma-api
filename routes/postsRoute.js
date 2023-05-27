import { Router } from "express";
import {
  getPosts,
  getPost,
  setPost,
  removePost,
  updatePost,
} from "../controllers/postsController.js";
import { requireToken } from "../middlewares/requireToken.js";
import { paramValidator, postValidator } from "../middlewares/requestValidator.js";

const router = Router();

router.get("/user/", requireToken, getPosts);
router.get("/:id", paramValidator, getPost);
router.post("/", requireToken, postValidator, setPost);
router.delete("/:id", requireToken, paramValidator, removePost);
// router.patch("/:id", requireToken, paramValidator, postValidator, updatePost);

export default router;
