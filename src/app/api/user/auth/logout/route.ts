import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export const GET = async (req: NextRequest, res: NextResponse) => {
    (await cookies()).delete("token");
    return NextResponse.json({ message: "Logged out" }, { status: 200 });
}