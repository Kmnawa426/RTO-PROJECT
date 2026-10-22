import mongoose from "mongoose";

const TrainingSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,
    },
    Application: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true, },
    DrivingSchool: { type: mongoose.Schema.Types.ObjectId, ref: "DrivingSchool", required: true, },

    TrainingStartDate: { type: Date, },
    TrainingEndDate: { type: Date, },
    TrainingSchedule: [
      {
        Date: { type: Date, required: true, },
        StartTime: { type: String, required: true, },
        EndTime: { type: String, required: true, },
        Topic: { type: String, default: "", },
        Status: {
          type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled",
        },
      },
    ],

    ProgressPercentage: { type: Number, min: 0, max: 100, default: 0, },

    TrainingStatus: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "Ready for Test",],
      default: "Not Started",
    },
    ReadyForTest: { type: Boolean, default: false, },

    Remarks: { type: String, default: "", },
  },
  { timestamps: true }
);

const TrainingModel = mongoose.model(
  "Training",
  TrainingSchema
);

export default TrainingModel;
