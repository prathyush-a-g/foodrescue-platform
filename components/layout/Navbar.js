import Link from "next/link";
import { getSession } from "@/lib/session";

const roleLinks = {
  provider: [["Dashboard", "/provider/dashboard"], ["My donations", "/provider/donations"], ["Donate food", "/provider/donations/new"]],
  receiver: [["Find food", "/donations"], ["My claims", "/receiver/claims"], ["Dashboard", "/receiver/dashboard"]],
  volunteer: [["Find food", "/donations"], ["Pickup tasks", "/volunteer/tasks"], ["Dashboard", "/volunteer/dashboard"]],
  admin: [["Admin dashboard", "/admin/dashboard"], ["Users", "/admin/users"], ["Current food", "/admin/donations"]],
};

export default async function Navbar() {
  const session = await getSession();
  const links = session ? roleLinks[session.role] || [] : [["How it works", "/how-it-works"], ["About", "/about"], ["Find food", "/donations"]];

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-green-700"
        >
          FoodRescue
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-600 hover:text-green-700">Home</Link>
          {links.map(([label, href]) => <Link key={href} href={href} className="text-sm font-medium text-slate-600 hover:text-green-700">{label}</Link>)}
        </div>

        <div className="flex items-center gap-3">
          {session ? <><details className="relative"><summary aria-label="Open account menu" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-green-700 text-sm font-bold uppercase text-white shadow-sm hover:bg-green-800">{session.email?.charAt(0)}</summary><div className="absolute right-0 z-20 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"><Link href="/profile" className="block rounded px-3 py-2 text-sm hover:bg-slate-50">Profile</Link><form action="/api/auth/logout" method="post"><button className="w-full rounded px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50">Log out</button></form></div></details></> : <><Link href="/login" className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:block">Login</Link><Link href="/register" className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">Get Started</Link></>}
        </div>

      </div>
    </nav>
  );
}
