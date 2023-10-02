import { validationResult } from "express-validator";

const valResults = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }

  next();
};

export default valResults;
