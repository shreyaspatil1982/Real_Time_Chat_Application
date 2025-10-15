import jwt from "jsonwebtoken";
import User from "../models/user.model.js"
export const protectedRoute=async(req,res,next)=>{
    try {
       const token=req.cookies.jwt;
       
       if(!token) return res.status(401).json({message:"Un-Otherized User "});

       const decoded=jwt.verify(token,process.env.JWT_SECRET);

       if(!decoded) return res.status(401).json({message:"Un-Otherized Invalid-User"});

      const user=await User.findById(decoded.user_id).select("-password");

      if(!user) return res.status(404).json({message:"user not Found"});

      req.user=user;

      next();
    } catch (error) {
      console.log("Error in Protected Route");
      res.status(500).json({message:"Internal Server Error"});
    }
    
}