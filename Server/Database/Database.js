import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv()
const Mongo_Url =process.env.MONGO_URL

const dbconnection = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(Mongo_Url);

    console.log("Database Connected Successfully!");
  } catch (error) {
    console.log("MongoDB Connection Error:");
    console.log(error);
  }
};

export default dbconnection;