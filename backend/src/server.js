import express from 'express';
import dotenv from 'dotenv';
import authRoute from "./routes/auth.route.js"
import cookieparser from 'cookie-parser';
import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import { connectDb } from './lib/db.js';
import User from './models/User.js';
import cors from "cors"
import path from "path"
const app = express();
dotenv.config()

const port=process.env.PORT;

const __dirname= path.resolve();

app.use(cors({
    origin: process.env.FRONTEND_URL, // this allows the backend to accept request from this url this makes it to be dynamic as it is setted "http://localhost:5173" better than saying this
    credentials: true // allow frontedn to send cookies
}))

app.use(express.json())
app.use(cookieparser())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes)

if(process.env.NODE_ENV="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

     app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    connectDb();
})
