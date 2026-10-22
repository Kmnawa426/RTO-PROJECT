
import express from "express";

import { StartLLTest, SubmitLLTest, ViewMyLLTestResult, } from "../Controller/LLTestController.js";
import AuthUserCheck from "../Middleware/AuthMiddleWare.js";

const router = express.Router();

// Start the learner's licence theory test
router.post("/Start", AuthUserCheck, StartLLTest);

// Submit answers and calculate the result
router.post("/Submit/:id", AuthUserCheck, SubmitLLTest);

// View the logged-in user's latest completed test result
router.get("/Result/:ApplicationId",AuthUserCheck,ViewMyLLTestResult);
export default router;
