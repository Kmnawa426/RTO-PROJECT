import DrivingTestModel from "../Model/DrivingTestModel.js";
import UserModel from "../Model/UserModel.js";
import ApplicationModel from "../Model/ApplicationModel.js";

const ScheduleDrivingTest = async (req, res) => {
    try {
        const { Application, TestDate, TestTime, TestRemarks } = req.body;
        const User = req.id;

        if (!User) {
            return res.status(401).json({
                message: "Please log in first",
            });
        }

        if (!User || !Application || !TestDate || !TestTime) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        const UserCheck = await UserModel.findById(User);

        if (!UserCheck) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const ApplicationCheck = await ApplicationModel.findOne({
            _id: Application,
            User,
        });

        if (!ApplicationCheck) {
            return res.status(404).json({
                message: "Application not found for this user",
            });
        }

        // The LL theory test must be passed first.
        if (ApplicationCheck.LLTestStatus !== "PASSED" ||
            !ApplicationCheck.LLTestPassedAt) {
            return res.status(400).json({
                message: "Pass the Learner's Licence theory test first",
            });
        }

        // Calculate eligibility: 30 calendar days after passing the LL test.
        const EligibleFrom = new Date(ApplicationCheck.LLTestPassedAt);
        EligibleFrom.setHours(0, 0, 0, 0);
        EligibleFrom.setDate(EligibleFrom.getDate() + 30);

        // Parse the requested calendar date.
        const DateText = String(TestDate).slice(0, 10);
        const [year, month, day] = DateText.split("-").map(Number);
        const RequestedDate = new Date(year, month - 1, day);

        if (
            !year ||
            !month ||
            !day ||
            RequestedDate.getFullYear() !== year ||
            RequestedDate.getMonth() !== month - 1 ||
            RequestedDate.getDate() !== day
        ) {
            return res.status(400).json({
                message: "Please provide a valid test date",
            });
        }

        // Block Sundays.
        if (RequestedDate.getDay() === 0) {
            return res.status(400).json({
                message: "Driving tests cannot be scheduled on Sundays",
            });
        }

        // Must be 30 days after the LL theory test pass date.
        if (RequestedDate < EligibleFrom) {
            return res.status(400).json({
                message: `You can schedule the practical test from ${EligibleFrom.toLocaleDateString("en-IN")}`,
            });
        }

        // Do not allow dates in the past.
        const Today = new Date();
        Today.setHours(0, 0, 0, 0);

        if (RequestedDate < Today) {
            return res.status(400).json({
                message: "Test date must be today or a future date",
            });
        }

        const ExistingTest = await DrivingTestModel.findOne({
            Application,
            TestStatus: { $in: ["Scheduled", "Rescheduled"] },
        });

        if (ExistingTest) {
            return res.status(400).json({
                message: "A test is already scheduled for this application",
            });
        }

        // Ensure the application has not already completed the practical test.
        if (
            ["PASSED", "FAILED"].includes(ApplicationCheck.PracticalTestStatus)
        ) {
            return res.status(400).json({
                message: "This application already has a practical test result",
            });
        }

        const DrivingTest = new DrivingTestModel({
            User,
            Application,
            TestDate: RequestedDate,
            TestTime,
            TestRemarks,
        });

        await DrivingTest.save();

        ApplicationCheck.PracticalTestStatus = "SCHEDULED";
        ApplicationCheck.ApplicationStatus = "Test Scheduled";
        await ApplicationCheck.save();

        return res.status(201).json({
            message: "Driving test scheduled successfully",
            DrivingTest,
            EligibleFrom,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};


// 2. View All Driving Tests (Admin)
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

// 3. View Logged-in User's Driving Tests
const ViewMyDrivingTests = async (req, res) => {
    try {
        const UserId = req.id;

        const Tests = await DrivingTestModel.find({
            User: UserId
        })
            .populate("Application")
            .sort({ TestDate: -1 });

        return res.status(200).json({
            message: "Your driving tests fetched successfully",
            Tests
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};


// 4. View One Driving Test
const ViewDrivingTestById = async (req, res) => {
    try {
        const { id } = req.params;

        const Test = await DrivingTestModel.findById(id)
            .populate("User", "FullName Email Phone")
            .populate("Application");

        if (!Test) {
            return res.status(404).json({
                message: "Driving test not found"
            });
        }

        return res.status(200).json({
            message: "Driving test fetched successfully",
            Test
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};



const UpdateDrivingTest = async (req, res) => {
    try {
        const id = req.params.testId || req.params.id;
        const { TestStatus, TestRemarks, AdminRemarks } = req.body;


        const AllowedStatuses = [
            "Scheduled",
            "Passed",
            "Failed",
            "Absent",
            "Rescheduled",
            "Cancelled",
        ];

        if (!AllowedStatuses.includes(TestStatus)) {
            return res.status(400).json({
                message: "Please provide a valid test status",
            });
        }

        const Test = await DrivingTestModel.findById(id);

        if (!Test) {
            return res.status(404).json({
                message: "Driving test not found",
            });
        }

        const Application = await ApplicationModel.findById(
            Test.Application
        );

        if (!Application) {
            return res.status(404).json({
                message: "Related application not found",
            });
        }

        // Do not overwrite an already-final result.
        if (["Passed", "Failed"].includes(Test.TestStatus)) {
            return res.status(400).json({
                message: "This practical test already has a final result",
            });
        }

        Test.TestStatus = TestStatus;

        if (TestRemarks !== undefined) {
            Test.TestRemarks = TestRemarks;
        }

        if (AdminRemarks !== undefined) {
            Test.AdminRemarks = AdminRemarks;
        }

        if (["Passed", "Failed"].includes(TestStatus)) {
            Test.ResultUpdatedAt = new Date();

            // req.id should be supplied by your authentication middleware.
            if (req.id) {
                Test.ResultUpdatedBy = req.id;
            }

            if (TestStatus === "Passed") {
                Application.PracticalTestStatus = "PASSED";
                Application.ApplicationStatus = "Test Passed";
            }

            if (TestStatus === "Failed") {
                Application.PracticalTestStatus = "FAILED";
                Application.ApplicationStatus = "Test Failed";
            }

            if (AdminRemarks !== undefined) {
                Application.AdminRemarks = AdminRemarks;
            }
        }

        await Test.save();
        await Application.save();

        return res.status(200).json({
            message:
                TestStatus === "Passed"
                    ? "Congratulations! Practical test passed"
                    : TestStatus === "Failed"
                        ? "Practical test marked as failed"
                        : "Driving test updated successfully",
            Test,
            Application,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error",
        });
    }
};



// 6. Reschedule Driving Test
const RescheduleDrivingTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { TestDate, TestTime, TestRemarks } = req.body;

        if (!TestDate || !TestTime) {
            return res.status(400).json({
                message: "Test date and time are required"
            });
        }

        const DateText = String(TestDate).slice(0, 10);
        const [year, month, day] = DateText.split("-").map(Number);

        const NewTestDate = new Date(year, month - 1, day);
        NewTestDate.setHours(0, 0, 0, 0);

        if (
            !year ||
            !month ||
            !day ||
            NewTestDate.getFullYear() !== year ||
            NewTestDate.getMonth() !== month - 1 ||
            NewTestDate.getDate() !== day
        ) {
            return res.status(400).json({
                message: "Please provide a valid test date",
            });
        }

        const Today = new Date();
        Today.setHours(0, 0, 0, 0);

        if (NewTestDate < Today) {
            return res.status(400).json({
                message: "Test date must be today or a future date",
            });
        }

        if (NewTestDate.getDay() === 0) {
            return res.status(400).json({
                message: "Driving tests cannot be scheduled on Sundays",
            });
        }

        const Test = await DrivingTestModel.findById(id);

        if (!Test) {
            return res.status(404).json({
                message: "Driving test not found"
            });
        }
        const Application = await ApplicationModel.findById(
            Test.Application
        );

        if (!Application) {
            return res.status(404).json({
                message: "Related application not found"
            });
        }

        if (
            Application.LLTestStatus !== "PASSED" ||
            !Application.LLTestPassedAt
        ) {
            return res.status(400).json({
                message: "The Learner's Licence theory test must be passed first"
            });
        }

        const EligibleFrom = new Date(
            Application.LLTestPassedAt
        );

        EligibleFrom.setHours(0, 0, 0, 0);
        EligibleFrom.setDate(EligibleFrom.getDate() + 30);

        if (NewTestDate < EligibleFrom) {
            return res.status(400).json({
                message: `You can reschedule the practical test from ${EligibleFrom.toLocaleDateString("en-IN")}`
            });
        }

        if (["Passed", "Failed"].includes(Test.TestStatus)) {
            return res.status(400).json({
                message: "A completed test cannot be rescheduled"
            });
        }

        Test.TestDate = NewTestDate;
        Test.TestTime = TestTime;
        Test.TestStatus = "Scheduled";

        if (TestRemarks !== undefined) {
            Test.TestRemarks = TestRemarks;
        }

        await Test.save();

        Application.PracticalTestStatus = "SCHEDULED";
        Application.ApplicationStatus = "Test Scheduled";
        await Application.save();

        return res.status(200).json({
            message: "Driving test rescheduled successfully",
            Test,
            Application
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};


// 7. Delete Driving Test
const DeleteDrivingTest = async (req, res) => {
    try {
        const { id } = req.params;

        const Test = await DrivingTestModel.findByIdAndDelete(id);

        if (!Test) {
            return res.status(404).json({
                message: "Driving test not found"
            });
        }

        return res.status(200).json({
            message: "Driving test deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

const ViewReadyApplicants = async (req, res) => {
    try {
        const EligibleBefore = new Date();
        EligibleBefore.setHours(0, 0, 0, 0);
        EligibleBefore.setDate(EligibleBefore.getDate() - 30);

        const Applications = await ApplicationModel.find({
            ApplicationStatus: "Ready for Test",
            DocumentVerification: "Verified",
            LLTestStatus: "PASSED",
            LLTestPassedAt: { $lte: EligibleBefore },
            PracticalTestStatus: { $nin: ["PASSED", "FAILED"] },
        })
            .populate("User", "FullName Email Phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Eligible applicants fetched successfully",
            Applications,
        });
    } catch (error) {
        console.error("ViewReadyApplicants error:", error);
        return res.status(500).json({
            message: "Server error while fetching eligible applicants",
        });
    }
};

export {
    ScheduleDrivingTest, ViewReadyApplicants, ViewAllDrivingTests, ViewMyDrivingTests,
    ViewDrivingTestById, UpdateDrivingTest, RescheduleDrivingTest, DeleteDrivingTest,
};