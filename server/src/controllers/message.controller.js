import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getSidebarUser = async (req, res) => {
  try {
    const userid = req.user._id;
    const filteredUser = await User.find({_id: { $ne: userid } }).select("-password");

    res.status(200).json(filteredUser);
  } catch (error) {
    console.log("error in getSidebarUser");
    res.status(500).json({ messsage: "Internal Server Error" });
  }
}


export const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    });

    res.status(200).json(messages);
  } catch (error) {
     console.log("Error in getMessages",error.messsage);
  }

}


export const sendMessage=async(req,res)=>{
    try {
      const {text,image}=req.body;
     const { id: receiverId } = req.params; 
      const senderId=req.user._id;

      let imageUrl;
      if(image) {
        const uploadResponse= await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
        
      }

      const newMessage= new Message ({
        senderId,
        receiverId,
        text,
        image:imageUrl,

      })

      await newMessage.save();

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }


     // socket.io
      res.status(200).json(newMessage);
    } catch (error) {
       
      console.log("error in sendMessage",error.message);
      res.status(500).json({message:"Internal Server Error"});

    }
}


