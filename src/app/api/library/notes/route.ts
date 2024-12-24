import { NextRequest, NextResponse } from "next/server";
import Library from "@/models/library.model";
import mongoose from "mongoose";
import { authMiddleware } from "@/middleware/auth.middleware";

export async function POST(req: NextRequest) {
  try {
    const auth = await authMiddleware(req);
    if(auth.status == 401){
      return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }
    const { id }: { id: string } = await req.json();
    const notes = await Library
    .aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
          $lookup: {
              from: "notes",
              localField: "userNotes",
              foreignField: "_id",
              as: "userNotes",
          },
      },
      {
        $project: {
          userNotes: 1,
        },
      },
    ]);
    if(notes.length === 0){
      return NextResponse.json({ error: "No notes found" }, { status: 404 });
    }
    return NextResponse.json({ data: notes[0].userNotes , message: "Notes fetched successfully"},{status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

