import express from "express";
import { protectedRoute } from "../middeleware/protectedRoute.js";

import {getSidebarUser,getMessages,sendMessage} from "../controllers/message.controller.js";

const router=express.Router();


router.get("/getUsers",protectedRoute,getSidebarUser);
router.get("/:id/getMessage",protectedRoute,getMessages);
router.post("/:id/sendMessage",protectedRoute,sendMessage);

 export default router;