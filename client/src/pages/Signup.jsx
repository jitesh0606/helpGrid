import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#fafafa] px-5 py-8 sm:px-8">

      {/* Back Button */}
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group mb-7 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-[0_4px_0_#d1d1d1] transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:text-black hover:shadow-[0_5px_0_#111] active:translate-y-[2px] active:shadow-[0_2px_0_#111]"
        >
          <span className="text-base transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          Back
        </button>
      </div>

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mx-auto max-w-2xl text-center">

          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-black tracking-[0.15em] text-white shadow-[0_4px_0_#d1d1d1] transition hover:-translate-y-0.5 hover:bg-gray-800"
          >
            HELPGRID
          </Link>

          <h1 className="mt-7 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
            Join HelpGrid
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Choose how you want to be part of the network.
          </p>

        </div>

        {/* Role Cards */}

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">

          {/* =========================
              USER
          ========================= */}

          <button
            type="button"
            onClick={() => navigate("/signup/user")}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 text-left shadow-[0_8px_0_#e5e5e5] transition-all duration-300 hover:-translate-y-2 hover:border-gray-400 hover:shadow-[0_16px_0_#d4d4d4] active:translate-y-1 active:shadow-[0_4px_0_#e5e5e5]"
          >

            {/* Top line */}

            <div className="absolute left-0 right-0 top-0 h-1.5 bg-black transition-all duration-300 group-hover:h-2" />

            {/* Icon */}

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-2xl shadow-[0_4px_0_#e0e0e0] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-2">
              👤
            </div>

            <h2 className="mt-7 text-2xl font-black tracking-tight text-gray-950">
              I'm an individual
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              I need help, want to donate resources, report available food,
              or contribute to my community.
            </p>

            {/* Bottom */}

            <div className="mt-7 flex items-center justify-between">

              <span className="text-sm font-bold text-gray-900">
                Continue as individual
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-[0_4px_0_#cfcfcf] transition-all duration-200 group-hover:translate-x-1 group-hover:shadow-[0_5px_0_#bdbdbd]">
                →
              </span>

            </div>

          </button>

          {/* =========================
              NGO
          ========================= */}

          <button
            type="button"
            onClick={() => navigate("/signup/ngo")}
            className="group relative overflow-hidden rounded-3xl border border-gray-900 bg-black p-7 text-left text-white shadow-[0_8px_0_#bdbdbd] transition-all duration-300 hover:-translate-y-2 hover:bg-gray-900 hover:shadow-[0_16px_0_#999] active:translate-y-1 active:shadow-[0_4px_0_#aaa]"
          >

            {/* Top line */}

            <div className="absolute left-0 right-0 top-0 h-1.5 bg-white/80 transition-all duration-300 group-hover:h-2" />

            {/* Icon */}

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl shadow-[0_4px_0_rgba(255,255,255,0.08)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:-rotate-2">
              🏢
            </div>

            <h2 className="mt-7 text-2xl font-black tracking-tight">
              I represent an NGO
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              I want to join the local NGO network, receive requests,
              coordinate resources and collaborate with other organizations.
            </p>

            {/* Bottom */}

            <div className="mt-7 flex items-center justify-between">

              <span className="text-sm font-bold">
                Register your NGO
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-[0_4px_0_#777] transition-all duration-200 group-hover:translate-x-1 group-hover:shadow-[0_5px_0_#666]">
                →
              </span>

            </div>

          </button>

        </div>

        {/* Login */}

        <div className="mx-auto mt-9 max-w-4xl border-t border-gray-200 pt-7 text-center">

          <p className="text-sm text-gray-500">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-bold text-black underline decoration-gray-300 underline-offset-4 transition hover:decoration-black"
            >
              Login
            </Link>

          </p>

        </div>

      </div>
    </div>
  );
}

export default Signup;