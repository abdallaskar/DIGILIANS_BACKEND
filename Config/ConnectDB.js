
import mongoose from "mongoose";

let isConnected = false; // track the connection

export const connectDB = async (MONGO_URI) => {
    if (isConnected) {
        return;
    }

    try {
        const conn = await mongoose.connect(MONGO_URI, {
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
