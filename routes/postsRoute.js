import { Router } from "express";
import { getPosts, setPost } from "../controllers/postsController.js";
import { requireToken } from "../middlewares/requireToken.js";
import { postValidator } from "../middlewares/requestValidator.js";

const router = Router();

router.get("/", requireToken, getPosts);
router.post("/", requireToken, postValidator, setPost);

export default router;
