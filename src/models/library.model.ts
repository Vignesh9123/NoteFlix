/*
{
  "_id": ObjectId,
  "userId": ObjectId, // Reference to User collection
  "videoId": ObjectId, // Reference to Video collection
  "type": String, // "standalone" or "playlist_entry"
  "playlistId": ObjectId, // Optional, if part of a playlist
  "userNotes": [
    {
      "timestamp": Number, // in seconds
      "text": String,
      "category": String, // "key point", "todo", "question"
      "createdAt": Date
    }
  ],
  "watchProgress": {
    "lastWatchedTimestamp": Number,
    "percentageWatched": Number,
    "watchedSegments": [
      {
        "start": Number,
        "end": Number
      }
    ]
  },
  "tags": [String], // User-defined tags for standalone and playlist entries
  "status": String, // "watched", "to_watch", "in_progress"
  "rating": Number, // 1-5 stars
  "addedAt": Date,
  "lastUpdated": Date
}
*/

import { ILibrary } from "@/types";
import Note from "./note.model";
import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    type: {
        type: String,
        enum: ["standalone", "playlist_entry"],
        required: true
    },
    playlistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
        required: function (this: ILibrary) {
            return this.type === "playlist_entry";
        }
    },
    userNotes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Note",
        required: false
    },
    watchProgress: {
        lastWatchedTimestamp: {
            type: Number,
            required: false
        },
        percentageWatched: {
            type: Number,
            required: false
        }
    },
    tags: [{
        type: String,
        required: false
    }],
    status: {
        type: String,
        enum: ["watched", "to_watch", "in_progress"],
        required: true,
        default: "to_watch"
    },
    isStarred: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

librarySchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Note.deleteMany({libraryId: doc._id});
    }
});

librarySchema.post("deleteMany", async function (docs) {
    if (docs) {
        await Note.deleteMany({libraryId: {$in: docs.map((doc: any) => doc._id)}});
    }
});


const Library = mongoose.models.Library as mongoose.Model<ILibrary> || mongoose.model<ILibrary>("Library", librarySchema);

export default Library;
