import jwt from "jsonwebtoken";

// Note: JWT_SECRET and EXPIRATION should be set in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_for_development';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';

/**
 * Generates an authentication token for a user.
 * @param {object} payload - The data to include in the token (e.g., { id, role }).
 * @returns {string} The signed JWT token.
 */
export const generateToken = (payload) => {
    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );
};

// You can add a verification function here later if needed:
/*
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
*/
