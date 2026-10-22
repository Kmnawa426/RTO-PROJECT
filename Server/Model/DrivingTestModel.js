import mongoose from "mongoose";

const DrivingTestSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    // Practical driving test appointment
    TestDate: {
      type: Date,
      required: true,
    },

    TestTime: {
      type: String,
      required: true,
    },

    TestStatus: {
      type: String,
      enum: [
        "Scheduled",
        "Passed",
        "Failed",
        "Absent",
        "Rescheduled",
        "Cancelled",
      ],
      default: "Scheduled",
    },

    TestRemarks: {
      type: String,
      default: "",
    },

    AdminRemarks: {
      type: String,
      default: "",
    },

    ResultUpdatedAt: {
      type: Date,
      default: null,
    },

    ResultUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DrivingTestModel = mongoose.model(
  "DrivingTest",
  DrivingTestSchema
);

export default DrivingTestModel;
