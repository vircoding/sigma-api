import "dotenv/config";
import "./database/connectdb.js";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import postsRouter from "./routes/postsRoute.js";
import agentsRouter from "./routes/agentsRoute.js";
import accountRouter from "./routes/accountRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, false);
      }

      if (origin === process.env.ORIGIN) {
        return callback(null, true);
      } else {
        console.log(origin);
        return callback("CORS Error: Origin Not Allowed");
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.static(join(__dirname, "dist")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/account", accountRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/agents", agentsRouter);
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

// Starting Server
const PORT = process.env.PORT || 5000;
if (process.env.MODE === "production") {
  app.listen(PORT, () => console.log(`Sigma Beta (Production) started at Port: ${PORT}`));
} else if (process.env.MODE === "development") {
  app.listen(PORT, () => console.log(`Sigma Beta (Development) started at Port: ${PORT}`));
}
