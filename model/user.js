import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { generateToken } from "../Config/JwtConfig.js";


const userSchema = new mongoose.Schema({

    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" }
});


// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
// Compare password method using in login service
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const payload = { id: this._id, role: this.role };
    return generateToken(payload);
};


const User = mongoose.model("User", userSchema);


export default User;

