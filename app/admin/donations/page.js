import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { getSession } from "@/lib/session";
import { connectToDatabase } from "@/lib/mongodb";
import Donation from "@/models/Donations";

export default async function AdminDonationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/");
  await connectToDatabase();
  await Donation.updateMany({ status: "Available", pickupDeadline: { $lte: new Date() } }, { $set: { status: "Expired" } });
  const donations = await Donation.find({ status: { $in: ["Available", "Claimed", "Pickup Assigned", "Picked Up", "Delivered"] } }).populate("providerId", "name email").sort({ pickupDeadline: 1 }).lean();
  return <main className="min-h-screen bg-slate-50"><Navbar /><section className="container-page py-12"><p className="font-semibold text-green-700">Administration</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Current food</h1><p className="mt-2 text-slate-600">Live donations that are available or in progress.</p><div className="mt-7 grid gap-4">{donations.map((donation) => <article key={donation._id.toString()} className="surface-card p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><div className="flex items-center gap-3"><h2 className="text-lg font-bold text-slate-900">{donation.foodName}</h2><span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">{donation.status}</span></div><p className="mt-1 text-sm text-slate-600">{donation.servings} servings · {donation.quantity} {donation.unit} · {donation.dietaryType}</p><p className="mt-2 text-sm text-slate-500">Provider: {donation.providerId?.name || "Unknown"} · {donation.addressLabel}</p></div><p className="text-sm font-medium text-slate-700">Pickup by<br />{new Date(donation.pickupDeadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p></div></article>)}{donations.length === 0 && <div className="surface-card p-10 text-center text-slate-500">There is no active food donation right now.</div>}</div></section></main>;
}
