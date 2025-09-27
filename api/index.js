// api/index.js
import app from "../app.js";
import { connectDB } from "../Config/db.js";

export default async function handler(req, res) {
    await connectDB();
    app(req, res); // let express handle it
}
