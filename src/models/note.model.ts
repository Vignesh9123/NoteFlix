import { IUserNote } from "@/types";
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    libraryId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Library", 
        required: true
    },
   title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
    }
},{timestamps: true})



const Note = mongoose.models.Note as mongoose.Model<IUserNote> || mongoose.model<IUserNote>("Note", noteSchema);

export default Note;