import mongoose from "mongoose";
import {Schema} from "mongoose";


const videoSchema = new Schema({
    userId: {type:String, required:true},
    videoUrl:{type:String,required:true,unique:true},
    videoTitle:{type:String,required:true},
    videoStatus:{type:Boolean,default:false},
    createdAt:{type:Date, default:Date.now},
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;