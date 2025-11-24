import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./Config/ConnectDb.js";
import sheetRouter from "./routes/sheetRoutes.js";
import authRouter from "./routes/authRoutes.js";
import reportRouter from "./routes/reportRoutes.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import docxRouter from "./routes/docxRoutes.js";
import pdfRouter from "./routes/pdfRoutes.js";
dotenv.config();
const { MONGO_URI, PORT, FRONTEND_URL } = process.env;
const app = express();

app.use(cors(FRONTEND_URL ? { origin: FRONTEND_URL } : {}));
app.use(express.json());
app.get("/", (req, res) => { res.send("API is running..."); });


app.use("/api/sheets", sheetRouter);
app.use("/api/auth", authRouter);
app.use("/api/report", reportRouter);
app.use('/api/docx', docxRouter);
app.use('/api/pdf', pdfRouter);


// Error Handler
app.use(errorHandler); // Start server
connectDB(MONGO_URI).then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => { console.error("Database connection error:", err); process.exit(1); });