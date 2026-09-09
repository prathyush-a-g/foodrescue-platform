import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donations";

const demoDonations = [
  {
    id: 1,
    foodName: "Cooked Rice",
    description: "Freshly prepared rice available for community distribution.",
    servings: 50,
    category: "Cooked Food",
    dietaryType: "Vegetarian",
    pickupDeadline: "8:00 PM",
    location: "Local Community Center",
  },
  {
    id: 2,
    foodName: "Fresh Bakery Items",
    description: "Surplus bread and bakery items available for pickup.",
    servings: 30,
    category: "Bakery",
    dietaryType: "Vegetarian",
    pickupDeadline: "6:00 PM",
    location: "Main Market",
  },
  {
    id: 3,
    foodName: "Vegetable Meals",
    description: "Prepared vegetable meals from a local food provider.",
    servings: 40,
    category: "Cooked Food",
    dietaryType: "Vegetarian",
    pickupDeadline: "7:30 PM",
    location: "Community Hall",
  },
];

export default async function DonationsPage({ searchParams }) {
  const filters = await searchParams;
  await connectToDatabase();
  await Donation.updateMany(
    { status: "Available", pickupDeadline: { $lte: new Date() } },
    { $set: { status: "Expired" } }
  );
  const query = { status: "Available", pickupDeadline: { $gt: new Date() } };
  if (filters.dietaryType) query.dietaryType = filters.dietaryType;
  if (filters.minServings) query.servings = { $gte: Number(filters.minServings) };
  if (filters.category) query.category = filters.category;
  const donations = await Donation.find(query)
    .select("foodName description servings category dietaryType pickupDeadline addressLabel")
    .sort({ createdAt: -1 })
    .lean();
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Page Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
            Food donations
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-900 md:text-5xl">
            Find available food
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Browse surplus food shared by providers and find donations that
            can help your community.
          </p>
        </div>
      </section>

      {/* Donations */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">

          <form className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
            <select name="dietaryType" defaultValue={filters.dietaryType || ""} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800"><option value="">All food types</option><option>Vegetarian</option><option>Vegan</option><option>Non-Vegetarian</option><option>Mixed</option></select>
            <select name="category" defaultValue={filters.category || ""} className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800"><option value="">All categories</option><option>Cooked Food</option><option>Bakery</option><option>Fruits</option><option>Vegetables</option><option>Packaged Food</option><option>Other</option></select>
            <input name="minServings" type="number" min="1" defaultValue={filters.minServings || ""} placeholder="Minimum servings" className="rounded-lg border border-slate-300 px-3 py-2 text-slate-800" />
            <button className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800">Apply filters</button>
          </form>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Available donations
              </h2>

              <p className="mt-1 text-slate-500">
                {donations.length} donations available
              </p>
            </div>
          </div>

          {/* Donation Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {donations.map((donation) => (
              <div
                key={donation._id.toString()}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                {/* Image Placeholder */}
                <div className="flex h-48 items-center justify-center bg-green-100">
                  <span className="text-5xl">🍲</span>
                </div>

                <div className="p-6">

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {donation.foodName}
                    </h3>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Available
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {donation.description}
                  </p>

                  {/* Details */}
                  <div className="mt-5 space-y-3 text-sm">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Servings
                      </span>

                      <span className="font-semibold text-slate-900">
                        {donation.servings}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Category
                      </span>

                      <span className="font-semibold text-slate-900">
                        {donation.category}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Food type
                      </span>

                      <span className="font-semibold text-slate-900">
                        {donation.dietaryType}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Pickup by
                      </span>

                      <span className="font-semibold text-slate-900">
                        {new Date(donation.pickupDeadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Pickup location
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      📍 {donation.addressLabel}
                    </p>
                  </div>

                  {/* Button */}
                  <Link
                    href={`/donations/${donation._id.toString()}`}
                    className="mt-5 block rounded-xl bg-green-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-green-800"
                  >
                    View Donation
                  </Link>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>
    </main>
  );
}
