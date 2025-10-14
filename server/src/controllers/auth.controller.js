import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/util.js";
export const signup = async(req,res)=>{
  const {email,fullname,password,profilepic} =req.body;
    try{
      
      if(password.length<6) return res.status(400).json({messege:"password must be at least 6 character"});
      const user = await User.findOne({email});
      if(user) return res.status(400).json({messege:"user already exist"});

      const salt=await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password,salt);

      const newUser= new User({
          fullname,
          email,
          password:hashedpassword,
          profilepic
      })
       
      if(newUser){
         generateToken(newUser._id,res)
      

      await newUser.save();
      
      res.status(201).json({
         _id:newUser._id,
         fullname:newUser.fullname,
         email:newUser.email,
         profilepic:newUser.profilepic,
      })
    }else{

      res.status(400).json({
         message:"invalid user data"
      });

    }

    }catch(e){
        console.log("Eroor in SignUP ",e.message)
        res.status(400).json({messege:"internal serever erro"});
    }
}



export const logout=(req,res)=>{
  try{
    res.cookies("jwt","",{maxAge:0});
    res.status(200).json({message:"logged out succssfully"});

  }catch(e){

  }

}

export const login= async(req,res)=>{
  
  try{
      
  const {email,password} = req.body;
   
  const user= await User.findOne({email});
  if(!user) return res.status(400).json({message:"user not exist"});
  
 const isPasswordCorrect= await bcrypt.compare(password,user.password);

 if(!isPasswordCorrect) return res.status(400).json({message:"envalid Credentials"});
 generateToken(user._id,res);
 res.status(200).json({
    _id:user._id,
         fullname:user.fullname,
         email:user.email,
         profilepic:user.profilepic,
 })
  }catch(e){
     console.log(e.message);
  }


}