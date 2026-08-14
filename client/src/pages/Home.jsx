import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  const scrollToNGONetwork = () => {
    document
      .getElementById("ngo-network")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-10">
          <div className="max-w-3xl">

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
              Connecting communities
            </p>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Help should reach the people who need it.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
              HelpGrid connects people, resources, volunteers and verified NGOs
              so help can reach the right place at the right time.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">

              <Link
                to="/signup"
                className="rounded-xl bg-black px-6 py-3.5 text-center text-sm font-medium text-white transition hover:bg-gray-800 sm:text-base"
              >
                Get Started
              </Link>

              <button
                type="button"
                onClick={scrollToNGONetwork}
                className="rounded-xl border border-gray-300 px-6 py-3.5 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:text-base"
              >
                Explore NGO Network ↓
              </button>

            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-10">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                One network. Faster help.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                HelpGrid connects a request with the right verified NGO based
                on location, category and availability.
              </p>

            </div>

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">

              {/* Step 1 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold sm:h-12 sm:w-12 sm:text-lg">
                  01
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  Create a request
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  Share what help or resource is available, where it is located
                  and how urgently it is needed.
                </p>

              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold sm:h-12 sm:w-12 sm:text-lg">
                  02
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  Find the right NGO
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  HelpGrid identifies suitable nearby NGOs based on their
                  category, service area, availability and capacity.
                </p>

              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold sm:h-12 sm:w-12 sm:text-lg">
                  03
                </div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  Help gets delivered
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  The NGO accepts the request, coordinates the response and
                  updates the request until the help is completed.
                </p>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-10">

            <div className="max-w-2xl">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
                What can HelpGrid do?
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Turn available help into real action.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Whether someone has something to give or needs support,
                HelpGrid connects the request with organizations that can
                actually respond.
              </p>

            </div>

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-6">

              {/* Food */}
              <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-7">

                <div className="text-4xl">🍱</div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  Food Rescue
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  Have extra cooked food? Create a time-sensitive request and
                  let nearby food-support NGOs coordinate the pickup.
                </p>

                <button
                  type="button"
                  className="mt-6 text-sm font-semibold text-gray-900 hover:underline"
                >
                  Learn more →
                </button>

              </div>

              {/* Resources */}
              <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-7">

                <div className="text-4xl">📦</div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  Resource Sharing
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  Connect available clothes, blankets, ration, books and other
                  useful resources with NGOs that can distribute them.
                </p>

                <button
                  type="button"
                  className="mt-6 text-sm font-semibold text-gray-900 hover:underline"
                >
                  Learn more →
                </button>

              </div>

              {/* Need Help */}
              <div className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg sm:p-7">

                <div className="text-4xl">🆘</div>

                <h3 className="mt-5 text-xl font-semibold text-gray-900">
                  Need Help
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  Submit a request for support and HelpGrid can identify
                  relevant NGOs operating in the area.
                </p>

                <button
                  type="button"
                  className="mt-6 text-sm font-semibold text-gray-900 hover:underline"
                >
                  Learn more →
                </button>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            NGO NETWORK
        ===================================================== */}

        <section
          id="ngo-network"
          className="scroll-mt-20 bg-gray-50"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 lg:px-10">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 sm:text-sm">
                Built for everyone
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everyone can be part of the network.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Whether you need help, have resources to share, or represent an
                NGO, HelpGrid gives you a way to coordinate.
              </p>

            </div>

            <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-6">

              {/* People */}
              <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 md:p-10">

                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gray-100 text-2xl sm:h-14 sm:w-14">
                  👤
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  For People
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                  Need support or have something useful to give? Create a
                  request, share a resource or connect with an organization
                  working near you.
                </p>

                <div className="mt-7 space-y-3 text-sm text-gray-700">
                  <p>✓ Request help</p>
                  <p>✓ Donate extra resources</p>
                  <p>✓ Report available food</p>
                  <p>✓ Track your request</p>
                </div>

                <Link
                  to="/signup"
                  className="mt-8 inline-block w-full rounded-xl bg-black px-6 py-3.5 text-center text-sm font-medium text-white hover:bg-gray-800 sm:w-auto"
                >
                  Get Help or Donate
                </Link>

              </div>

              {/* NGOs */}
              <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 text-white sm:p-8 md:p-10">

                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/10 text-2xl sm:h-14 sm:w-14">
                  🏢
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  For NGOs
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-300 sm:text-base">
                  Join a local network of organizations, discover nearby
                  requests, share resources and collaborate with other NGOs.
                </p>

                <div className="mt-7 space-y-3 text-sm text-gray-300">
                  <p>✓ Receive nearby requests</p>
                  <p>✓ Manage your service areas</p>
                  <p>✓ Coordinate with other NGOs</p>
                  <p>✓ Share resources and volunteers</p>
                </div>

                <Link
                  to="/signup"
                  className="mt-8 inline-block w-full rounded-xl bg-white px-6 py-3.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 sm:w-auto"
                >
                  Join as an NGO
                </Link>

              </div>

            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Home;