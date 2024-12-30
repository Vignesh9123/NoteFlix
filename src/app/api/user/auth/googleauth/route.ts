import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function POST(req: NextRequest){
    try {
        const { name, email, _id, password } = await req.json();
        const user = await User.findOne({ email });
        if(user?.loginType === "email") {
            return NextResponse.json({ error: "Please login with email and password" }, { status: 400 });
        }
        if(user?.loginType === "google") {
            (await cookies()).set("token", user.generateToken(), { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 });
            user.password = undefined;
            return NextResponse.json({ message: "User logged in successfully", user }, { status: 200 });
        }
        if(!user) {
            const newUser = await User.create({ name, email, _id, password, loginType: "google" });
            const token = newUser.generateToken();
            (await cookies()).set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 });
            newUser.password = undefined;
            return NextResponse.json({ message: "User logged in successfully", user: newUser }, { status: 200 });
        }
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

} 