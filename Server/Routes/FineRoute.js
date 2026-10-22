import express from "express";
import { AddFine, PayFine } from "../Controller/FineController.js";

const router = express.Router();

router.post("/AddFine", AddFine);
router.put("/PayFine", PayFine);

export default router;
