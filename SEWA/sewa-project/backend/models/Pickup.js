import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
  {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "Ngo", required: true },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Pickup", pickupSchema);
