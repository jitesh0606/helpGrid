import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    area: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            city: formData.city,
            area: formData.area,
            role: "user",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("User signup error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#fafafa] px-5 py-8 sm:px-8">

      <div className="mx-auto max-w-2xl">

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="mb-7 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-[0_4px_0_#d1d1d1] transition hover:-translate-y-0.5 hover:border-black hover:text-black hover:shadow-[0_5px_0_#111] active:translate-y-[2px] active:shadow-[0_2px_0_#111]"
        >
          ← Back
        </button>

        {/* Card */}

        <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-[0_10px_0_#e5e5e5] sm:p-10">

          <div className="mb-8">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-[0_5px_0_#d1d1d1]">
              👤
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Individual Account
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join HelpGrid and connect with your community.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Email + Phone */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>

            {/* City + Area */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Meerut"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Area / Locality
                </label>

                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Shastri Nagar"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>

            {/* Password */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Confirm Password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                />
              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="rounded-xl border border-gray-300 bg-black px-4 py-3 text-sm font-medium text-white">
                ✓ {success}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-6 py-4 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-[0_7px_0_#bdbdbd] active:translate-y-[3px] active:shadow-[0_2px_0_#bdbdbd] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account →"}
            </button>

          </form>

          <div className="mt-7 border-t border-gray-200 pt-6 text-center">

            <p className="text-sm text-gray-500">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-bold text-black underline underline-offset-4"
              >
                Login
              </button>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}

export default UserSignup;