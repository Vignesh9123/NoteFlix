import { NextRequest, NextResponse } from "next/server";
import Library from "@/models/library.model";
import { authMiddleware } from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
connectDB();

export async function POST(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        const { libraryId } = await request.json();
        if (!libraryId) return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        const library = await Library.findById(libraryId);
        if (!library) return NextResponse.json({ message: "Video not found" }, { status: 404 });
        if (library.userId.toString() != request.user?._id.toString()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        library.isFavourite = !library.isFavourite;
        await library.save();
        return NextResponse.json({ data: library, message: library.isFavourite ? "Video favourited successfully" : "Video unfavorited successfully" }, { status: 200 });

    } catch (error) {
        console.log("Error favouriting video in library", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}