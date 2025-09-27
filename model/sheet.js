import mongoose from "mongoose";

const sheetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        link: { type: String, required: true },
        type: { type: String, enum: ["GENERAL", "SOFTWARE", "DIGITAL", "AI", "DATA", "SECURITY", "TECH"], required: true }
    },
    { timestamps: true }
);


const Sheet = mongoose.model("Sheet", sheetSchema);

export default Sheet;
