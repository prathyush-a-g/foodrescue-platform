import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { getSession } from "@/lib/session";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user";

export default async function AdminUsersPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/");
  const { role = "" } = await searchParams;
  await connectToDatabase();
  const users = await User.find(role ? { role } : {}).select("name email role phone isActive createdAt").sort({ createdAt: -1 }).lean();
  const roles = ["", "provider", "receiver", "volunteer", "admin"];
  return <main className="min-h-screen bg-slate-50"><Navbar /><section className="container-page py-12"><p className="font-semibold text-green-700">Administration</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Users</h1><p className="mt-2 text-slate-600">View food providers, receivers, volunteers, and administrators.</p><form className="mt-6 flex max-w-sm gap-3"><select name="role" defaultValue={role} className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900">{roles.map((item) => <option key={item} value={item}>{item ? `${item.charAt(0).toUpperCase()}${item.slice(1)}s` : "All roles"}</option>)}</select><button className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white">Filter</button></form><div className="surface-card mt-6 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="border-b bg-slate-50 text-slate-500"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Role</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user._id.toString()} className="border-b border-slate-100"><td className="px-5 py-4"><p className="font-semibold text-slate-900">{user.name}</p><p className="text-slate-500">{user.email}</p></td><td className="px-5 py-4 capitalize">{user.role}</td><td className="px-5 py-4">{user.phone || "—"}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>{user.isActive ? "Active" : "Inactive"}</span></td><td className="px-5 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString("en-IN")}</td></tr>)}</tbody></table>{users.length === 0 && <p className="p-8 text-center text-slate-500">No users match this filter.</p>}</div></section></main>;
}
