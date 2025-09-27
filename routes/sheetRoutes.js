import express from "express";
import { getSheets, createSheet, updateSheet, deleteSheet } from "../controllers/sheetController.js";

const sheetRouter = express.Router();

sheetRouter.get("/", getSheets);
sheetRouter.post("/", createSheet);
sheetRouter.patch("/:id", updateSheet);
sheetRouter.delete("/:id", deleteSheet);

export default sheetRouter;
