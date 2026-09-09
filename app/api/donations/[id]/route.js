import { connectToDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import Donation from "@/models/Donations";
import { z } from "zod";

const updateSchema = z.object({
  foodName: z.string().trim().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(["Cooked Food", "Bakery", "Fruits", "Vegetables", "Packaged Food", "Other"]).optional(),
  quantity: z.coerce.number().positive().optional(),
  unit: z.enum(["kg", "liters", "packets", "boxes", "items"]).optional(),
  servings: z.coerce.number().int().positive().optional(),
  dietaryType: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan", "Mixed"]).optional(),
  preparedAt: z.string().optional(), pickupDeadline: z.string().optional(), addressLabel: z.string().trim().min(5).max(300).optional(),
});

export async function GET(_request, { params }) {
  await connectToDatabase();
  const { id } = await params;
  const donation = await Donation.findById(id).populate("providerId", "name").lean();
  if (!donation) return Response.json({ success: false, message: "Donation not found." }, { status: 404 });
  if (donation.status === "Available" && donation.pickupDeadline <= new Date()) {
    donation.status = "Expired";
    await Donation.findByIdAndUpdate(id, { status: "Expired" });
  }
  return Response.json({ success: true, donation: { ...donation, _id: donation._id.toString() } });
}

export async function PUT(request, { params }) {
  const session = await getSession();
  const { id } = await params;
  if (!session || session.role !== "provider") return Response.json({ message: "Provider access is required." }, { status: 403 });
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ message: "Invalid donation data.", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  await connectToDatabase();
  const donation = await Donation.findOne({ _id: id, providerId: session.userId });
  if (!donation) return Response.json({ message: "Donation not found." }, { status: 404 });
  if (donation.status !== "Available") return Response.json({ message: "Only available donations can be edited." }, { status: 409 });
  Object.assign(donation, parsed.data);
  await donation.save();
  return Response.json({ success: true, donation });
}

export async function DELETE(_request, { params }) {
  const session = await getSession(); const { id } = await params;
  if (!session || session.role !== "provider") return Response.json({ message: "Provider access is required." }, { status: 403 });
  await connectToDatabase();
  const donation = await Donation.findOne({ _id: id, providerId: session.userId, status: "Available" });
  if (!donation) return Response.json({ message: "Only available donations can be cancelled." }, { status: 409 });
  donation.status = "Cancelled"; await donation.save();
  return Response.json({ success: true });
}
