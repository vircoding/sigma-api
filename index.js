import express from "express";
import "dotenv/config";
import "./database/connectdb.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";

const app = express();

// Middlewares
app.use("/api/v1/auth", authRouter);
app.use(express.json());
app.use(cookieParser());

// Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}; press Ctrl-C to terminate.`)
);
