import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donations";
import { getSession } from "@/lib/session";
import { z } from "zod";

const donationSchema = z.object({
  foodName: z.string().trim().min(2).max(100),

  description: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),

  category: z.enum([
    "Cooked Food",
    "Bakery",
    "Fruits",
    "Vegetables",
    "Packaged Food",
    "Other",
  ]),

  quantity: z.coerce.number().positive(),

  unit: z.enum([
    "kg",
    "liters",
    "packets",
    "boxes",
    "items",
  ]),

  servings: z.coerce.number().int().positive(),

  dietaryType: z.enum([
    "Vegetarian",
    "Non-Vegetarian",
    "Vegan",
    "Mixed",
  ]),

  preparedAt: z.string().min(1),

  pickupDeadline: z.string().min(1),

  addressLabel: z.string().trim().min(5).max(300),
});


// ==========================================
// POST - Create Donation
// ==========================================

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (session.role !== "provider") {
      return Response.json(
        {
          success: false,
          message: "Only food providers can create donations.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const result = donationSchema.safeParse(body);

    if (!result.success) {
      console.log("Validation errors:", result.error.flatten());

      return Response.json(
        {
          success: false,
          message: "Please enter valid donation details.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    const preparedAt = new Date(data.preparedAt);
    const pickupDeadline = new Date(data.pickupDeadline);

    if (
      Number.isNaN(preparedAt.getTime()) ||
      Number.isNaN(pickupDeadline.getTime())
    ) {
      return Response.json(
        {
          success: false,
          message: "Please enter valid dates.",
        },
        { status: 400 }
      );
    }

    if (pickupDeadline <= preparedAt) {
      return Response.json(
        {
          success: false,
          message: "Pickup deadline must be after preparation time.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const donation = await Donation.create({
      providerId: session.userId,
      foodName: data.foodName,
      description: data.description || "",
      category: data.category,
      quantity: data.quantity,
      unit: data.unit,
      servings: data.servings,
      dietaryType: data.dietaryType,
      preparedAt,
      pickupDeadline,
      addressLabel: data.addressLabel,
      status: "Available",
    });

    return Response.json(
      {
        success: true,
        message: "Food donation posted successfully.",
        donation: {
          id: donation._id,
          foodName: donation.foodName,
          servings: donation.servings,
          status: donation.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create donation error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while creating the donation.",
      },
      { status: 500 }
    );
  }
}


// ==========================================
// GET - Get Provider Donations
// ==========================================

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get("mine") === "true";
    const query = { status: "Available", pickupDeadline: { $gt: new Date() } };

    if (mine) {
      const session = await getSession();
      if (!session || session.role !== "provider") {
        return Response.json({ success: false, message: "Provider access is required." }, { status: 403 });
      }
      query.providerId = session.userId;
      delete query.status;
      delete query.pickupDeadline;
    } else {
      const category = searchParams.get("category");
      const dietaryType = searchParams.get("dietaryType");
      const search = searchParams.get("search")?.trim();
      if (category) query.category = category;
      if (dietaryType) query.dietaryType = dietaryType;
      if (search) query.$or = [{ foodName: { $regex: search, $options: "i" } }, { category: { $regex: search, $options: "i" } }];
    }

    await Donation.updateMany({ status: "Available", pickupDeadline: { $lte: new Date() } }, { $set: { status: "Expired" } });
    const donations = await Donation.find(query)
      .select("foodName description category quantity unit servings dietaryType pickupDeadline addressLabel imageUrl status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      donations: donations.map((donation) => ({ ...donation, _id: donation._id.toString() })),
    });
  } catch (error) {
    console.error("Get donations error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while fetching donations.",
      },
      { status: 500 }
    );
  }
}
