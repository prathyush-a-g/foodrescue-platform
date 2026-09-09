import mongoose from "mongoose";

const pickupTaskSchema = new mongoose.Schema(
  {
    donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", required: true, unique: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: { type: String, enum: ["Available", "Accepted", "Picked Up", "Delivered", "Completed"], default: "Available" },
    acceptedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

pickupTaskSchema.index({ status: 1, createdAt: -1 });
export default mongoose.models.PickupTask || mongoose.model("PickupTask", pickupTaskSchema);
