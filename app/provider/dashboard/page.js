
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donations";
import Navbar from "@/components/layout/Navbar";

export default async function ProviderDashboard() {
  const user = await getSession();

  // Not logged in
  if (!user) {
    redirect("/login");
  }

  // Logged in, but not a provider
  if (user.role !== "provider") {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-slate-900">
            Access Denied
          </h1>

          <p className="mt-3 text-slate-600">
            You do not have permission to access the provider dashboard.
          </p>
        </div>
      </main>
    );
  }

  // Connect to MongoDB
  await connectToDatabase();

  // Get this provider's donations
  const donations = await Donation.find({
    providerId: user.userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  // Calculate dashboard statistics
  const totalDonations = donations.length;

  const availableDonations = donations.filter(
    (donation) => donation.status === "Available"
  ).length;

  const completedDonations = donations.filter(
    (donation) => donation.status === "Completed"
  ).length;

  // Show latest 5 donations
  const recentDonations = donations.slice(0, 5);

  function formatDate(date) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function getStatusClass(status) {
    if (status === "Available") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Claimed") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "Completed") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Cancelled" || status === "Expired") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <Navbar />
      <div className="container-page">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-green-600">
              Provider Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Welcome back!
            </h1>

            <p className="mt-2 text-slate-600">
              {user.email}
            </p>
          </div>

          <Link
            href="/provider/donations/new"
            className="w-fit rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            + Donate Food
          </Link>

        </div>


        {/* Dashboard Cards */}
        <div className="grid gap-6 sm:grid-cols-3">

          {/* Total Donations */}
          <div className="surface-card p-6">
            <p className="text-sm text-slate-500">
              Total Donations
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalDonations}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Food donations posted
            </p>
          </div>


          {/* Available */}
          <div className="surface-card p-6">
            <p className="text-sm text-slate-500">
              Available
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {availableDonations}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Waiting to be claimed
            </p>
          </div>


          {/* Completed */}
          <div className="surface-card p-6">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {completedDonations}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Successfully delivered
            </p>
          </div>

        </div>


        {/* Recent Donations */}
        <div className="surface-card mt-8 p-8">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Food Donations
              </h2>

              <p className="mt-1 text-slate-600">
                Your most recent food donations.
              </p>
            </div>

            <Link
              href="/provider/donations"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              View All
            </Link>

          </div>


          {/* No donations */}
          {recentDonations.length === 0 ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">

              <h3 className="font-semibold text-slate-900">
                No donations yet
              </h3>

              <p className="mt-2 text-slate-600">
                You haven&apos;t posted any food donations yet.
              </p>

              <Link
                href="/provider/donations/new"
                className="mt-5 inline-block rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
              >
                Post Food Donation
              </Link>

            </div>
          ) : (

            <div className="mt-6 space-y-4">

              {recentDonations.map((donation) => (
                <div
                  key={donation._id.toString()}
                  className="rounded-xl border border-slate-200 p-5"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-bold text-slate-900">
                          {donation.foodName}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            donation.status
                          )}`}
                        >
                          {donation.status}
                        </span>

                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">

                        <span>
                          {donation.servings} servings
                        </span>

                        <span>
                          {donation.quantity} {donation.unit}
                        </span>

                        <span>
                          {donation.category}
                        </span>

                      </div>

                    </div>


                    <div className="text-sm text-slate-500">

                      <p>
                        Pickup deadline
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatDate(donation.pickupDeadline)}
                      </p>

                    </div>

                  </div>

                </div>
              ))}

            </div>

          )}

        </div>

      </div>
    </main>
  );
}
