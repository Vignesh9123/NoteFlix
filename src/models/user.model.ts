import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "@/types";
import jwt from "jsonwebtoken";
import config from "@/config/config";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    loginType: {
        type: String,
        required: true,
        default: "email"
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id, email: this.email }, config.jwtSecret, { expiresIn: "1d" });
}

const User = mongoose.models.Users as mongoose.Model<IUser> || mongoose.model<IUser>("Users", userSchema);

export default User;

