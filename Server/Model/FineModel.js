
import mongoose from "mongoose";

const FineSchema = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    VehicleNumber: { type: String, required: true, uppercase: true },
    FineReason: { type: String, required: true, },
    FineAmount: { type: Number, required: true, min: 100, },
    FineDate: { type: Date, default: Date.now, },
    Location: { type: String, default: "", },
    FineStatus: { type: String, enum: ["Pending", "Paid", "Cancelled"], default: "Pending", },
    PaymentMethod: { type: String, enum: ["UPI", "Card", "Net Banking", "Cash", null], default: null, },
    PaymentDate: { type: Date, default: null, },
    TransactionId: { type: String, default: null, },
    Note: { type: String, default: "", },
  },
  { timestamps: true }
);

const FineModel = mongoose.model("Fine", FineSchema);

export default FineModel;
