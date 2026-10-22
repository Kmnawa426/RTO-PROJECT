import mongoose from "mongoose";

const DrivingSchoolSchema = new mongoose.Schema(
  {
    SchoolName: { type: String, required: true},
    Email: { type: String, required: true, unique: true },
    ContactPerson:{type:String,required:true},
    Phone: { type: String, required: true, },
    Password: { type: String, required: true, },
    Address: { type: String, required: true, },
    City: { type: String, required: true, },
    Permission: { type: Boolean, default: false, },
    SchoolImage:{type:'String'}
  },
  { timestamps: true }
);

const DrivingSchoolModel = mongoose.model(
  "DrivingSchool",
  DrivingSchoolSchema
);

export default DrivingSchoolModel;
