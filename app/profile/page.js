import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { getSession } from "@/lib/session";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  await connectToDatabase();
  const user = await User.findById(session.userId).select("name email phone role address createdAt").lean();
  return <main className="min-h-screen bg-slate-50"><Navbar /><section className="container-page py-12"><p className="font-semibold text-green-700">Account</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Your profile</h1><div className="surface-card mt-7 max-w-2xl p-7"><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-sm text-slate-500">Name</dt><dd className="font-semibold text-slate-900">{user.name}</dd></div><div><dt className="text-sm text-slate-500">Email</dt><dd className="font-semibold text-slate-900">{user.email}</dd></div><div><dt className="text-sm text-slate-500">Role</dt><dd className="capitalize font-semibold text-slate-900">{user.role}</dd></div><div><dt className="text-sm text-slate-500">Phone</dt><dd className="font-semibold text-slate-900">{user.phone || "Not added"}</dd></div></dl></div></section></main>;
}
