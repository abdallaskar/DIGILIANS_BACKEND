// api/index.js
import app from "../app.js";
import { connectDB } from "../Config/ConnectDB.js";

const { MONGO_URI } = process.env;


export default async function handler(req, res) {
    await connectDB(MONGO_URI);
    app(req, res); // let express handle it
}
