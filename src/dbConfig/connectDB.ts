import mongoose from "mongoose";
import config from "@/config/config";
const connectDB = async () => {
 try {
     await mongoose.connect(config.mongoURI, {dbName:"noteflix"});
     const connection = mongoose.connection;
     connection.on("connected", () => {
       console.log("Connected to MongoDB");
     });
     connection.on("error", (error) => {
       console.log("Error connecting to MongoDB", error);
       process.exit(1);
     });
 } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
 }
};

export default connectDB;

