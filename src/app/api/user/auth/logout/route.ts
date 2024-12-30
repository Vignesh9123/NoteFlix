import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authMiddleware } from "@/middleware/auth.middleware";
export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const auth = await authMiddleware(req);
        if(auth.status == 401) return NextResponse.json({message: "Unauthorized"}, {status: 401});
        (await cookies()).delete("token");
        return NextResponse.json({ message: "Logged out" }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}