/*
{
  "_id": ObjectId,
  "youtubeId": String,
  "title": String,
  "channelName": String,
  "thumbnailUrl": String,
  "duration": Number,
  "publishedAt": Date,
  "metadata": {
    "views": Number,
    "likes": Number,
    "categories": [String]
  },
  "cachedAt": Date
}
*/

import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  youtubeId: {
    type: String,
    required: true
  },
  title: { 
    type: String, 
    required: true
   },
  channelName: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: {
    type: String,
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  publishedAt: { 
    type: Date, 
    required: true
  }
}, {timestamps: true});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
