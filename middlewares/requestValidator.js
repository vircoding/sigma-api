import { body, validationResult, param } from "express-validator";

const valResuls = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  next();
};

export const registerValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  body("password").custom((value, { req }) => {
    if (value !== req.body.repassword) {
      throw new Error("No Matched Passwords");
    }
    return value;
  }),
  body("username", "Invalid Username").trim().isLength({ min: 3, max: 20 }),
  valResuls,
];

export const loginValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  valResuls,
];

export const paramValidator = [
  param("id", "Invalid ID Format").trim().notEmpty().escape(),
  valResuls,
];

// Just for testing purposes
// TODO: Replace;
export const postValidator = [
  body("buy", "Invalid Buy/Rent Spec").trim().isBoolean(),
  body("price", "Invalid Price").trim().notEmpty().isNumeric(),
  valResuls,
];
