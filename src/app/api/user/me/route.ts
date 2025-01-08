import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
import User from "@/models/user.model";
connectDB();

export const GET = async (req: NextRequest, res: NextResponse) => {
   try {
    const response = await authMiddleware(req);
    if(response.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ user: req.user }, { status: 200 });
   } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }
}

export const PATCH = async (req: NextRequest, res: NextResponse) => {
    try {
        const response = await authMiddleware(req);
        if(response.status === 401) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { name } = await req.json();
        const user = await User.findByIdAndUpdate(req.user?._id, { name}, { new: true });
        return NextResponse.json({ data:user,  message: "User updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

