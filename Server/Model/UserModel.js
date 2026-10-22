import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    FullName: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Phone: { type: String, required: true, },
    Password: { type: String, required: true, },
    Address: { type: String, required: true, },
    DateOfBirth: { type: Date, required: true, },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
