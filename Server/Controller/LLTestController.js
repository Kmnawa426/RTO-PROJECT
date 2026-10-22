
import LLTestModel from "../Model/LLTestModel.js";
import ApplicationModel from "../Model/ApplicationModel.js";

// Sample LL theory questions.
// Correct answers are stored only on the server.
const QuestionBank = [
  {
    Question: "What should you do when the traffic signal turns red?",
    Options: ["Speed up", "Stop before the stop line", "Sound the horn", "Turn immediately"],
    CorrectAnswer: "Stop before the stop line",
  },
  {
    Question: "Which side of the road should you normally drive on in India?",
    Options: ["Left", "Right", "Middle", "Either side"],
    CorrectAnswer: "Left",
  },
  {
    Question: "What should you do when an ambulance approaches with its siren on?",
    Options: ["Race ahead", "Block its path", "Give way safely", "Ignore it"],
    CorrectAnswer: "Give way safely",
  },
  {
    Question: "What does a red traffic light mean?",
    Options: ["Go", "Stop", "Increase speed", "Overtake"],
    CorrectAnswer: "Stop",
  },
  {
    Question: "When should you wear a helmet on a two-wheeler?",
    Options: ["Only on highways", "Only at night", "Whenever riding, as required by law", "Only during rain"],
    CorrectAnswer: "Whenever riding, as required by law",
  },
  {
    Question: "What should you do before changing lanes?",
    Options: ["Signal and check mirrors and blind spots", "Turn suddenly", "Only sound the horn", "Brake sharply"],
    CorrectAnswer: "Signal and check mirrors and blind spots",
  },
  {
    Question: "What does a STOP sign require you to do?",
    Options: ["Slow down slightly", "Stop completely and proceed when safe", "Continue if the road looks empty", "Sound the horn"],
    CorrectAnswer: "Stop completely and proceed when safe",
  },
  {
    Question: "Is it safe to use a handheld mobile phone while driving?",
    Options: ["Yes, at low speed", "Yes, in traffic", "No", "Only at junctions"],
    CorrectAnswer: "No",
  },
  {
    Question: "What should you do when approaching a pedestrian crossing with people crossing?",
    Options: ["Speed up", "Stop or slow down and give way", "Overtake other vehicles", "Sound the horn continuously"],
    CorrectAnswer: "Stop or slow down and give way",
  },
  {
    Question: "What is the safest action when approaching a sharp bend?",
    Options: ["Accelerate", "Overtake", "Reduce speed and stay in your lane", "Drive in the middle of the road"],
    CorrectAnswer: "Reduce speed and stay in your lane",
  },
  {
    Question: "What should you do at an unguarded railway crossing?",
    Options: ["Cross quickly without checking", "Stop, check carefully, and cross only when safe", "Follow the vehicle ahead without looking", "Park on the tracks"],
    CorrectAnswer: "Stop, check carefully, and cross only when safe",
  },
  {
    Question: "When is overtaking unsafe?",
    Options: ["When visibility is clear and permitted", "When the road markings permit it", "When approaching a blind bend", "When there is sufficient safe space"],
    CorrectAnswer: "When approaching a blind bend",
  },
];

// Hide correct answers and internal scoring fields from the user.
const formatQuestionsForUser = (questions) =>
  questions.map((question) => ({
    _id: question._id,
    Question: question.Question,
    Options: question.Options,
  }));

