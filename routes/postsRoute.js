import { Router } from "express";
import { getPosts, setPost } from "../controllers/postsController.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = Router();

router.get("/", requireToken, getPosts);
router.post("/", requireToken, setPost);

export default router;
