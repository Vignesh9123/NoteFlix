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
        required: function (this: any) {
            return this.type === "playlist_entry";
        }
    },
    userNotes: [{
        timestamp: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ["key point", "todo", "question"],
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
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
        required: true
    }
}, { timestamps: true });

const Library = mongoose.models.Library || mongoose.model("Library", librarySchema);

export default Library;
