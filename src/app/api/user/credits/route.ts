import User from "@/models/user.model";
import connectDB from "@/dbConfig/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { IUser } from "@/types";
connectDB();

const shouldResetCredits = (createdAt: string) => {
    const now = new Date();
    const joinDate = new Date(createdAt);
    const yearsDiff = now.getFullYear() - joinDate.getFullYear();
    const monthsDiff = now.getMonth() - joinDate.getMonth();
    const totalMonths = yearsDiff * 12 + monthsDiff;
    return totalMonths > 0 && joinDate.getDate() === now.getDate() && now.getHours() === 0 && now.getMinutes() >= 0  && now.getMinutes() <= 5;
}

export async function POST(req: NextRequest) {
    try {
        if(req.headers.get("authorization") != `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const users = await User.find({}).sort({ createdAt: -1 });
        const updatedUsers = users.filter((user) => shouldResetCredits(user.createdAt as string))
        .map(async(user:IUser) => {
            await User.updateOne({ _id: user._id }, { $set: { creditsUsed: 0 } });
        })
        await Promise.all(updatedUsers);
        return NextResponse.json({ message: `Credits reset successfully for ${updatedUsers.length} users` }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}