import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donations";
import Navbar from "@/components/layout/Navbar";

export default async function ProviderDonationsPage() {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "provider") {
    redirect("/");
  }

  await connectToDatabase();

  const donations = await Donation.find({ providerId: user.userId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <Navbar />
      <div className="container-page">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-green-600">Provider Donations</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Your food donations</h1>
          </div>
          <Link
            href="/provider/donations/new"
            className="w-fit rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            + Donate Food
          </Link>
        </div>

        {donations.length === 0 ? (
          <div className="surface-card p-8 text-center">
            <h2 className="font-semibold text-slate-900">No donations yet</h2>
            <p className="mt-2 text-slate-600">Post your first food donation to help your community.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <article key={donation._id.toString()} className="surface-card p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{donation.foodName}</h2>
                    <p className="mt-1 text-slate-600">
                      {donation.servings} servings · {donation.quantity} {donation.unit} · {donation.category}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {donation.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  Pickup deadline: {new Date(donation.pickupDeadline).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
