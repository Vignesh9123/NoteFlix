import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/dbConfig/connectDB";
import { authMiddleware } from "@/middleware/auth.middleware";
import User from "@/models/user.model";
connectDB()

export async function POST(req: NextRequest) {
    try {
        const auth = await authMiddleware(req);
        if(auth.status === 401) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const { oldPassword, newPassword } = await req.json();
        if(!oldPassword || !newPassword) {
            return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
        }
        const user = await User.findById(req.user?._id);
        if(!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isMatched = await user.matchPassword(oldPassword);
        if(!isMatched) {
            return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
        }
        user.password = newPassword;
        await user.save();
        user.password = undefined;
        return NextResponse.json({ data: user, message: "Password updated successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}