import { IUserNote } from "@/types";
import mongoose from "mongoose";

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
    todoCompleted: {
        type: Boolean,
        required: function(this: IUserNote){
            return this.category === "todo";
        },
        default: false
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