// 1. Start the learner's licence theory test.
export const StartLLTest = async (req, res) => {
  try {
    const UserId = req.id;
    const { ApplicationId } = req.body;

    if (!UserId) {
      return res.status(401).json({ message: "Please log in first" });
    }

    if (!ApplicationId) {
      return res.status(400).json({ message: "ApplicationId is required" });
    }

    const Application = await ApplicationModel.findOne({
      _id: ApplicationId,
      User: UserId,
    });

    if (!Application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (Application.ApplicationType !== "Learner Licence") {
      return res.status(400).json({
        message: "This application is not for a Learner Licence",
      });
    }

    if (
      Application.DocumentVerification !== "Verified" ||
      Application.ApplicationStatus !== "Approved" ||
      Application.LLTestAuthorized !== true ||
      Application.LLTestStatus !== "AVAILABLE"
    ) {
      return res.status(403).json({
        message: "Your documents must be verified and the theory test authorized by the admin",
      });
    }

    // Do not allow a second attempt for the same application.
    // A failed test requires a new application under this project's workflow.
    const ExistingTest = await LLTestModel.findOne({
      Application: Application._id,
    });

    if (ExistingTest) {
      if (ExistingTest.TestStatus === "IN_PROGRESS") {
        return res.status(200).json({
          message: "You already have a test in progress",
          TestId: ExistingTest._id,
          Questions: formatQuestionsForUser(ExistingTest.Questions),
          TimeLimitMinutes: ExistingTest.TimeLimitMinutes,
          StartedAt: ExistingTest.StartedAt,
        });
      }

      return res.status(400).json({
        message: "A test attempt already exists for this application",
        TestStatus: ExistingTest.TestStatus,
      });
    }

    // Pick 10 random questions from the server-side question bank.
    const SelectedQuestions = [...QuestionBank]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    const Test = await LLTestModel.create({
      User: UserId,
      Application: Application._id,
      Questions: SelectedQuestions,
      TotalQuestions: SelectedQuestions.length,
      PassingPercentage: 60,
      TestStatus: "IN_PROGRESS",
      StartedAt: new Date(),
      TimeLimitMinutes: 15,
    });

    return res.status(201).json({
      message: "Learner's Licence theory test started",
      TestId: Test._id,
      Questions: formatQuestionsForUser(Test.Questions),
      TimeLimitMinutes: Test.TimeLimitMinutes,
      StartedAt: Test.StartedAt,
    });
  } catch (error) {
    console.error("StartLLTest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 2. Submit answers and evaluate the test on the server.
export const SubmitLLTest = async (req, res) => {
  try {
    const UserId = req.id;
    const { answers } = req.body;
    const { id: TestId } = req.params;

    if (!UserId) {
      return res.status(401).json({ message: "Please log in first" });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        message: "Answers must be an array",
      });
    }

    const Test = await LLTestModel.findOne({
      _id: TestId,
      User: UserId,
    });

    if (!Test) {
      return res.status(404).json({ message: "Test not found" });
    }

    if (Test.TestStatus !== "IN_PROGRESS") {
      return res.status(400).json({
        message: "This test has already been submitted",
      });
    }

    const Application = await ApplicationModel.findOne({
      _id: Test.Application,
      User: UserId,
    });

    if (!Application) {
      return res.status(404).json({
        message: "Related application not found",
      });
    }

    const TimeLimitMs = Test.TimeLimitMinutes * 60 * 1000;
    const ElapsedMs = Date.now() - new Date(Test.StartedAt).getTime();

    // A timed-out test is marked failed.
    if (ElapsedMs > TimeLimitMs) {
      Test.TestStatus = "FAILED";
      Test.CorrectAnswers = 0;
      Test.ScorePercentage = 0;
      Test.SubmittedAt = new Date();

      Test.Questions.forEach((question) => {
        question.SelectedAnswer = null;
        question.IsCorrect = false;
      });

      Application.LLTestStatus = "FAILED";
      Application.LLTestAuthorized = false;
      Application.PracticalTestStatus = "NOT_ELIGIBLE";

      await Test.save();
      await Application.save();

      return res.status(400).json({
        message: "Time limit exceeded. Your test has been marked as failed.",
        TestStatus: Test.TestStatus,
        ScorePercentage: 0,
      });
    }

    // Reject unknown or duplicate question IDs.
    const ValidQuestionIds = Test.Questions.map((q) => q._id.toString());
    const SubmittedIds = answers.map((answer) =>
      String(answer.questionId ?? "")
    );

    if (
      SubmittedIds.length !== Test.TotalQuestions ||
      new Set(SubmittedIds).size !== SubmittedIds.length ||
      SubmittedIds.some((id) => !ValidQuestionIds.includes(id))
    ) {
      return res.status(400).json({
        message: "Submit exactly one answer for every question",
      });
    }

    let CorrectCount = 0;

    Test.Questions.forEach((question) => {
      const Answer = answers.find(
        (item) => String(item.questionId) === question._id.toString()
      );

      const SelectedAnswer = Answer?.selectedAnswer;

      // Only accept an option that actually belongs to this question.
      const IsValidOption = question.Options.includes(SelectedAnswer);

      question.SelectedAnswer = IsValidOption ? SelectedAnswer : null;
      question.IsCorrect =
        IsValidOption && SelectedAnswer === question.CorrectAnswer;

      if (question.IsCorrect) {
        CorrectCount += 1;
      }
    });

    const ScorePercentage = Math.round(
      (CorrectCount / Test.TotalQuestions) * 100
    );

    const Passed = ScorePercentage >= Test.PassingPercentage;
    const Now = new Date();

    Test.CorrectAnswers = CorrectCount;
    Test.ScorePercentage = ScorePercentage;
    Test.TestStatus = Passed ? "PASSED" : "FAILED";
    Test.SubmittedAt = Now;
    Test.PassedAt = Passed ? Now : null;

    if (Passed) {
      // The 30-day period starts from the theory test pass date.
      const EligibleFrom = new Date(Now);
      EligibleFrom.setDate(EligibleFrom.getDate() + 30);

      Application.LLTestStatus = "PASSED";
      Application.LLTestPassedAt = Now;
      Application.PracticalTestEligibleFrom = EligibleFrom;
      Application.PracticalTestStatus = "WAITING_PERIOD";
      Application.LLTestAuthorized = false;
      Application.ApplicationStatus = "Approved";
    } else {
      Application.LLTestStatus = "FAILED";
      Application.LLTestAuthorized = false;
      Application.PracticalTestStatus = "NOT_ELIGIBLE";
    }

    await Test.save();
    await Application.save();

    return res.status(200).json({
      message: Passed
        ? "Congratulations! You passed the theory test."
        : "You did not pass the theory test. Please follow the reapplication process.",
      Result: {
        TestStatus: Test.TestStatus,
        TotalQuestions: Test.TotalQuestions,
        CorrectAnswers: CorrectCount,
        ScorePercentage,
        PassingPercentage: Test.PassingPercentage,
        Passed,
        SubmittedAt: Test.SubmittedAt,
      },
      PracticalTestEligibleFrom: Passed
        ? Application.PracticalTestEligibleFrom
        : null,
    });
  } catch (error) {
    console.error("SubmitLLTest error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 3. View the logged-in user's test result.
export const ViewMyLLTestResult = async (req, res) => {
  try {
    const UserId = req.id;
    const { ApplicationId } = req.params;

    if (!UserId) {
      return res.status(401).json({
        message: "Please log in first",
      });
    }

    if (!ApplicationId) {
      return res.status(400).json({
        message: "ApplicationId is required",
      });
    }

    const Test = await LLTestModel.findOne({
      User: UserId,
      Application: ApplicationId,
      TestStatus: { $in: ["PASSED", "FAILED"] },
    })
      .sort({ SubmittedAt: -1 })
      .select("-Questions.CorrectAnswer -Questions.SelectedAnswer");

    if (!Test) {
      return res.status(404).json({
        message: "No completed theory test found for this application",
      });
    }

    return res.status(200).json({
      message: "Theory test result fetched successfully",
      Result: Test,
    });
  } catch (error) {
    console.error("ViewMyLLTestResult error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ApplicationId",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};
