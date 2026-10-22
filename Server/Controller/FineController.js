import FineModel from "../Model/FineModel.js";

const AddFine = async (req, res) => {
    try {
        const { User, VehicleNumber, FineReason, FineAmount, FineDate, Location, Note } = req.body;

        if (
            !User || !VehicleNumber || !FineReason || FineAmount == null || Number(FineAmount) <= 0 || !FineDate || !Location
        ) {
            return res.status(400).json({
                message: "Please provide all required fine details"
            });
        }

        const fine = new FineModel({
            User, VehicleNumber, FineReason, FineAmount: Number(FineAmount), FineDate, Location, FineStatus: "Pending",
            Note
        });

        await fine.save();

        return res.status(201).json({
            message: "Fine applied successfully",
            Fine: fine
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};


const PayFine = async (req, res) => {
    try {
        const {
            VehicleNumber, FineAmount, PaymentMethod, PaymentDate, TransactionId, Fid
        } = req.body;

        if (
            !VehicleNumber || FineAmount == null || !PaymentMethod || !Fid
        ) {
            return res.status(400).json({
                message: "Please provide all payment details"
            });
        }

        const fine = await FineModel.findById(Fid);

        if (!fine) {
            return res.status(404).json({
                message: "Fine not found"
            });
        }

        if (fine.VehicleNumber !== VehicleNumber) {
            return res.status(400).json({
                message: "Vehicle number mismatch"
            });
        }

        if (Number(FineAmount) !== Number(fine.FineAmount)) {
            return res.status(400).json({
                message: "Fine amount does not match"
            });
        }

        if (fine.FineStatus === "Paid") {
            return res.status(400).json({
                message: "This fine has already been paid"
            });
        }

        fine.FineStatus = "Paid";
        fine.PaymentMethod = PaymentMethod;
        fine.PaymentDate = PaymentDate || new Date();
        fine.TransactionId = TransactionId;

        await fine.save();

        return res.status(200).json({
            message: "Fine paid successfully",
            Fine: fine
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

export { AddFine, PayFine };