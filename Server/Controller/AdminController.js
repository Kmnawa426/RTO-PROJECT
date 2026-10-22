import UserModel from "../Model/UserModel.js"
import DrivingSchoolModel from "../Model/DrivingSchoolModel.js"
import ApplicationModel from "../Model/ApplicationModel.js"
import AdminModel from "../Model/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AdminRegister = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    if (Password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters",
      });
    }

    const CheckAdmin = await AdminModel.findOne({
      Email: Email.trim().toLowerCase(),
    });

    if (CheckAdmin) {
      return res.status(400).json({
        message: "Admin Already Registered",
      });
    }

    const HashedPassword = await bcrypt.hash(Password, 10);

    const Admin = new AdminModel({
      Email: Email.trim().toLowerCase(),
      Password: HashedPassword,
    });

    await Admin.save();

    const Token = jwt.sign(
      { id: Admin._id, role: "Admin", }, process.env.SECRET_KEY, { expiresIn: "1d", }
    );

    return res.status(201).json({
      message: "Admin Registered Successfully",
      Token,
      Admin: {
        _id: Admin._id,
        FullName: Admin.FullName,
        Email: Admin.Email,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};


const AdminLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({
        message: "Please provide Email and Password",
      });
    }

    const Admin = await AdminModel.findOne({
      Email: Email.trim().toLowerCase(),
    });

    if (!Admin) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const CheckPassword = await bcrypt.compare(
      Password,
      Admin.Password
    );

    if (!CheckPassword) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const Token = jwt.sign(
      {
        id: Admin._id,
        role: "Admin",
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Admin Login Successful",
      Token,
      Admin: {
        _id: Admin._id,
        FullName: Admin.FullName,
        Email: Admin.Email,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};


const AllUser = async (req, res) => {
  try {
    const Users = await UserModel.find()
    if (Users.length === 0) {
      return res.status(400).json({ message: "Users Not Registered Yet" })
    }
    res.status(200).json({ message: "Users Fetched", Users })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}
const ApproveSchool = async (req, res) => {
  try {
    const { id } = req.body
    const School = await DrivingSchoolModel.findById(id)
    if (!School) {
      return res.status(400).json({ message: "School Doesnt Exist" })
    }
    const CheckApproved = School.Permission
    if (CheckApproved) {
      return res.status(400).json({ message: "School Already Approved" })
    }
    School.Permission = true
    await School.save()
    res.status(200).json({ message: "School Approved", School })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}
const RejectSchool = async (req, res) => {
  try {
    const { id } = req.body
    const School = await DrivingSchoolModel.findById(id)
    if (!School) {
      return res.status(400).json({ message: "School Doesnt Exist" })
    }
    School.Permission = false
    await School.save()
    res.status(200).json({ message: "School Rejected", School })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}
const VerifyDocument = async (req, res) => {
  try {
    const { DocumentStatus, id, AdminRemarks } = req.body
    const Application = await ApplicationModel.findById(id)
    if (!Application) {
      return res.status(400).json({ message: "No Application Exists" })
    }
    Application.DocumentVerification = DocumentStatus
    if (AdminRemarks) { Application.AdminRemarks = AdminRemarks }
    if (DocumentStatus === "Rejected") { Application.ApplicationStatus = "Documents Rejected" }
    if (DocumentStatus === "Verified") { Application.ApplicationStatus = "Approved" }
    await Application.save()
    return res.status(200).json({
      message: "Document Status Updated", Application: await ApplicationModel.findById(Application._id)
        .populate("User")
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}
const UpdateApplicationStatus = async (req, res) => {
  try {
    const { Status, id, AdminRemarks } = req.body
    const Application = await ApplicationModel.findById(id);
    if (!Application) {
      return res.status(400).json({ message: "No Application Exists" })
    }
    if (Status === "Completed") {
      const doc = Application.DocumentVerification
      if (doc !== "Verified") {
        return res.status(400).json({ message: "Document Verification Needed" })
      }
    }
    Application.ApplicationStatus = Status
    if (AdminRemarks) { Application.AdminRemarks = AdminRemarks }
    await Application.save()

    const UpdatedApplication = await ApplicationModel.findById(id).populate("User");

    return res.status(200).json({
      message: "Application Status Updated Successfully",
      Application: UpdatedApplication,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}

const ViewApplication = async (req, res) => {
  try {
    const Application = await ApplicationModel.find().populate("User", "FullName Email Phone Address",)
    if (Application.length === 0) {
      return res.status(400).json({ message: "No Application Recieved" })
    }
    res.status(200).json({ message: "Fetched Applications", Application })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}

const ViewDrivingSchools = async (req, res) => {
  try {
    const Schools = await DrivingSchoolModel.find().select("-Password")

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


const AuthorizeLLTest = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Application ID is required",
      });
    }

    const Application = await ApplicationModel.findById(id);

    if (!Application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (Application.ApplicationType !== "Learner Licence") {
      return res.status(400).json({
        message: "Only Learner Licence applications can be authorized for this test",
      });
    }

    if (Application.DocumentVerification !== "Verified") {
      return res.status(400).json({
        message: "Verify the documents before authorizing the theory test",
      });
    }

    if (Application.ApplicationStatus !== "Approved") {
      return res.status(400).json({
        message: "The application must be approved first",
      });
    }

    if (Application.LLTestStatus !== "LOCKED") {
      return res.status(400).json({
        message: "The theory test is not in a state that can be authorized",
      });
    }

    Application.LLTestAuthorized = true;
    Application.LLTestStatus = "AVAILABLE";

    await Application.save();

    return res.status(200).json({
      message: "Learner Licence theory test authorized successfully",
      Application,
    });
  } catch (error) {
    console.error("AuthorizeLLTest error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
const ViewLicenceEligibleApplications = async (req, res) => {
  try {
    const Applications = await ApplicationModel.find({
      ApplicationType: "Driving Licence",
      PracticalTestStatus: { $in: ["PASSED", "Passed"] },
      LicenceIssuedAt: null,
    })
      .populate("User", "FullName Email Phone")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Eligible licence applications fetched successfully",
      Applications,
    });
  } catch (error) {
    console.error("ViewLicenceEligibleApplications:", error);
    return res.status(500).json({
      message: "Failed to fetch eligible applications",
    });
  }
};
const IssueDrivingLicence = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { LicenceNumber } = req.body;

    if (!LicenceNumber?.trim()) {
      return res.status(400).json({
        message: "Licence number is required",
      });
    }

    const application = await ApplicationModel.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (application.ApplicationType !== "Driving Licence") {
      return res.status(400).json({
        message: "This is not a driving licence application",
      });
    }

    if (
      !["PASSED", "Passed"].includes(application.PracticalTestStatus)
    ) {
      return res.status(400).json({
        message: "Applicant must pass the driving test first",
      });
    }

    if (application.LicenceIssuedAt || application.LicenceNumber) {
      return res.status(409).json({
        message: "A licence has already been issued for this application",
      });
    }

    const duplicate = await ApplicationModel.findOne({
      LicenceNumber: LicenceNumber.trim(),
    });

    if (duplicate) {
      return res.status(409).json({
        message: "This licence number is already in use",
      });
    }

    application.LicenceNumber = LicenceNumber.trim();
    application.LicenceIssuedAt = new Date();

    await application.save();

    return res.status(200).json({
      message: "Driving licence issued successfully",
      Application: application,
    });
  } catch (error) {
    console.error("IssueDrivingLicence:", error);
    return res.status(500).json({
      message: "Failed to issue driving licence",
    });
  }
};
const ViewAllDrivingTests = async (req, res) => {
    try {
        const DrivingTests = await DrivingTestModel.find()
            .populate("User", "FullName Email Phone")
            .populate("Application")
            .sort({ TestDate: 1, TestTime: 1 });

        return res.status(200).json({
            message: "Driving tests fetched successfully",
            DrivingTests,
        });
    } catch (error) {
        console.error("ViewAllDrivingTests error:", error);
        return res.status(500).json({
            message: "Server error while fetching driving tests",
        });
    }
};

export {
  AllUser, ApproveSchool, UpdateApplicationStatus, RejectSchool, ViewAllDrivingTests,
  VerifyDocument, ViewDrivingSchools, ViewApplication, AuthorizeLLTest, ViewLicenceEligibleApplications, IssueDrivingLicence, AdminRegister, AdminLogin
};