import parsePhoneNumber from "libphonenumber-js";
import { body, validationResult, param } from "express-validator";
import { postSchema, saleSchema, rentSchema, exchangeSchema } from "../utils/valSchemas.js";

// Validation Result
const valResult = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }

  next();
};

export const clientValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  body("password").custom((value, { req }) => {
    if (value !== req.body.repassword) {
      throw new Error("No Matched Passwords");
    }
    return value;
  }),
  body("username", "Invalid Username")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 3, max: 20 }),
  valResult,
];

export const agentValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  body("password").custom((value, { req }) => {
    if (value !== req.body.repassword) {
      throw new Error("No Matched Passwords");
    }
    return value;
  }),
  body("firstname", "Invalid First Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("lastname", "Invalid Last Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("code", "Invalid Code").trim().matches(codeRegex),
  body("phone").custom((value, { req }) => {
    const parsedNumber = parsePhoneNumber(req.body.code + value);
    if (!parsedNumber.isValid()) throw new Error("Invalid Phone Number");
    return value;
  }),
  body("bio", "Invalid Bio").optional().trim().isLength({ max: 160 }),
  body("public_email", "Invalid Public Email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .normalizeEmail(),
  valResult,
];

export const loginValidator = [
  body("email", "Invalid Email").trim().isEmail().normalizeEmail(),
  body("password", "Invalid Password").trim().isLength({ min: 6, max: 16 }),
  valResult,
];

export const updateClientValidator = [
  body("username", "Invalid Username")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 3, max: 20 }),
  valResult,
];

export const updateAgentValidator = [
  body("firstname", "Invalid First Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("lastname", "Invalid Last Name")
    .trim()
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 1, max: 30 }),
  body("code", "Invalid Code").trim().matches(codeRegex),
  body("phone").custom((value, { req }) => {
    const parsedNumber = parsePhoneNumber(req.body.code + value);
    console.log(parsedNumber.isValid());
    if (!parsedNumber.isValid()) throw new Error("Invalid Phone Number");
  }),
  body("bio", "Invalid Bio").optional().trim().isLength({ max: 160 }),
  body("public_email", "Invalid Public Email")
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .normalizeEmail(),
  valResult,
];

export const paramValidator = [
  param("id", "Invalid ID Format").trim().notEmpty().escape(),
  valResult,
];

export const postValidator = async (req, res, next) => {
  // Validating type
  const typeResult = await body("type")
    .exists()
    .bail()
    .withMessage("CHAIN - Must exists")
    .isString()
    .bail()
    .withMessage("CHAIN - Must be an string")
    .trim()
    .isIn(["sale", "rent", "exchange"])
    .withMessage("Invalid isIn")
    .run(req);

  if (typeResult.errors.length > 0) {
    return res.status(400).json({ error: typeResult.errors });
  } else {
    // General Post Validations
    await postSchema.run(req);

    // Validation Switch
    if (req.body.type === "sale") await saleSchema.run(req);
    else if (req.body.type === "rent") await rentSchema.run(req);
    else if (req.body.type === "exchange") await exchangeSchema.run(req);
  }

  // Validation Result
  await valResult(req, res, next);
};
