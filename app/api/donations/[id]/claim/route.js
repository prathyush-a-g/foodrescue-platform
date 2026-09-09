import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import Donation from "@/models/Donations";
import PickupTask from "@/models/PickupTask";
import Notification from "@/models/Notification";

export async function POST(_request, { params }) {
  const session = await getSession(); const { id } = await params;
  if (!session || session.role !== "receiver") return Response.json({ message: "Only receiver accounts can claim donations." }, { status: 403 });
  await connectToDatabase();
  const donation = await Donation.findOneAndUpdate({ _id: id, status: "Available", pickupDeadline: { $gt: new Date() } }, { $set: { status: "Claimed", claimedBy: session.userId, claimedAt: new Date() } }, { new: true });
  if (!donation) return Response.json({ message: "This donation is no longer available." }, { status: 409 });
  await PickupTask.create({ donationId: donation._id, receiverId: session.userId });
  await Notification.create({ userId: donation.providerId, title: "Donation claimed", message: `${donation.foodName} has been claimed by a receiver.`, type: "claim", relatedDonationId: donation._id });
  return Response.json({ success: true, message: "Donation claimed. A pickup task is now available to volunteers." });
}
