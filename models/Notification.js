import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 300 },
    type: { type: String, default: "info" },
    relatedDonationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation", default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
