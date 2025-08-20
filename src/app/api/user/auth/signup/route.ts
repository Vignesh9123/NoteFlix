// import User from "@/models/user.model";
import { NextRequest } from "next/server";
import connectDB from "@/dbConfig/connectDB";
connectDB();
export const POST = async (_req: NextRequest) => {
    return;
    // const { name, email, password } = await req.json();
    // if(!name || !email || !password) {
    //     return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    // }
    // const existingUser = await User.findOne({ email });
    // if(existingUser) {
    //     return NextResponse.json({ error: "User already exists" }, { status: 400 });
    // }

    // const user = await User.create({ name, email, password });
    // user.password = undefined;
    // return NextResponse.json({
    //     message: "User created successfully",
    //     user: user
    // },{status: 201});
}

