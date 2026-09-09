import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">

      <Navbar />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:py-28">

          {/* Left side */}
          <div className="w-full lg:w-1/2">

            <p className="mb-4 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Reduce food waste • Help communities
            </p>

            <h1 className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
              Turn surplus food into
              <span className="block text-green-700">
                someone meal.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              FoodRescue connects food providers, community organizations,
              and volunteers to help surplus food reach people instead of
              going to waste.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              
<Link
  href="/login"
  className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
>
  Donate Food
</Link>
              <Link
                href="/find-food"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Find Food
              </Link>

            </div>

          </div>

          {/* Right side */}
          <div className="w-full lg:w-1/2">

            <div className="mb-6 overflow-hidden rounded-3xl border border-green-100 bg-[#fffaf1] shadow-sm">
              <Image
                src="/foodrescue-community-hero.png"
                alt="A food provider sharing a warm meal with community members"
                width={1254}
                height={1254}
                priority
                className="h-auto w-full"
              />
            </div>

            <div className="rounded-3xl bg-green-700 p-8 text-white shadow-xl">

              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  FoodRescue
                </h2>

                <span className="rounded-full bg-green-600 px-3 py-1 text-sm">
                  Community powered
                </span>
              </div>

              <div className="space-y-4">

                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-green-700">
                    1
                  </span>

                  <div>
                    <p className="font-semibold">
                      Food provider posts donation
                    </p>
                    <p className="text-sm text-green-100">
                      Surplus food becomes available.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-green-700">
                    2
                  </span>

                  <div>
                    <p className="font-semibold">
                      Receiver claims food
                    </p>
                    <p className="text-sm text-green-100">
                      An organization requests the donation.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-green-700">
                    3
                  </span>

                  <div>
                    <p className="font-semibold">
                      Volunteer picks it up
                    </p>
                    <p className="text-sm text-green-100">
                      Food is transported to the receiver.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-green-700">
                    4
                  </span>

                  <div>
                    <p className="font-semibold">
                      Food reaches the community
                    </p>
                    <p className="text-sm text-green-100">
                      The donation is delivered and completed.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

  
    {/* How FoodRescue Works */}
    
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          {/* Section heading */}
          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              From surplus food to a shared meal
            </h2>

            <p className="mt-4 text-lg leading-7 text-slate-600">
              FoodRescue makes it simple for providers, receivers, and
              volunteers to work together.
            </p>

          </div>

          {/* Steps */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                1
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                Post surplus food
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Food providers add details about available surplus food,
                quantity, location, and pickup deadline.
              </p>

            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                2
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                Receiver claims it
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Verified receivers can browse available donations and
                claim food their community needs.
              </p>

            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                3
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                Pickup is coordinated
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Volunteers can accept pickup tasks and transport food
                from the provider to the receiver.
              </p>

            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                4
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                Food reaches people
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                The receiver confirms delivery and the donation is
                marked as completed.
              </p>

            </div>

          </div>

        </div>
      </section>
      </main>

  );
}
