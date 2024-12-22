import { IUserNote } from "@/types";
import mongoose from "mongoose";
import Library from "./library.model";

const noteSchema = new mongoose.Schema({
    libraryId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Library", 
        required: true
    },
    category: {
        type: String,
        enum: ["key point", "todo", "question"],
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
},{timestamps: true})



const Note = mongoose.models.Note as mongoose.Model<IUserNote> || mongoose.model<IUserNote>("Note", noteSchema);

export default Note;