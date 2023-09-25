import { body, param } from "express-validator";
import valResult from "./valResult.js";
import {
  loginSchema,
  userSchema,
  clientSchema,
  agentSchema,
  postSchema,
  saleSchema,
  rentSchema,
  exchangeSchema,
} from "../utils/valSchemas.js";

export const paramValidator = [
  param("id", "Invalid ID Format").trim().notEmpty().escape(),
  valResult,
];

export const loginValidator = async (req, res, next) => {
  await loginSchema.run(req);
  await valResult(req, res, next);
};

export const userValidator = async (req, res, next) => {
  // Validating role
  const typeResult = await body("role")
    .exists()
    .bail()
    .withMessage("CHAIN - Must exists")
    .isString()
    .bail()
    .withMessage("CHAIN - Must be an string")
    .trim()
    .isIn(["client", "agent"])
    .withMessage("CHAIN - Invalid value")
    .run(req);

  if (typeResult.errors.length > 0) {
    return res.status(400).json({ error: typeResult.errors });
  } else {
    // General Post Validations
    await userSchema.run(req);

    // Validation Switch
    if (req.body.role === "client") await clientSchema.run(req);
    else if (req.body.role === "agent") await agentSchema.run(req);
  }

  // Validation Result
  await valResult(req, res, next);
};

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
