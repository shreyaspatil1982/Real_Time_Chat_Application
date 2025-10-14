 import mongoose from "mongoose";

 export const connectDB=async()=>{
  try{
    const conn=await mongoose.connect(process.env.MONGODB_URI);
    console.log("mongoDb connected ");
  }catch(error){
      console.log("mongoDB connection error",error)
  }
 }