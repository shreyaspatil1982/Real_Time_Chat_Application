import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import {generateToken} from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js"
export const signup = async(req,res)=>{
  const {email,fullName,password,profilepic} =req.body;
    try{
      if(!email||!fullName||!password) return res.ststus(400).json({message:"All fields are required"});
      if(password.length<6) return res.status(400).json({messege:"password must be at least 6 character"});
      const user = await User.findOne({email});
      if(user) return res.status(400).json({messege:"user already exist"});

      const salt=await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password,salt);

      const newUser= new User({
          fullname:fullName,
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



export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
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

export const updateProfile =async(req,res)=>{
   console.log("in updateProfile");
try {
   
  const {profilepic}=req.body;
  const userid=req.user._id;

  if(!profilepic) return res.status(400).json({message:"Profile picture required"});

  const uploadRespon=await cloudinary.uploader.upload(profilepic);

  const updateUser=await User.findByIdAndUpdate(userid,{profilepic:uploadRespon.secure_url},{new:true});
  
  res.status(200).json(updateUser);
} catch (error) {
    console.log("error in update profile ",error.message);
    res.status(500).json({message:"Internal Server Error"});
}
    

}


export const getUser=async(req,res)=>{
   try {
      
    const user=req.user;
    res.status(200).json(user);

   } catch (error) {
      console.log("error in get User");
      res.status(500).json({message:"Internal Server Error"});
   }
}