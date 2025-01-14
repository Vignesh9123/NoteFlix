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

const Video =  mongoose.model("Video", videoSchema);

export default Video;
