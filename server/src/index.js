import express from "express";

import dotenv from "dotenv";
dotenv.config();
import authRoute from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js"

const app= express();
app.use(express.json());
const PORT=process.env.PORT;
app.use("/api/auth",authRoute);

app.listen(PORT,()=>{
  console.log("server is running on port"+PORT);
  connectDB();
});