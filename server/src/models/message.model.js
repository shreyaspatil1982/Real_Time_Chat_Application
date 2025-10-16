import mongoose from "mongoose";
import User from "../models/user.model.js"
const messageSchema=new mongoose.Schema({
    senderId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:User,
      require:true
    },
    receiverId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:User,
      require:true
    },
    text:{
      type:String
    },
    image:{
      type:String
    }
},
{timestamps:true}
);

export default mongoose.model("Message",messageSchema);