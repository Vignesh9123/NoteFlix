import { IVoice } from "@/types"
import mongoose from "mongoose"

const voiceSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        ref: "Video"
    },
    chatTitle: {
        type: String
    },
    userId: {
        type: String,
        required: true,
        ref: "Users"
    },
    chats: [
        {
            role: String,
            content: String
        }
    ]
    
}, {timestamps: true})

export default mongoose.models.Voice as mongoose.Model<IVoice> || mongoose.model<IVoice>("Voice", voiceSchema)
