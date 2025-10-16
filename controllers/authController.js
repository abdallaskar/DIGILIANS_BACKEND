// controllers/authController.js
import { serviceLogin, serviceRegister } from "../services/authService.js";

// LOGIN CONTROLLER
export const login = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required" });

        const result = await serviceLogin(email, password);
        if (result.error) return res.status(401).json({ message: result.error.message });

        const { user, token } = result;

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

// REGISTER CONTROLLER
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required" });

        const result = await serviceRegister(name, email, password);
        if (result.error)
            return res.status(400).json({ message: result.error.message });

        const { user, token } = result;

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.userName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
