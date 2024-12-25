import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL as string);
        console.log("Connected to MongoDB");
    }catch(error){
        console.log("Error connecting to MongoDB", error);
    }
}
export default connectDB;