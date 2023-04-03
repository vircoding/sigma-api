import { Router } from "express";
import { getPosts, getPost, setPost, removePost } from "../controllers/postsController.js";
import { requireToken } from "../middlewares/requireToken.js";
import { postValidator } from "../middlewares/requestValidator.js";

const router = Router();

router.get("/", requireToken, getPosts);
router.get("/:id", requireToken, getPost);
router.post("/", requireToken, postValidator, setPost);
router.delete("/:id", requireToken, removePost);

export default router;
