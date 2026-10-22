import express from 'express'
import { AssignTraining, LoginDrivingSchool, RegDrivingSchool, UpdateTrainingStatus, ViewStudents,ViewSessions,AddSession,DeleteSession, ReadyForTest, UpdateSessionStatus, ViewProgress, ViewDrivingTests } from '../Controller/DrivingSchoolController.js'
import auth from '../Middleware/AuthMiddleWare.js'

const route=express.Router()

route.post("/AddSchool",RegDrivingSchool)
route.post("/Login",LoginDrivingSchool)
route.get("/ViewStudents",auth,ViewStudents)
route.post("/AssignTraining",auth,AssignTraining)
route.put("/UpdateTrainingStatus/:trainingId", auth, UpdateTrainingStatus)
route.put("/ReadyForTest/:applicationId", auth, ReadyForTest)
route.post("/AddSession", auth, AddSession)
route.get("/ViewSessions", auth, ViewSessions)
route.delete("/DeleteSession/:trainingId/:sessionId", auth, DeleteSession)
route.put("/UpdateSessionStatus/:trainingId/:sessionId", auth, UpdateSessionStatus)
route.get("/ViewProgress", auth, ViewProgress)
route.get("/ViewDrivingTests", auth, ViewDrivingTests);
export default route