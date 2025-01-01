import { NextRequest, NextResponse } from "next/server";
import Library from "@/models/library.model";
import { authMiddleware } from "@/middleware/auth.middleware";
import connectDB from "@/dbConfig/connectDB";
connectDB();

export async function DELETE(request: NextRequest) {
    try {
        const auth = await authMiddleware(request);
        if (auth.status == 401) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { libraryIds }: { libraryIds: string[] } = await request.json();
        libraryIds.map(async (libraryId) => {
            const library = await Library.findById(libraryId);
            if(!library) return NextResponse.json({ error: "Video not found" }, { status: 404 });
            if(library.userId.toString() != request.user?._id.toString()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            await library.deleteOne();
        })
        
        return NextResponse.json({ message: "Videos deleted successfully" }, { status: 200 });

    } catch (error) {
        console.log("Error deleting video from library", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}