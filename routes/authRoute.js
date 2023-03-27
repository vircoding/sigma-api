import { Router } from "express";
import { register } from "../controllers/authControllers.js";
import { body } from "express-validator";
import { valResults } from "../middlewares/valResults.js";

const router = Router();

router.post(
  "/register",
  [
    body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
    body("password", "Invalid Password").trim().isLength({ min: 6, max: 12 }),
    body("password").custom((value, { req }) => {
      if (value !== req.body.repassword) {
        throw new Error("No Matched Passwords");
      }
      return value;
    }),
  ],
  valResults,
  register
);

export default router;
