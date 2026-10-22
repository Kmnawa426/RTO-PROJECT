
import mongoose from "mongoose";

const LLTestSchema = new mongoose.Schema(
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

    Questions: [
      {
        Question: {
          type: String,
          required: true,
        },

        Options: {
          type: [String],
          required: true,
        },

        CorrectAnswer: {
          type: String,
          required: true,
        },

        SelectedAnswer: {
          type: String,
          default: null,
        },

        IsCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],

    TotalQuestions: {
      type: Number,
      required: true,
    },

    CorrectAnswers: {
      type: Number,
      default: 0,
    },

    ScorePercentage: {
      type: Number,
      default: 0,
    },

    PassingPercentage: {
      type: Number,
      default: 60,
    },

    TestStatus: {
      type: String,
      enum: ["IN_PROGRESS", "PASSED", "FAILED"],
      default: "IN_PROGRESS",
    },

    StartedAt: {
      type: Date,
      default: Date.now,
    },

    SubmittedAt: {
      type: Date,
      default: null,
    },

    PassedAt: {
      type: Date,
      default: null,
    },

    TimeLimitMinutes: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

const LLTestModel = mongoose.model("LLTest", LLTestSchema);

export default LLTestModel;
