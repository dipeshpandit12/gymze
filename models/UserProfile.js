import mongoose from "mongoose";
import {Schema} from "mongoose";

const userProfileSchema = new Schema({
    userId: {type:String, required:true, unique:true},
    fitnessGoal: {type:String, required:true},
    age: {type:String, required:true},
    gender:{type:String, required:true},
    fitnessLevel: {type:String},
    height: {type:String, required:true},
    weight: {type:String, required:true},
    medicalConditions: {type:String},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
})

const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;