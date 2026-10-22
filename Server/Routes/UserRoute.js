import express from "express";
import Auth from "../Middleware/AuthMiddleWare.js";
import { Register, UserLogin,Application,ViewApplication,ViewDrivingSchools,ApplyToDrivingSchool, ViewUser } from "../Controller/UserController.js";
import upload from '../Middleware/ImageUpload.js'
import { ScheduleDrivingTest, ViewMyDrivingTests } from "../Controller/DrivingTestController.js";

const route = express.Router();


route.post("/Login",UserLogin)
route.post("/Register",Register)
route.post("/Application",Auth,upload.single("DocumentImage"),Application)
route.get("/ViewApplication",Auth,ViewApplication)
route.get("/ViewDrivingSchools",ViewDrivingSchools)
route.put("/JoinSchool/:SchoolId",Auth,ApplyToDrivingSchool)
route.get("/ViewUser",Auth,ViewUser)
route.get("/ViewMyDrivingTests", Auth, ViewMyDrivingTests);
route.post("/ScheduleDrivingTest", Auth, ScheduleDrivingTest);

export default route
