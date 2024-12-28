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

import { IVideoDetails } from '@/types';
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
  },
  summary: {
    type: String,
    required: false
  }
}, {timestamps: true});

const Video = mongoose.models.Video as mongoose.Model<IVideoDetails> || mongoose.model<IVideoDetails>("Video", videoSchema);

export default Video;
