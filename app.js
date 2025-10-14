import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import sheetRouter from "./routes/sheetRoutes.js";
import authRouter from "./routes/authRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const { FRONTEND_URL } = process.env;

const app = express();

// Middleware
app.use(cors(FRONTEND_URL ? { origin: FRONTEND_URL } : {}));
app.use(express.json());

// Routes
app.use("/api/sheets", sheetRouter);
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Error handler
app.use(errorHandler);

export default app; // ⬅️ important for Vercel
import authRouter from './routes/authRoutes';
