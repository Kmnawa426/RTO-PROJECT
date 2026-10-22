import DrivingSchoolModel from "../Model/DrivingSchoolModel.js";
import bcrypt from 'bcrypt'
import UserModel from "../Model/UserModel.js";
import ApplicationModel from "../Model/ApplicationModel.js";
import TrainingModel from "../Model/TrainingModel.js";
import jwt from 'jsonwebtoken'
import { config, configDotenv } from "dotenv";
configDotenv()
const RegDrivingSchool = async (req, res) => {
    try {
        const { SchoolName, ContactPerson, Email, Phone, Password, Address, City } = req.body
        const SchoolImage = req.file ? req.file.path : null
        // if (!SchoolImage) {
        //     return res.status(400).json({ message: "Require All the fields" })
        // }
        const HashedPass = await bcrypt.hash(Password, 10)
        const existingCheck = await DrivingSchoolModel.findOne({
            $or: [
                { Email: Email },
                { Phone: Phone }
            ]
        })
        if (existingCheck) {
            return res.status(400).json({ message: 'Email/Phone Already Exists' })
        }
        const School = new DrivingSchoolModel({ SchoolName, ContactPerson, Email, Phone, Password: HashedPass, Address, SchoolImage, City })
        await School.save()
        res.status(200).json({ message: "Application Sent For Approval" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' })
    }
}
const LoginDrivingSchool = async (req, res) => {
    try {
        const { Email, Password } = req.body
        const School = await DrivingSchoolModel.findOne({ Email: Email })
        if (!School) {
            return res.status(400).json({ message: "Driving School Doesnt Exist" })
        }
        const PassWordCheck = await bcrypt.compare(Password, School.Password)
        if (!PassWordCheck) {
            return res.status(400).json({ message: "Inavlid Credential" })
        }
        const ApprovalCheck = School.Permission
        if (!ApprovalCheck) {
            return res.status(400).json({ message: "Application Not Approved Yet" })
        }
        const token = jwt.sign({ id: School._id }, process.env.JWT_SECRET,
            { expiresIn: "1d" })
        res.status(200).json({ message: "Login Successfull", token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const ViewStudents = async (req, res) => {
    try {
        const id = req.id
        const School = await DrivingSchoolModel.findById(id)
        if (!School) {
            return res.status(400).json({ message: "School Not Found" })
        }
        const Students = await ApplicationModel.find({ DrivingSchool: School._id }).populate("User", "-Password")
        if (Students.length === 0) {
            return res.status(400).json({ message: "Students Not Found" })
        }

        res.status(200).json({ message: "Students Fetched", Students })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const AssignTraining = async (req, res) => {
    try {
        const { id } = req.params
        const schoolId = req.id
        const { Application, TrainingStartDate, TrainingEndDate, TrainingSchedule } = req.body
        const UserCheck = await UserModel.findById(id)
        if (!UserCheck) {
            return res.status(400).json({ message: "Please Register to apply for Training" })
        }
        const ApplicationCheck = await ApplicationModel.findOne({ _id: Application, User: id })
        if (!ApplicationCheck) {
            return res.status(400).json({ message: "Submit Application for Training" })
        }
        const School = await DrivingSchoolModel.findById(schoolId)
        if (!School) {
            return res.status(400).json({ message: "Invalid Driving School" })
        }
        const Training = await TrainingModel.findOne({ Application: Application })
        if (Training) {
            return res.status(400).json({ message: "User Already In a Training" })
        }
        const AddTraining = new TrainingModel({ User: id, Application, DrivingSchool: schoolId, TrainingStartDate, TrainingEndDate, TrainingSchedule })
        await AddTraining.save()
        res.status(200).json({ message: "Training Successfully Added", Training: AddTraining })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}
const TRAINING_STATUSES = ["Not Started", "In Progress", "Completed", "Ready for Test"]

const UpdateTrainingStatus = async (req, res) => {
    try {
        const { trainingId } = req.params
        const { Status } = req.body

        if (!TRAINING_STATUSES.includes(Status)) {
            return res.status(400).json({ message: "Invalid Status" })
        }

        // DrivingSchool: req.id stops one school editing another school's records
        const training = await TrainingModel.findOne({
            _id: trainingId,
            DrivingSchool: req.id
        })
        if (!training) {
            return res.status(404).json({ message: "Training Doesn't Exist" })
        }

        training.TrainingStatus = Status
        training.ReadyForTest = Status === "Ready for Test" // keep both fields in sync
        if (Status === "Completed") training.ProgressPercentage = 100

        await training.save()
        res.status(200).json({ message: "Training Updated", Training: training })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const ReadyForTest = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const training = await TrainingModel.findOne({
            Application: applicationId,
            DrivingSchool: req.id,
        });

        if (!training) {
            return res.status(404).json({
                message: "Training doesn't exist",
            });
        }

        const application = await ApplicationModel.findOne({
            _id: applicationId,
            DrivingSchool: req.id,
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found for this driving school",
            });
        }

        if (
            application.LLTestStatus !== "PASSED" ||
            !application.LLTestPassedAt
        ) {
            return res.status(400).json({
                message: "The student must pass the Learner's Licence test first",
            });
        }

        const activeSessions = training.TrainingSchedule.filter(
            (session) => session.Status !== "Cancelled"
        );

        const completedSessions = activeSessions.filter(
            (session) => session.Status === "Completed"
        ).length;

        const progress = activeSessions.length
            ? (completedSessions / activeSessions.length) * 100
            : 0;

        if (progress < 80) {
            return res.status(400).json({
                message: "The student must complete at least 80% of training sessions",
                ProgressPercentage: Math.round(progress),
            });
        }

        const eligibleFrom = new Date(application.LLTestPassedAt);
        eligibleFrom.setHours(0, 0, 0, 0);
        eligibleFrom.setDate(eligibleFrom.getDate() + 30);

        training.ProgressPercentage = Math.round(progress);
        training.ReadyForTest = true;
        training.TrainingStatus = "Ready for Test";

        application.PracticalTestEligibleFrom = eligibleFrom;
        application.PracticalTestStatus =
            new Date() >= eligibleFrom ? "ELIGIBLE" : "WAITING_PERIOD";
        application.ApplicationStatus = "Ready for Test";

        await training.save();
        await application.save();

        return res.status(200).json({
            message: "Student marked Ready for Test successfully",
            Training: training,
            Application: application,
        });
    } catch (error) {
        console.error("ReadyForTest error:", error);

        return res.status(500).json({
            message: "Server error while marking student ready",
        });
    }
};
const AddSession = async (req, res) => {
    try {
        const schoolId = req.id
        const { Application, Topic, Date: SessionDate, StartTime, EndTime } = req.body

        if (!Application || !SessionDate || !StartTime || !EndTime) {
            return res.status(400).json({ message: "Require All the fields" })
        }

        const app = await ApplicationModel.findOne({ _id: Application, DrivingSchool: schoolId })
        if (!app) {
            return res.status(400).json({ message: "Application Not Found" })
        }

        // Create the Training doc on the first session, otherwise reuse it
        let training = await TrainingModel.findOne({ Application })
        if (!training) {
            training = new TrainingModel({
                User: app.User,
                Application,
                DrivingSchool: schoolId,
                TrainingStartDate: SessionDate,
                TrainingEndDate: SessionDate,
            })
        }

        training.TrainingSchedule.push({ Date: SessionDate, StartTime, EndTime, Topic })

        // keep the start/end range in sync with the sessions
        const dates = training.TrainingSchedule.map((s) => new Date(s.Date))
        training.TrainingStartDate = new Date(Math.min(...dates))
        training.TrainingEndDate = new Date(Math.max(...dates))
        if (training.TrainingStatus === "Not Started") training.TrainingStatus = "In Progress"

        await training.save()
        res.status(200).json({ message: "Session Added", Training: training })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const ViewSessions = async (req, res) => {
    try {
        const trainings = await TrainingModel.find({ DrivingSchool: req.id })
            .populate("User", "FullName Phone")   // never send Password

        const Sessions = trainings.flatMap((t) =>
            t.TrainingSchedule.map((s) => ({
                _id: s._id,
                TrainingId: t._id,
                Student: t.User?.FullName,
                Topic: s.Topic,
                Date: s.Date,
                StartTime: s.StartTime,
                EndTime: s.EndTime,
                Status: s.Status,
            }))
        ).sort((a, b) => new Date(a.Date) - new Date(b.Date))

        res.status(200).json({ message: "Sessions Fetched", Sessions })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const DeleteSession = async (req, res) => {
    try {
        const { trainingId, sessionId } = req.params
        const training = await TrainingModel.findOne({ _id: trainingId, DrivingSchool: req.id })
        if (!training) {
            return res.status(404).json({ message: "Training Doesn't Exist" })
        }

        const session = training.TrainingSchedule.id(sessionId)
        if (!session) {
            return res.status(404).json({ message: "Session Not Found" })
        }
        if (session.Status !== "Scheduled") {
            return res.status(400).json({ message: `A ${session.Status} session cannot be deleted` })
        }

        training.TrainingSchedule.pull({ _id: sessionId })
        await training.save()
        res.status(200).json({ message: "Session Deleted" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

const UpdateSessionStatus = async (req, res) => {
    try {
        const { trainingId, sessionId } = req.params
        const { Status } = req.body

        if (!["Completed", "Cancelled"].includes(Status)) {
            return res.status(400).json({ message: "Invalid Status" })
        }

        const training = await TrainingModel.findOne({ _id: trainingId, DrivingSchool: req.id })
        if (!training) {
            return res.status(404).json({ message: "Training Doesn't Exist" })
        }

        const session = training.TrainingSchedule.id(sessionId)
        if (!session) {
            return res.status(404).json({ message: "Session Not Found" })
        }
        if (session.Status !== "Scheduled") {
            return res.status(400).json({ message: `Session is already ${session.Status}` })
        }

        session.Status = Status

        // progress = completed sessions / non-cancelled sessions
        const active = training.TrainingSchedule.filter((s) => s.Status !== "Cancelled")
        const done = active.filter((s) => s.Status === "Completed").length
        training.ProgressPercentage = active.length ? Math.round((done / active.length) * 100) : 0
        if (training.TrainingStatus !== "Ready for Test") {
            if (active.length > 0 && done === active.length) training.TrainingStatus = "Completed"
            else if (done > 0) training.TrainingStatus = "In Progress"
        }
        await training.save()
        res.status(200).json({ message: `Session ${Status}` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}
const ViewProgress = async (req, res) => {
    try {
        const trainings = await TrainingModel.find({ DrivingSchool: req.id })
            .populate("User", "FullName Phone")   // never send Password
            .sort({ updatedAt: -1 })
            .lean()

        const Progress = trainings.map((t) => {
            const active = t.TrainingSchedule.filter((s) => s.Status !== "Cancelled")
            const done = active.filter((s) => s.Status === "Completed").length
            return {
                _id: t._id,
                Application: t.Application,
                Student: t.User?.FullName,
                Phone: t.User?.Phone,
                Completed: done,
                Total: active.length,
                ProgressPercentage: active.length ? Math.round((done / active.length) * 100) : 0,
                TrainingStatus: t.TrainingStatus,
                ReadyForTest: t.ReadyForTest,
            }
        })

        res.status(200).json({ message: "Progress Fetched", Progress })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}
const ViewDrivingTests = async (req, res) => {
    try {
        // Find applications assigned to this driving school
        const Applications = await ApplicationModel.find({
            DrivingSchool: req.id
        }).select("_id");

        const ApplicationIds = Applications.map(
            (app) => app._id
        );

        // Find driving tests for those applications
        const DrivingTests = await DrivingTestModel.find({
            Application: { $in: ApplicationIds }
        })
            .populate("User", "FullName Email Phone")
            .populate("Application", "VehicleType ApplicationStatus")
            .sort({ TestDate: 1 });

        return res.status(200).json({
            message: "Driving tests fetched successfully",
            DrivingTests
        });

    } catch (error) {
        console.log("ViewDrivingTests Error:", error);

        return res.status(500).json({
            message: "Unable to fetch driving tests"
        });
    }
};
export { LoginDrivingSchool, RegDrivingSchool,ViewDrivingTests, ViewStudents, ViewProgress, AssignTraining, ReadyForTest, UpdateTrainingStatus, ViewSessions, AddSession, DeleteSession, UpdateSessionStatus }