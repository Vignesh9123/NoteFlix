import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/dbConfig/connectDB";
connectDB();
export const GET = async (req: NextRequest, res: NextResponse) => {
    return NextResponse.json({
        message: "Hello World"
    }, { status: 200 });
}
export const POST = async (req: NextRequest, res: NextResponse) => {
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if(!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if(user.loginType === "google") {
        return NextResponse.json({
            message: "Login with Google",
        }, { status: 400 });
    }
    const isMatch = await user.matchPassword(password);
    if(!isMatch) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const token = user.generateToken();
    (await cookies()).set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 });
    user.password = undefined;

    return NextResponse
    .json({
        message: "User logged in successfully",
        user
    }, { status: 200 });
}
