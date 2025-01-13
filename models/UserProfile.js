import mongoose from "mongoose";
import {Schema} from "mongoose";

const userProfileSchema = new Schema({
    userId: {type:String, required:true, unique:true},
    fitnessGoal: {type:String, required:true},
    customGoal: {type:String, required:true},
    age: {type:Number, required:true},
    gender:{type:String, required:true},
    fitnessLevel: {type:String},
    height: {type:Number, required:true},
    weight: {type:Number, required:true},
    medicalConditions: {type:String},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:Date.now},
})

const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;