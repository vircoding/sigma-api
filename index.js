import "dotenv/config";
import "./database/connectdb.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import postsRouter from "./routes/postsRoute.js";
import countriesRouter from "./routes/countriesRoute.js";

const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (whiteList.includes(origin)) {
        return callback(null, origin);
      }
      return callback("CORS Error: " + origin);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/countries", countriesRouter);

// Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server http://localhost:${PORT};`));
