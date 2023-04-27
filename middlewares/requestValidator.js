import { body, validationResult, param } from "express-validator";
import { provinceList } from "../utils/provinceList.js";

const valResuls = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
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
  body("username", "Invalid Username").trim().isLength({ min: 3, max: 20 }),
  valResuls,
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
  body("firstname", "Invalid First Name").trim().isAlpha().isLength({ min: 1, max: 20 }),
  body("lastname", "Invalid First Name").trim().isAlpha().isLength({ min: 1, max: 20 }),
  body("phone", "Invalid Phone Number").trim().isMobilePhone().isLength({ min: 10, max: 15 }),
  body("bio", "Invalid Bio").trim().isLength({ max: 160 }),
  body("public_email", "Invalid Public Email").trim().isEmail().normalizeEmail(),
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

export const postValidator = [
  body("type").custom((value) => {
    if (value !== "sale" && value !== "rent") {
      throw new Error("Invalid Type");
    }
    return value;
  }),
  body("province").custom((value) => {
    if (!provinceList.hasOwnProperty(value)) {
      throw new Error("Invalid Province");
    }
    return value;
  }),
  body("municipality").custom((value, { req }) => {
    if (!provinceList[req.body.province].includes(value)) {
      throw new Error("Invalid Municipality");
    }
    return value;
  }),
  body("living_room", "Invalid Living_Room").isNumeric(),
  body("bed_room", "Invalid Bed_Room").isNumeric(),
  body("bath_room", "Invalid Bath_Room").isNumeric(),
  body("dinning_room", "Invalid Dinning_Room").isNumeric(),
  body("kitchen", "Invalid Kitchen").isNumeric(),
  body("garage", "Invalid Garage").isNumeric(),
  body("garden", "Invalid Garden").isNumeric(),
  body("pool", "Invalid Pool").isNumeric(),
  body("contact", "Invalid Contact").trim().isMobilePhone().isLength({ min: 10, max: 15 }),
  body("contact", "Invalid Contact").trim().isMobilePhone().isLength({ min: 10, max: 15 }),
  body("description", "Invalid Description").trim().isLength({ max: 160 }),
  body("price", "Invalid Price").isNumeric(),
  valResuls,
];
