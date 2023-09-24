import { checkSchema } from "express-validator";
import parsePhoneNumber from "libphonenumber-js";
import { provinceList, municipalityDict } from "./utils/provinceList.js";

const codeRegex = /^\+\d{1,3}$/;

// Custom Validators
const validatePhoneNumber = (value, { req }) => {
  const parsedNumber = parsePhoneNumber(req.body.contact_details.contact.code + value);
  if (!parsedNumber.isValid()) throw new Error("Invalid Phone Number");

  return value;
};

const validateMunicipality = (value, { req, path }) => {
  const index = parseInt(path.match(/\d+/)[0]);
  if (!municipalityDict[req.body.property_details[index].address.province].includes(value))
    throw new Error("Invalid Municipality");

  return value;
};

const validateOffersCount = (value, { req }) => {
  if (req.body.property_details.length !== value) throw new Error("Invalid Offers from Custom");

  return value;
};

const validateNeedsCount = (value, { req }) => {
  if (req.body.offer_details.needs.enable && ![1, 2, 3].includes(value))
    throw new Error("Invalid Value");

  if (!req.body.offer_details.needs.enable && value !== 0) throw new Error("Invalid value");

  return true;
};

const postSchema = checkSchema(
  {
    description: {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      default: { options: "Sin descripción." },
      isLength: { options: { max: 1200 }, errorMessage: "Max Length" },
    },
    contact_details: {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "contact_details.contact_types": {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "contact_details.contact_types.phone": {
      exists: { bail: true, errorMessage: "Must exists" },
      isBoolean: { options: { strict: true }, errorMessage: "Must be Boolean" },
    },
    "contact_details.contact_types.whatsapp": {
      exists: { bail: true, errorMessage: "Must exists" },
      isBoolean: { options: { strict: true }, errorMessage: "Must be Boolean" },
    },
    "contact_details.contact": {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "contact_details.contact.code": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      matches: { options: codeRegex, errorMessage: "Invalid Code" },
    },
    "contact_details.contact.phone": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      custom: { options: validatePhoneNumber, errorMessage: "Error in custom" },
    },
    "property_details.*": {
      isObject: { errorMessage: "Must be an object" },
    },
    "property_details.*.address": {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "property_details.*.address.province": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      isIn: { options: [provinceList], errorMessage: "Invalid value" },
    },
    "property_details.*.address.municipality": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      custom: { options: validateMunicipality, errorMessage: "Invalid value from custom" },
    },
    "property_details.*.features": {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "property_details.*.features.bed_room": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { negated: true, bail: true, errorMessage: "Cannot be an String" },
      isNumeric: { bail: true, errorMessage: "Must be a number" },
      isInt: {
        options: { min: 0, max: 9 },
        errorMessage: "Must be between 0 and 9",
      },
    },
    "property_details.*.features.bath_room": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { negated: true, bail: true, errorMessage: "Cannot be an String" },
      isNumeric: { bail: true, errorMessage: "Must be a number" },
      isInt: {
        options: { min: 0, max: 9 },
        errorMessage: "Must be between 0 and 9",
      },
    },
    "property_details.*.features.garage": {
      exists: { bail: true, errorMessage: "Must exists" },
      isBoolean: { options: { strict: true }, errorMessage: "Must be Boolean" },
    },
    "property_details.*.features.garden": {
      exists: { bail: true, errorMessage: "Must exists" },
      isBoolean: { options: { strict: true }, errorMessage: "Must be Boolean" },
    },
    "property_details.*.features.pool": {
      exists: { bail: true, errorMessage: "Must exists" },
      isBoolean: { options: { strict: true }, errorMessage: "Must be Boolean" },
    },
    "property_details.*.features.furnished": {
      exists: { bail: true, errorMessage: "Must exists" },
      isBoolean: { options: { strict: true }, errorMessage: "Must be Boolean" },
    },
  },
  ["body"]
);

const saleSchema = checkSchema(
  {
    property_details: {
      exists: { bail: true, errorMessage: "Must exists" },
      isArray: {
        options: { min: 1, max: 1 },
        errorMessage: "A sale must be an array of 1 element",
      },
    },
    amount_details: {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "amount_details.amount": {
      exists: { errorMessage: "Must exists" },
      isString: { negated: true, bail: true, errorMessage: "Cannot be an String" },
      isNumeric: { bail: true, errorMessage: "Must be a number" },
      isInt: {
        options: { min: 1, max: 999999999 },
        errorMessage: "Must be between 1 and 999 999 999",
      },
    },
    "amount_details.currency": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      isIn: { options: [["usd", "cup"]], errorMessage: "Invalid value" },
    },
  },
  ["body"]
);

const rentSchema = checkSchema(
  {
    property_details: {
      exists: { bail: true, errorMessage: "Must exists" },
      isArray: {
        options: { min: 1, max: 1 },
        errorMessage: "A sale must be an array of 1 element",
      },
    },
    amount_details: {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "amount_details.amount": {
      exists: { errorMessage: "Must exists" },
      isString: { negated: true, bail: true, errorMessage: "Cannot be an String" },
      isNumeric: { bail: true, errorMessage: "Must be a number" },
      isInt: {
        options: { min: 1, max: 999999999 },
        errorMessage: "Must be between 1 and 999 999 999",
      },
    },
    "amount_details.currency": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      isIn: { options: [["usd", "cup"]], errorMessage: "Invalid value" },
    },
    "amount_details.frequency": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { bail: true, errorMessage: "Must be an string" },
      trim: true,
      isIn: { options: [["daily", "monthly"]], errorMessage: "Invalid value" },
    },
  },
  ["body"]
);

const exchangeSchema = checkSchema(
  {
    property_details: {
      exists: { bail: true, errorMessage: "Must exists" },
      isArray: {
        options: { min: 1, max: 3 },
        errorMessage: "A sale must be an array of 1 element",
      },
    },
    offer_details: {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "offer_details.offers": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { negated: true, bail: true, errorMessage: "Cannot be an String" },
      isNumeric: { bail: true, errorMessage: "Must be a number" },
      isInt: {
        options: { min: 1, max: 3 },
        bail: true,
        errorMessage: "Must be between 1 and 3",
      },
      custom: { options: validateOffersCount, errorMessage: "Invalid value from custom" },
    },
    "offer_details.needs": {
      exists: { bail: true, errorMessage: "Must exists" },
      isObject: { errorMessage: "Must be an object" },
    },
    "offer_details.needs.enable": {
      exists: { bail: true, errorMessage: "Must exists" },
      isBoolean: { options: { strict: true }, errorMessage: "Must be Boolean" },
    },
    "offer_details.needs.count": {
      exists: { bail: true, errorMessage: "Must exists" },
      isString: { negated: true, bail: true, errorMessage: "Cannot be an String" },
      isNumeric: { bail: true, errorMessage: "Must be a number" },
      isInt: {
        options: { min: 0, max: 3 },
        bail: true,
        errorMessage: "Must be between 1 and 3",
      },
      custom: { options: validateNeedsCount, errorMessage: "Invalid value" },
    },
  },
  ["body"]
);
