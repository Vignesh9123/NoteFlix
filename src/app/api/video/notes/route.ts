import { NextResponse , NextRequest} from "next/server";
import { authMiddleware } from "@/middleware/auth.middleware";
import Library from "@/models/library.model";
import Note from "@/models/note.model";
import connectDB from "@/dbConfig/connectDB";
import { IUserNote } from "@/types";
connectDB();
export async function POST(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {notes}:{notes: IUserNote} = await request.json();
        const library = await Library.findById(notes.libraryId);
        if(!library){
            return NextResponse.json({error: "Library not found"}, {status: 404})
        }
        const newNote = await Note.create({
            libraryId: notes.libraryId,
            timestamp: notes.timestamp,
            text: notes.text,
            category: notes.category
        });
        library.userNotes.push(newNote._id);
        await library.save();
        return NextResponse.json({data: library, message: "Notes added successfully"}, {status: 200})
    } catch (error) {
        console.log("Error adding notes", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function GET(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {libraryId}:{libraryId: string} = await request.json();
        const notes = await Note.find({libraryId});
        return NextResponse.json({data: notes}, {status: 200})
    } catch (error) {
        console.log("Error fetching notes", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function DELETE(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {noteId}:{noteId: string} = await request.json();
        const note = await Note.findByIdAndDelete(noteId);
        if(!note){
            return NextResponse.json({error: "Note not found"}, {status: 404})
        }
        const library = await Library.findById(note.libraryId);
        if(!library){
            return NextResponse.json({error: "Library not found"}, {status: 404})
        }
        console.log("library before", library.userNotes);
        library.userNotes = library.userNotes.filter((noteId) => noteId.toString() !== note._id.toString());
        console.log("library after", library.userNotes);
        await library.save();
        return NextResponse.json({data: note, message: "Note deleted successfully"}, {status: 200})
    } catch (error) {
        console.log("Error deleting note", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function PUT(request: NextRequest){
    try {
        const auth = await authMiddleware(request);
        if(auth.status == 401){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {noteId, notes}:{noteId: string, notes: IUserNote} = await request.json();
        const note = await Note.findByIdAndUpdate(noteId, notes);
        return NextResponse.json({data: note, message: "Note updated successfully"}, {status: 200})
    } catch (error) {
        console.log("Error updating note", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

