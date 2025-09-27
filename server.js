import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Config/ConnectDb.js";
import sheetRouter from "./routes/sheetRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
dotenv.config();
const { MONGO_URI, PORT, FRONTEND_URL } = process.env;
const app = express();

app.use(cors(FRONTEND_URL ? { origin: FRONTEND_URL } : {}));
app.use(express.json());
app.use("/api/sheets", sheetRouter);
app.get("/", (req, res) => { res.send("API is running..."); });
// Error Handler
app.use(errorHandler); // Start server
connectDB(MONGO_URI).then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => { console.error("Database connection error:", err); process.exit(1); });