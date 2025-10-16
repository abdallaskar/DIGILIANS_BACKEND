// services/authService.js
import User from "../model/user.js";

// LOGIN SERVICE
export const serviceLogin = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");

    // ✅ Generate token from user model method
    const token = user.generateAuthToken();

    return { user, token };
  } catch (err) {
    return { error: err };
  }
};

// REGISTER SERVICE
export const serviceRegister = async (userName, email, password) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already in use");

    const newUser = new User({ userName, email, password });
    await newUser.save();

    // ✅ Generate token for new user
    const token = newUser.generateAuthToken();

    return { user: newUser, token };
  } catch (err) {
    return { error: err };
  }
};
