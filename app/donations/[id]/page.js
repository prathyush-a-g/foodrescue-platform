import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donations";

const demoDonations = {
  1: {
    foodName: "Cooked Rice",
    description:
      "Freshly prepared rice available for community distribution.",
    servings: 50,
    category: "Cooked Food",
    dietaryType: "Vegetarian",
    pickupDeadline: "8:00 PM",
    location: "Local Community Center",
  },

  2: {
    foodName: "Fresh Bakery Items",
    description:
      "Surplus bread and bakery items available for pickup.",
    servings: 30,
    category: "Bakery",
    dietaryType: "Vegetarian",
    pickupDeadline: "6:00 PM",
    location: "Main Market",
  },

  3: {
    foodName: "Vegetable Meals",
    description:
      "Prepared vegetable meals from a local food provider.",
    servings: 40,
    category: "Cooked Food",
    dietaryType: "Vegetarian",
    pickupDeadline: "7:30 PM",
    location: "Community Hall",
  },
};

export default async function DonationDetailsPage({ params }) {
  const { id } = await params;

  await connectToDatabase();
  const donation = await Donation.findById(id).lean();

  if (!donation) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Donation not found
          </h1>

          <p className="mt-3 text-slate-600">
            The donation you are looking for does not exist.
          </p>

          <Link
            href="/donations"
            className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            Back to Donations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="py-12">
        <div className="mx-auto max-w-5xl px-6">

          {/* Back button */}
          <Link
            href="/donations"
            className="text-sm font-semibold text-green-700 hover:text-green-800"
          >
            ← Back to donations
          </Link>

          {/* Donation card */}
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Image */}
            <div className="flex h-72 items-center justify-center bg-green-100">
              <span className="text-7xl">🍲</span>
            </div>

            <div className="p-8">

              {/* Title */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                    Food donation
                  </p>

                  <h1 className="mt-2 text-4xl font-bold text-slate-900">
                    {donation.foodName}
                  </h1>
                </div>

                <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  {donation.status}
                </span>

              </div>

              {/* Description */}
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                {donation.description}
              </p>

              {/* Details */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Servings
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {donation.servings}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Category
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {donation.category}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Food type
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {donation.dietaryType}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">
                    Pickup deadline
                  </p>

                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {new Date(donation.pickupDeadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

              </div>

              {/* Location */}
              <div className="mt-6 rounded-2xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">
                  Pickup location
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  📍 {donation.addressLabel}
                </p>
              </div>

              {/* Claim button */}
              <button
                className="mt-8 w-full rounded-xl bg-green-700 px-6 py-4 font-semibold text-white transition hover:bg-green-800"
              >
                Claim This Donation
              </button>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
