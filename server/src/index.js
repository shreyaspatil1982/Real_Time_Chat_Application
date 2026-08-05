import express from "express";

import dotenv from "dotenv";
dotenv.config();
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import {connectDB} from "./lib/db.js"
import {io,server,app} from "./lib/socket.js"


// ✅ Increase payload limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors(
 {
   origin:process.env.CLIENT_URL,
   credentials:true,
}
))
const PORT=process.env.PORT;
app.use("/api/auth",authRoute);
app.use("/api/messages",messageRoute);

server.listen(PORT,()=>{
  connectDB();
});