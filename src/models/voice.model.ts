import { IVoice } from "@/types"
import mongoose from "mongoose"

const voiceSchema = new mongoose.Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true,
    },
    chatTitle: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
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

const Voice = mongoose.models.Voice as mongoose.Model<IVoice> || mongoose.model<IVoice>("Voice", voiceSchema)

export default Voice
