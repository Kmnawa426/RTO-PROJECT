import UserModel from "../Model/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"
import ApplicationModel from "../Model/ApplicationModel.js"
import DrivingSchoolModel from "../Model/DrivingSchoolModel.js"
import TrainingModel from "../Model/TrainingModel.js"
configDotenv()


const ViewApplication = async (req, res) => {
    try {
        const id = req.id

        const Applicant = await ApplicationModel.find({ User: id })
            .populate("DrivingSchool", "SchoolName City")
            .sort({ createdAt: -1 })
            .lean()

        const trainings = await TrainingModel.find({
            Application: { $in: Applicant.map((a) => a._id) }
        }).lean()

        const result = Applicant.map((a) => {
            const t = trainings.find((t) => String(t.Application) === String(a._id))
            return {
                ...a,
                TrainingSchedule: t?.TrainingSchedule || [],
                Remarks: t?.Remarks || "",
            }
        })

        // an empty list is not an error, so return 200 instead of 404
        return res.status(200).json({
            message: "Application details fetched successfully",
            Applicant: result
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server Error" })
    }
}

const Register = async (req, res) => {
    try {
        console.log(req.body)
        const {
            FullName, Email, Phone, Password, Address, DateOfBirth } = req.body

        if (!FullName || !Email || !Phone || !Password ||
            !Address || !DateOfBirth) {
            return res.status(400).json({
                message: "Please fill all required fields"
            })
        }

        const ExistingUser = await UserModel.findOne({ Email })

        if (ExistingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            })
        }

        const HashedPass = await bcrypt.hash(Password, 10)

        const User = new UserModel({
            FullName,
            Email,
            Phone,
            Password: HashedPass,
            Address,
            DateOfBirth
        })

        await User.save()

        const Token = jwt.sign({ id: User._id }, process.env.SECRET_KEY)
        return res.status(201).json({ message: "Registration Successful", Token })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}


const UserLogin = async (req, res) => {
    try {
        console.log(req.body)
        const { Email, Password } = req.body

        if (!Email || !Password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const User = await UserModel.findOne({ Email })

        if (!User) {
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const CheckPass = await bcrypt.compare(
            Password,
            User.Password
        )

        if (!CheckPass) {
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }

        const Token = jwt.sign({ id: User._id }, process.env.SECRET_KEY)

        return res.status(200).json({
            message: "Login Successful",
            Token,
            User: {
                _id: User._id,
                FullName: User.FullName,
                Email: User.Email
            }
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}


const Application = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.id)
        const id = req.id
        const { ApplicationType, VehicleType, DateOfBirth, Address, DocumentName } = req.body
        const DocumentImage = req.file ? req.file.path : null
        if (
            !ApplicationType ||
            !VehicleType ||
            !DateOfBirth ||
            !Address ||
            !DocumentName ||
            !DocumentImage
        ) {
            return res.status(400).json({
                message: "Please provide all required application details and documents"
            })
        }

        const UserCheck = await UserModel.findById(id)

        if (!UserCheck) {
            return res.status(404).json({
                message: "Please register before submitting an application"
            })
        }
        const ExistingApplication = await ApplicationModel.findOne({ User: id, ApplicationType: ApplicationType, VehicleType: VehicleType, ApplicationStatus: { $ne: "Rejected" } })
        if (ExistingApplication) {
            console.log(ExistingApplication)
            return res.status(400).json({ message: "Application Exists" })
        }

        const NewApplication = new ApplicationModel({
            User: UserCheck._id,
            ApplicationType,
            VehicleType,
            DateOfBirth,
            Address,
            DocumentName,
            DocumentImage
        })

        await NewApplication.save()

        return res.status(201).json({
            message: "Application submitted successfully",
            Application: NewApplication
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}


const ViewDrivingSchools = async (req, res) => {
    try {
        const Schools = await DrivingSchoolModel.find({
            Permission: true
        }).select("-Password")

        return res.status(200).json({
            message: "Driving school list fetched successfully",
            Schools
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Server Error"
        })
    }
}


const ApplyToDrivingSchool = async (req, res) => {
    try {
        const { SchoolId } = req.params
        const { appid } = req.body

        const School = await DrivingSchoolModel.findById(SchoolId)
        if (!School || !School.Permission) {
            return res.status(404).json({ message: "Approved driving school not found" })
        }

        const application = await ApplicationModel.findOne({ _id: appid, User: req.id })
        if (!application) {
            return res.status(404).json({ message: "Application not found" })
        }
        if (application.DrivingSchool) {
            return res.status(400).json({ message: "Driving School Already Assigned" })
        }

        application.DrivingSchool = SchoolId
        await application.save()

        res.status(200).json({
            message: "Driving school joined successfully",
            DrivingSchool: { _id: School._id, SchoolName: School.SchoolName },
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server Error" })
    }
}
const ViewUser = async (req, res) => {
    try {
        const id = req.id
        const User = await UserModel.findById(id).select("-Password")
        if (!User) {
            return res.status(400).json({ message: "User Not Found" })
        }
        res.status(200).json({ message: "User data fetched", User })
    } catch (error) {
        console.log(error)
    }
}

export {
    Register, UserLogin, Application, ViewApplication, ViewDrivingSchools, ApplyToDrivingSchool, ViewUser
}