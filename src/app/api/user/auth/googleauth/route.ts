import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/dbConfig/connectDB";
import {getAdminApp} from "@/config/firebase-admin";    
connectDB();
export async function POST(req: NextRequest){
    try {
        if(req.headers.get("Postman-Token")) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        const adminApp = await getAdminApp();
       const { idToken }: { idToken: string } = await req.json();
        const decodedToken = await adminApp.auth().verifyIdToken(idToken);
        const { name, email , uid  } = decodedToken;
        const password = uid;
        const user = await User.findOne({ email });
        if(user?.loginType === "email") {
            return NextResponse.json({ error: "Please login with email and password" }, { status: 400 });
        }
        if(user?.loginType === "google") {
            const token = user.generateToken();
            (await cookies()).set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 });
            user.password = undefined;
            return NextResponse.json({ message: "User logged in successfully", user,token  }, { status: 200 });
        }
        if(!user) {
            const newUser = await User.create({ name, email, password, loginType: "google" });
            const token = newUser.generateToken();
            (await cookies()).set("token", token, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 60 * 24 });
            newUser.password = undefined;
            return NextResponse.json({ message: "User logged in successfully", user: newUser, token }, { status: 200 });
        }
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

} 