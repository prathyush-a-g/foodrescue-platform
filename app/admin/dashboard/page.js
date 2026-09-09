import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { getSession } from "@/lib/session";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";
import Donation from "@/models/Donations";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/");
  await connectToDatabase();
  const [users, donations, completed, active] = await Promise.all([User.countDocuments(), Donation.countDocuments(), Donation.countDocuments({ status: "Completed" }), Donation.countDocuments({ status: "Available" })]);
  return <main className="min-h-screen bg-slate-50"><Navbar /><section className="container-page py-12"><p className="font-semibold text-green-700">Administration</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Platform overview</h1><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[["Users", users], ["Donations", donations], ["Available", active], ["Completed", completed]].map(([label, value]) => <div key={label} className="surface-card p-6"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}</div></section></main>;
}
