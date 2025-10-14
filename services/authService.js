
import User from "../model/user.js"

// Service for login
export const serviceLogin = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    return { user };


  } catch (err) {
    return { error: err };
  }
};
// Service for register
export const serviceRegister = async (userName, email, password) => {
  try {

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const newUser = new User({ userName, email, password });
    await newUser.save();
    return { user: newUser };

  } catch (err) {
    return { error: err };
  }
}
