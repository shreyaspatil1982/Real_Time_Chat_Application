import express from "express";

import dotenv from "dotenv";
dotenv.config();
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

import {connectDB} from "./lib/db.js"

const app= express();
app.use(express.json());
app.use(cookieParser());
const PORT=process.env.PORT;
app.use("/api/auth",authRoute);

app.listen(PORT,()=>{
  console.log("server is running on port"+PORT);
  connectDB();
});