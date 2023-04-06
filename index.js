import express from "express";
import "dotenv/config";
import "./database/connectdb.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import postsRouter from "./routes/postsRoute.js";
import cors from "cors";

const app = express();

const whiteList = [process.env.ORIGIN];

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (whiteList.includes(origin)) {
        return callback(null, origin);
      }
      return callback("CORS Origin Error: " + origin);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postsRouter);

// Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}; press Ctrl-C to terminate.`)
);
