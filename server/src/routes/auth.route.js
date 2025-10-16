import express from "express";
import {signup,login,logout,getUser} from "../controllers/auth.controller.js"
import { protectedRoute } from "../middeleware/protectedRoute.js";
import { updateProfile } from "../controllers/auth.controller.js";


const router= express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/check",protectedRoute,getUser);

router.put("/updateProfile",protectedRoute,updateProfile)

export default router;