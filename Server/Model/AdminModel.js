import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
    Email: { type: String, required: true },
    Password: { type: String, required: true }
})
export default mongoose.model("Admin", AdminSchema)