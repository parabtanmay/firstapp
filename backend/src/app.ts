import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import peopleRoutes from "./routes/peopleRoutes.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/media", mediaRoutes);
app.use("/api/people", peopleRoutes);

app.use(errorMiddleware);
