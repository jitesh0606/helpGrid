import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save authentication data
      login(data.token, data.user);

      console.log("LOGIN RESPONSE:", data);
      console.log("USER ROLE:", data.user?.role);

      // =========================
      // ROLE BASED REDIRECT
      // =========================

      if (data.user?.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user?.role === "ngo") {
        navigate("/ngo-dashboard");
      } else if (data.user?.role === "user") {
        navigate("/dashboard");
      } else {
        setError("Unknown user role.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#fafafa] px-5 py-8 sm:px-8">

      {/* Back Button */}
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-[0_4px_0_#d1d1d1] transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:text-black hover:shadow-[0_5px_0_#111] active:translate-y-[2px] active:shadow-[0_2px_0_#111]"
        >
          <span className="text-base transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>
          Back
        </button>
      </div>

      {/* Main Card */}
      <div className="mx-auto flex max-w-5xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_25px_70px_rgba(0,0,0,0.10)] lg:grid-cols-2">

          {/* =========================
              LEFT SIDE
          ========================= */}

          <div className="hidden bg-black p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <div className="mb-8 inline-flex rounded-xl border border-white/20 px-4 py-2 text-xs font-bold tracking-[0.2em]">
                HELPGRID
              </div>

              <h1 className="text-4xl font-black leading-tight">
                Together,
                <br />
                We Help Better.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-6 text-gray-400">
                Connecting people who need help with NGOs
                and organizations that can make a difference.
              </p>

            </div>

            {/* 3D Block */}
            <div className="flex justify-center py-10">

              <div className="relative h-32 w-48">

                <div className="absolute left-1/2 top-0 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border border-white/20 bg-white text-2xl text-black shadow-[0_12px_0_#555]">
                  🤝
                </div>

                <div className="absolute bottom-0 left-1/2 h-5 w-40 -translate-x-1/2 rounded-[50%] bg-gray-700 shadow-[0_5px_0_#222]" />

              </div>

            </div>

            <p className="text-xs text-gray-500">
              People • NGOs • Communities
            </p>

          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="flex items-center justify-center p-7 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">

              {/* Heading */}

              <div className="mb-7">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-xl text-white shadow-[0_5px_0_#d1d1d1]">
                  🔐
                </div>

                <h2 className="text-3xl font-black tracking-tight text-gray-950">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Login to your HelpGrid account
                </p>

              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Password */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                {/* Role */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Login as
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-medium text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  >
                    <option value="user">
                      User
                    </option>

                    <option value="ngo">
                      NGO
                    </option>

                    <option value="admin">
                      Admin
                    </option>
                  </select>
                </div>

                {/* Error */}

                {error && (
                  <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* Login Button */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-[0_7px_0_#bdbdbd] active:translate-y-[3px] active:shadow-[0_2px_0_#bdbdbd] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Logging in..."
                    : "Login →"}
                </button>

              </form>

              {/* Signup */}

              <div className="mt-7 border-t border-gray-200 pt-6 text-center">

                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}

                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="font-bold text-black underline underline-offset-4 hover:text-gray-600"
                  >
                    Sign up
                  </button>
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;