import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.js";

export const connectDB = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL+'/'+DB_NAME)
        
        
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Database connection failed")
        console.log(error)
        process.exit(1)
    }
}