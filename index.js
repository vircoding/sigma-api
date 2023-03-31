import express from "express";
import "dotenv/config";
import "./database/connectdb.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/authRoute.js";

const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

// Middlewares
app.use(express.json());
app.use(cookieParser());
// app.use(cors());

app.use("/api/v1/auth", authRouter);

// Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}; press Ctrl-C to terminate.`)
);
