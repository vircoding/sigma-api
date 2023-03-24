import express from "express";
import "dotenv/config";
import "./database/connectdb.js";

const app = express();

// Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}; press Ctrl-C to terminate.`)
);
