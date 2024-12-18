/*
{
  "_id": ObjectId,
  "userId": ObjectId, // Reference to User collection
  "name": String,
  "description": String,
  "isPublic": Boolean,
  "coverPicture": String, // Optional cover/representative video
  "tags": [String],
  "createdAt": Date,
  "updatedAt": Date
}
*/
import mongoose from "mongoose"

const playlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isPublic: {
        type: Boolean,
        required: true,
        default: false
    },
    coverPicture: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: false
    }
}, {timestamps: true});

const Playlist = mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);

export default Playlist;



