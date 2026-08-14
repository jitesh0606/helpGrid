import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NGOSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  registrationNumber: "",
  registrationAuthority: "",
  establishedYear: "",
  website: "",
  address: "",
  city: "",
  Area: "",
  description: "",
  contactPersonName: "",
  contactPersonPhone: "",
  contactPersonDesignation: "",
  password: "",
  confirmPassword: "",
  categories: [],
});

const [location, setLocation] = useState(null);
const [locationLoading, setLocationLoading] = useState(false);
const [locationError, setLocationError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "food",
    "education",
    "medical",
    "clothes",
    "shelter",
    "volunteer",
    "other",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (category) => {
    setFormData((prev) => {
      const alreadySelected =
        prev.categories.includes(category);

      return {
        ...prev,
        categories: alreadySelected
          ? prev.categories.filter(
              (item) => item !== category
            )
          : [...prev.categories, category],
      };
    });
  };

 const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    setLocationError(
      "Your browser does not support location access."
    );
    return;
  }

  setLocationLoading(true);
  setLocationError("");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;

      setLocation({
        latitude,
        longitude,
      });

      setLocationLoading(false);
    },
    (error) => {
      console.error("Location error:", error);

      setLocationError(
        "Unable to get your location. Please allow location access."
      );

      setLocationLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }
    
    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (formData.categories.length === 0) {
      setError(
        "Please select at least one service category."
      );
      return;
    }

    if (!location) {
  setError(
    "Please capture your NGO location before submitting."
  );
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
            role: "ngo",

            registrationNumber: formData.registrationNumber,

registrationAuthority:
  formData.registrationAuthority,

establishedYear:
  Number(formData.establishedYear),

website:
  formData.website,

officialAddress:
  formData.address,

city:
  formData.city,

description:
  formData.description,

contactPersonName:
  formData.contactPersonName,

contactPersonPhone:
  formData.contactPersonPhone,

contactPersonDesignation:
  formData.contactPersonDesignation,

categories:
  formData.categories,

            categories:
              formData.categories,
            
              coordinates: [
  location.longitude,
  location.latitude,
],
            verificationDocuments: [],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "NGO registration failed."
        );
      }

      setSuccess(
        "NGO registered successfully. Your verification is pending."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(
        "NGO signup error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#fafafa] px-5 py-8 sm:px-8">

      <div className="mx-auto max-w-4xl">

        {/* Back */}

        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="mb-7 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-[0_4px_0_#d1d1d1] transition hover:-translate-y-0.5 hover:border-black hover:text-black hover:shadow-[0_5px_0_#111] active:translate-y-[2px] active:shadow-[0_2px_0_#111]"
        >
          ← Back
        </button>

        {/* Main Card */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_0_#e5e5e5]">

          {/* Header */}

          <div className="bg-black p-7 text-white sm:p-10">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl text-black shadow-[0_5px_0_#777]">
                🏢
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  NGO Registration
                </p>

                <h1 className="mt-1 text-3xl font-black tracking-tight">
                  Join the HelpGrid Network
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                  Register your organization to help
                  people in your local community.
                </p>

              </div>

            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">

              <p className="text-xs leading-5 text-gray-400">
                Your NGO account will remain{" "}
                <span className="font-bold text-white">
                  pending verification
                </span>{" "}
                until it is reviewed by a HelpGrid administrator.
              </p>

            </div>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-8 p-7 sm:p-10"
          >

            {/* =========================
                BASIC DETAILS
            ========================= */}

            <section>

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Step 01
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Organization Details
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    NGO Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Helping Hands Foundation"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Official Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ngo@example.org"
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
                    placeholder="NGO contact number"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Registration Number
                  </label>

                  <input
                    type="text"
                    name="registrationNumber"
                    value={
                      formData.registrationNumber
                    }
                    onChange={handleChange}
                    placeholder="Official registration number"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>
               
                <div>
  <label className="mb-2 block text-sm font-semibold">
    Registration Authority
  </label>

  <input
    type="text"
    name="registrationAuthority"
    value={formData.registrationAuthority}
    onChange={handleChange}
    placeholder="e.g. Registrar of Societies"
    required
    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
  />
</div>

<div>
  <label className="mb-2 block text-sm font-semibold">
    Established Year
  </label>

  <input
    type="number"
    name="establishedYear"
    value={formData.establishedYear}
    onChange={handleChange}
    placeholder="e.g. 2018"
    min="1800"
    max={new Date().getFullYear()}
    required
    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
  />
</div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Website
                    <span className="ml-1 font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.org"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

              </div>

            </section>

            {/* =========================
                ADDRESS
            ========================= */}

            <section className="border-t border-gray-200 pt-8">

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Step 02
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Location
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter NGO office address"
                    rows="3"
                    required
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

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

              </div>

            </section>

            <div className="sm:col-span-2">

  <label className="mb-2 block text-sm font-semibold">
    NGO Location
  </label>

  <button
    type="button"
    onClick={getCurrentLocation}
    disabled={locationLoading}
    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-left text-sm font-bold text-gray-800 shadow-[0_4px_0_#e5e5e5] transition-all hover:-translate-y-0.5 hover:border-black hover:shadow-[0_6px_0_#d1d1d1] active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-60"
  >
    {locationLoading
      ? "Getting NGO location..."
      : location
      ? "✓ NGO Location Captured — Update"
      : "📍 Use NGO's Current Location"}
  </button>

  {location && (
    <p className="mt-2 text-xs font-medium text-gray-500">
      Location captured successfully.
      This will be used to find nearby
      help requests.
    </p>
  )}

  {locationError && (
    <p className="mt-2 text-xs font-semibold text-red-600">
      {locationError}
    </p>
  )}

</div>

            {/* =========================
                CONTACT PERSON
            ========================= */}

            <section className="border-t border-gray-200 pt-8">

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Step 03
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Responsible Person
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Person responsible for handling HelpGrid requests.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="contactPersonName"
                    value={
                      formData.contactPersonName
                    }
                    onChange={handleChange}
                    placeholder="Contact person's name"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Designation
                  </label>

                  <input
                    type="text"
                    name="contactPersonDesignation"
                    value={
                      formData.contactPersonDesignation
                    }
                    onChange={handleChange}
                    placeholder="e.g. Coordinator"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                 
                   <div>
  <label className="mb-2 block text-sm font-semibold">
    Contact Phone
  </label>

  <input
    type="tel"
    name="contactPersonPhone"
    value={formData.contactPersonPhone}
    onChange={handleChange}
    placeholder="Responsible person's phone"
    required
    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
  />
</div>

              </div>

            </section>

            {/* =========================
                CATEGORIES
            ========================= */}

            <section className="border-t border-gray-200 pt-8">

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Step 04
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Services You Provide
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select all categories your NGO can handle.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                {categories.map((category) => {
                  const selected =
                    formData.categories.includes(
                      category
                    );

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          category
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-bold capitalize transition-all ${
                        selected
                          ? "border-black bg-black text-white shadow-[0_4px_0_#cfcfcf]"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-400 hover:bg-white"
                      }`}
                    >
                      {selected && "✓ "}
                      {category}
                    </button>
                  );
                })}

              </div>

            </section>

            {/* =========================
                DESCRIPTION
            ========================= */}

            <section className="border-t border-gray-200 pt-8">

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Step 05
                </p>

                <h2 className="mt-1 text-xl font-black">
                  About Your NGO
                </h2>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us briefly about your organization and the communities you serve."
                rows="4"
                required
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
              />

            </section>

            {/* =========================
                PASSWORD
            ========================= */}

            <section className="border-t border-gray-200 pt-8">

              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Step 06
                </p>

                <h2 className="mt-1 text-xl font-black">
                  Account Security
                </h2>
              </div>

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
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />
                </div>

              </div>

            </section>

            {/* =========================
                VERIFICATION NOTICE
            ========================= */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-sm text-white">
                  ✓
                </div>

                <div>
                  <h3 className="text-sm font-bold">
                    Verification required
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your NGO will be reviewed by a
                    HelpGrid administrator before it can
                    accept help requests. Please provide
                    accurate organization information.
                  </p>
                </div>

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
              <div className="rounded-xl border border-black bg-black px-4 py-3 text-sm font-medium text-white">
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
                ? "Submitting Registration..."
                : "Submit NGO Registration →"}
            </button>

          </form>

        </div>

        {/* Login */}

        <p className="py-7 text-center text-sm text-gray-500">
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
  );
}

export default NGOSignup;