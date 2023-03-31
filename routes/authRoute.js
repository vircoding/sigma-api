import { Router } from "express";
import { register, login, infoUser, refresh } from "../controllers/authController.js";
import { body } from "express-validator";
import { valResults } from "../middlewares/valResults.js";
import { requireToken } from "../middlewares/requireToken.js";

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

router.post(
  "/login",
  [
    body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
    body("password", "Invalid Password").trim().isLength({ min: 6, max: 12 }),
  ],
  valResults,
  login
);

// Just for testing purposes
router.get("/protected", requireToken, infoUser);

router.get("/refresh", refresh);

export default router;
