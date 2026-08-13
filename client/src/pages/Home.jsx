
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Connecting communities
            </p>

            <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
              Help should reach the people who need it.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              HelpGrid connects people, resources, volunteers and verified NGOs
              so help can reach the right place at the right time.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
              >
                Get Started
              </Link>

              <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50">
                Explore NGO Network
              </button>
            </div>
          </div>
        </section>
        <section className="border-t border-gray-100 bg-gray-50">
  <div className="mx-auto max-w-7xl px-6 py-20">

    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        How it works
      </p>

      <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
        One network. Faster help.
      </h2>

      <p className="mt-4 text-gray-600">
        HelpGrid connects a request with the right verified NGO based on
        location, category and availability.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-3">

      {/* Step 1 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold">
          01
        </div>

        <h3 className="mt-6 text-xl font-semibold text-gray-900">
          Create a request
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          Share what help or resource is available, where it is located and
          how urgently it is needed.
        </p>
      </div>

      {/* Step 2 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold">
          02
        </div>

        <h3 className="mt-6 text-xl font-semibold text-gray-900">
          Find the right NGO
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          HelpGrid identifies suitable nearby NGOs based on their category,
          service area, availability and capacity.
        </p>
      </div>

      {/* Step 3 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold">
          03
        </div>

        <h3 className="mt-6 text-xl font-semibold text-gray-900">
          Help gets delivered
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          The NGO accepts the request, coordinates the response and updates
          the request until the help is completed.
        </p>
      </div>

    </div>
  </div>
</section>
<section className="bg-white">
  <div className="mx-auto max-w-7xl px-6 py-20">

    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        What can HelpGrid do?
      </p>

      <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
        Turn available help into real action.
      </h2>

      <p className="mt-4 text-gray-600">
        Whether someone has something to give or needs support, HelpGrid
        connects the request with organizations that can actually respond.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-3">

      {/* Food Rescue */}
      <div className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="text-4xl">🍱</div>

        <h3 className="mt-5 text-xl font-semibold text-gray-900">
          Food Rescue
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          Have extra cooked food? Create a time-sensitive request and let
          nearby food-support NGOs coordinate the pickup.
        </p>

        <button className="mt-6 text-sm font-semibold text-gray-900 hover:underline">
          Learn more →
        </button>
      </div>

      {/* Resource Sharing */}
      <div className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="text-4xl">📦</div>

        <h3 className="mt-5 text-xl font-semibold text-gray-900">
          Resource Sharing
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          Connect available clothes, blankets, ration, books and other useful
          resources with NGOs that can distribute them.
        </p>

        <button className="mt-6 text-sm font-semibold text-gray-900 hover:underline">
          Learn more →
        </button>
      </div>

      {/* Need Help */}
      <div className="rounded-2xl border border-gray-200 p-7 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="text-4xl">🆘</div>

        <h3 className="mt-5 text-xl font-semibold text-gray-900">
          Need Help
        </h3>

        <p className="mt-3 leading-7 text-gray-600">
          Submit a request for support and HelpGrid can identify relevant
          NGOs operating in the area.
        </p>

        <button className="mt-6 text-sm font-semibold text-gray-900 hover:underline">
          Learn more →
        </button>
      </div>

    </div>
  </div>
</section>
<section className="bg-gray-50">
  <div className="mx-auto max-w-7xl px-6 py-20">

    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
        Built for everyone
      </p>

      <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
        Everyone can be part of the network.
      </h2>

      <p className="mt-4 text-gray-600">
        Whether you need help, have resources to share, or represent an NGO,
        HelpGrid gives you a way to coordinate.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2">

      {/* People */}
      <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-10">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
          👤
        </div>

        <h3 className="mt-6 text-2xl font-bold text-gray-900">
          For People
        </h3>

        <p className="mt-4 leading-7 text-gray-600">
          Need support or have something useful to give? Create a request,
          share a resource or connect with an organization working near you.
        </p>

        <div className="mt-7 space-y-3 text-sm text-gray-700">
          <p>✓ Request help</p>
          <p>✓ Donate extra resources</p>
          <p>✓ Report available food</p>
          <p>✓ Track your request</p>
        </div>

        <Link
          to="/signup"
          className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800"
        >
          Get Help or Donate
        </Link>

      </div>

      {/* NGOs */}
      <div className="rounded-3xl border border-gray-200 bg-gray-900 p-8 text-white md:p-10">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
          🏢
        </div>

        <h3 className="mt-6 text-2xl font-bold">
          For NGOs
        </h3>

        <p className="mt-4 leading-7 text-gray-300">
          Join a local network of organizations, discover nearby requests,
          share resources and collaborate with other NGOs.
        </p>

        <div className="mt-7 space-y-3 text-sm text-gray-300">
          <p>✓ Receive nearby requests</p>
          <p>✓ Manage your service areas</p>
          <p>✓ Coordinate with other NGOs</p>
          <p>✓ Share resources and volunteers</p>
        </div>

        <Link
          to="/signup"
          className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-gray-900 hover:bg-gray-100"
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