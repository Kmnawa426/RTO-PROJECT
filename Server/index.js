import express from "express";
import cors from 'cors'
import { configDotenv } from "dotenv";
import dbconnection from "./Database/Database.js";
import UserRoutes from "./Routes/UserRoute.js";
import ARoute from './Routes/AdminRoute.js';
import SRoute from './Routes/SchoolRoute.js'
import LLTestRoute from "./Routes/LLTestRoute.js";
import DrivingTestRoute from "./Routes/DrivingTestRoute.js";

configDotenv()
const app = express()
const PORT_NO=process.env.PORT_NO
app.use(cors())
app.use(express.json())

app.listen(PORT_NO,()=>{
    console.log(`Server is Running in Port : ${PORT_NO}`)
})


dbconnection()
app.use("/User", UserRoutes);
app.use("/Admin", ARoute);
app.use("/School",SRoute)
app.use("/LLTest", LLTestRoute);
app.use("/DrivingTest", DrivingTestRoute);