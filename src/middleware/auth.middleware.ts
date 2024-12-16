import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import config from "@/config/config";
import User from "@/models/user.model";
import { userJwtPayload } from "@/types";
import connectDB from "@/dbConfig/connectDB";
connectDB();


export const authMiddleware = async (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    if(!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded = jwt.verify(token, config.jwtSecret) as userJwtPayload;
    const user = await User.findById(decoded._id);
    if(!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    user.password = undefined;
    req.user = user;
    return NextResponse.next();

}

