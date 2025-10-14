
import { serviceLogin, serviceRegister } from "../services/authService.js";

// Login controller
export const login = async (req, res, next) => {
    // Login logic here
    const { email, password } = req.body;
    // You can add your authentication logic here
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const result = await serviceLogin(email, password);
    if (result.error) {
        return next(result.error);
    } else {
        return res.status(200).json({ message: "Login successful" });
    }
}


// Register controller
export const register = async (req, res) => {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const result = await serviceRegister(userName, email, password);
    if (result.error) {
        return res.status(400).json({ message: result.error.message });
    }
    return res.status(201).json({ message: "User registered successfully" });
}