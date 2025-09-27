// Config/db.js
import mongoose from "mongoose";

let isConnected = false; // track the connection

export const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = conn.connections[0].readyState;
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Error:", err.message);
        throw new Error("Database connection failed");
    }
};
