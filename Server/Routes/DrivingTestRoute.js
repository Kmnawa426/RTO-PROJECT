import express from "express";

import {
    ScheduleDrivingTest,
    ViewAllDrivingTests,
    ViewMyDrivingTests,
    ViewDrivingTestById,
    UpdateDrivingTest,
    RescheduleDrivingTest,
    DeleteDrivingTest
} from "../Controller/DrivingTestController.js";
import auth from '../Middleware/AuthMiddleWare.js'

const router = express.Router();

router.post("/Schedule",auth, ScheduleDrivingTest);
router.get("/MyTests", auth,ViewMyDrivingTests);
router.get("/ViewById/:id", ViewDrivingTestById);
router.put("/Update/:id", auth,UpdateDrivingTest);
router.put("/Reschedule/:id", RescheduleDrivingTest);
router.delete("/Delete/:id", DeleteDrivingTest);

export default router;
