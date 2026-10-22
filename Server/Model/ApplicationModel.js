
import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    ApplicationType: { type: String, enum: ["Learner Licence", "Driving Licence"], required: true, },
    VehicleType: {
      type: String, enum: ["Two Wheeler With Gear", "Two Wheeler Without Gear", "Four Wheeler",],
      required: true,
    },
    DateOfApplication: { type: Date, default: Date.now, },
    DateOfBirth: { type: Date, required: true, },
    Address: { type: String, required: true, },
    DocumentName: {
      type: String, enum: ["Adhaar Card", "Voter ID", "Address Proof", "Passport", "Pan Card",],
      required: true,
    },
    DocumentImage: { type: String, },
    DocumentVerification: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending", },
    ApplicationStatus: {
      type: String, enum: ["Submitted", "Under Verification", "Documents Rejected", "Approved", "Training", "Ready for Test", "Test Scheduled", "Test Passed", "Test Failed",
        "Completed",], default: "Submitted",
    },
    DrivingSchool: { type: mongoose.Schema.Types.ObjectId, ref: "DrivingSchool", },
    AdminRemarks: { type: String, default: "", },
    // LL theory-test authorisation
    LLTestAuthorized: {
      type: Boolean, default: false,
    },
    // LL theory-test lifecycle
    LLTestStatus: {
      type: String,
      enum: [
        "LOCKED", "AVAILABLE", "IN_PROGRESS", "PASSED", "FAILED",],
      default: "LOCKED",
    },
    LLTestPassedAt: { type: Date, default: null, },
    // Practical driving-test eligibility
    PracticalTestEligibleFrom: {
      type: Date,
      default: null,
    },

    PracticalTestStatus: {
      type: String,
      enum: [
        "NOT_ELIGIBLE",
        "WAITING_PERIOD",
        "ELIGIBLE",
        "SCHEDULED",
        "PASSED",
        "FAILED"
      ],
      default: "NOT_ELIGIBLE"
    },

    // Final approval / document issuance
    LicenceIssuedAt: {
      type: Date,
      default: null,
    },

    LicencePdfUrl: {
      type: String,
      default: null,
    },
    LicenceNumber: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ApplicationModel = mongoose.model(
  "Application",
  ApplicationSchema
);

export default ApplicationModel;
