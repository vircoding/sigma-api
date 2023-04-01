import { body, validationResult } from "express-validator";

const valResuls = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  next();
};

export const registerValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 12 }),
  body("password").custom((value, { req }) => {
    if (value !== req.body.repassword) {
      throw new Error("No Matched Passwords");
    }
    return value;
  }),
  valResuls,
];

export const loginValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 12 }),
  valResuls,
];
