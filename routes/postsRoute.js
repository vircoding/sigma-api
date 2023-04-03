import { Router } from "express";
import { getPosts } from "../controllers/postsController.js";
import { requireToken } from "../middlewares/requireToken.js";

const router = Router();

router.get("/", requireToken, getPosts);

export default router;
