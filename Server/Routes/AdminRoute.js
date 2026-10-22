
import express from "express";

import {
    AdminLogin,
    AdminRegister,
    AllUser, ApproveSchool, AuthorizeLLTest, IssueDrivingLicence, RejectSchool, UpdateApplicationStatus, VerifyDocument, ViewApplication, ViewDrivingSchools, ViewLicenceEligibleApplications,
} from "../Controller/AdminController.js";

import { ViewReadyApplicants, ViewAllDrivingTests, ScheduleDrivingTest, UpdateDrivingTest, } from "../Controller/DrivingTestController.js";
import auth from "../Middleware/AuthMiddleWare.js";
const route = express.Router();


route.get("/AllUser", AllUser);
route.put("/ApproveSchool", ApproveSchool);
route.put("/RejectSchool", RejectSchool);
route.get("/ViewDrivingSchools", ViewDrivingSchools);
route.get("/ViewApplication", ViewApplication);
route.put("/VerifyDocument", VerifyDocument);
route.put("/UpdateAppStatus", UpdateApplicationStatus);
route.put("/AuthorizeLLTest", AuthorizeLLTest);
route.get("/ViewReadyApplicants", ViewReadyApplicants);
route.get("/ViewAllDrivingTests", ViewAllDrivingTests);
route.post("/ScheduleDrivingTest", ScheduleDrivingTest);
route.put("/UpdateDrivingTestStatus/:testId", UpdateDrivingTest);
route.get("/ViewLicenceEligibleApplications", ViewLicenceEligibleApplications);
route.post("/IssueDrivingLicence/:applicationId", IssueDrivingLicence);
route.post("/Register", AdminRegister);
route.post("/Login", AdminLogin);
export default route;
