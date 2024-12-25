import mongoose from "mongoose";
import {Schema} from "mongoose";


const userSchema =new Schema({
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now}
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;