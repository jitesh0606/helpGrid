import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
function AdminDashboard() {
  const [ngos, setNgos] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // FETCH PENDING NGOS
  // =========================

  const fetchPendingNGOs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Admin authentication required.");
      }

      const response = await fetch(
  `${API_URL}/api/admin/ngos/pending`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch pending NGOs."
        );
      }

      setNgos(data.ngos || []);
    } catch (error) {
      console.error("Fetch pending NGOs error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY NGO
  // =========================

  const verifyNGO = async (ngoId) => {
    try {
      setActionLoading(ngoId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
  `${API_URL}/api/admin/ngos/${ngoId}/verify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to verify NGO."
        );
      }

      setMessage(
        `${data.ngo.name} has been verified successfully.`
      );

      setNgos((prevNGOs) =>
        prevNGOs.filter((ngo) => ngo._id !== ngoId)
      );

      setSelectedNGO(null);
    } catch (error) {
      console.error("Verify NGO error:", error);
      setError(error.message);
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // REJECT NGO
  // =========================

  const rejectNGO = async (ngoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this NGO?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(ngoId);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
  `${API_URL}/api/admin/ngos/${ngoId}/reject`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reject NGO."
        );
      }

      setMessage(
        `${data.ngo.name} has been rejected.`
      );

      setNgos((prevNGOs) =>
        prevNGOs.filter((ngo) => ngo._id !== ngoId)
      );

      setSelectedNGO(null);
    } catch (error) {
      console.error("Reject NGO error:", error);
      setError(error.message);
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchPendingNGOs();
  }, []);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#fafafa] px-5 py-8 sm:px-8">

      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="relative overflow-hidden rounded-3xl bg-black p-7 text-white shadow-[0_10px_0_#d1d1d1] sm:p-10">

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" />

          <div className="absolute -bottom-16 right-24 h-32 w-32 rotate-12 rounded-3xl border border-white/5" />

          <div className="relative">

            <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
              <span className="h-2 w-2 rounded-full bg-white" />
              HelpGrid Admin
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Review NGO applications and manage
              verification for the HelpGrid network.
            </p>

          </div>

        </div>

        {/* =========================
            STATS
        ========================= */}

        <div className="mt-7 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_5px_0_#e5e5e5]">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Pending NGOs
            </p>

            <p className="mt-3 text-4xl font-black text-gray-950">
              {loading ? "—" : ngos.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_5px_0_#e5e5e5]">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Review Queue
            </p>

            <p className="mt-3 text-sm font-bold text-gray-900">
              {ngos.length > 0
                ? "Action required"
                : "All clear"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-black p-6 text-white shadow-[0_5px_0_#aaa]">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              System
            </p>

            <p className="mt-3 text-sm font-bold">
              Verification Active
            </p>
          </div>

        </div>

        {/* =========================
            MESSAGES
        ========================= */}

        {message && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-black px-5 py-4 text-sm font-semibold text-white shadow-[0_4px_0_#d1d1d1]">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-gray-300 bg-white px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            NGO VERIFICATION
        ========================= */}

        <div className="mt-8">

          <div className="mb-5 flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Verification
              </p>

              <h2 className="mt-1 text-2xl font-black text-gray-950">
                Pending NGO Applications
              </h2>
            </div>

            <button
              onClick={fetchPendingNGOs}
              disabled={loading}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-[0_4px_0_#d1d1d1] transition hover:-translate-y-0.5 hover:border-black hover:text-black active:translate-y-[2px] active:shadow-[0_2px_0_#d1d1d1] disabled:opacity-50"
            >
              ↻ Refresh
            </button>

          </div>

          {/* =========================
              LOADING
          ========================= */}

          {loading ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-[0_6px_0_#e5e5e5]">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading NGO applications...
              </p>

            </div>

          ) : ngos.length === 0 ? (

            /* =========================
                EMPTY
            ========================= */

            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-[0_6px_0_#e5e5e5]">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl shadow-[0_4px_0_#ddd]">
                ✓
              </div>

              <h3 className="mt-6 text-xl font-black">
                No pending applications
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                All NGO applications have been reviewed.
                New registrations will appear here.
              </p>

            </div>

          ) : (

            /* =========================
                NGO CARDS
            ========================= */

            <div className="grid gap-6 lg:grid-cols-2">

              {ngos.map((ngo) => (

                <div
                  key={ngo._id}
                  className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_7px_0_#e5e5e5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_11px_0_#d5d5d5]"
                >

                  {/* Card Header */}

                  <div className="border-b border-gray-200 p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-xl text-white shadow-[0_5px_0_#d1d1d1]">
                          🏢
                        </div>

                        <div>

                          <h3 className="text-xl font-black text-gray-950">
                            {ngo.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {ngo.city || "City not provided"}
                          </p>

                        </div>

                      </div>

                      <span className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-gray-600">
                        Pending
                      </span>

                    </div>

                  </div>

                  {/* Basic Details */}

                  <div className="space-y-4 p-6">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Contact
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {ngo.phone || "Not provided"}
                      </p>

                      <p className="mt-1 break-all text-sm text-gray-500">
                        {ngo.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Categories
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {ngo.categories?.length > 0 ? (
                          ngo.categories.map((category) => (
                            <span
                              key={category}
                              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold capitalize text-gray-700"
                            >
                              {category}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">
                            None provided
                          </span>
                        )}

                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        Description
                      </p>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {ngo.description ||
                          "No description provided."}
                      </p>
                    </div>

                  </div>

                  {/* =========================
                      ACTION BUTTONS
                  ========================= */}

                  <div className="grid grid-cols-3 gap-3 border-t border-gray-200 bg-gray-50 p-5">

                    {/* VIEW DETAILS */}

                    <button
                      type="button"
                      onClick={() => {
                        console.log("Selected NGO:", ngo);
                        setSelectedNGO(ngo);
                      }}
                      className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm font-bold text-gray-800 shadow-[0_4px_0_#d1d1d1] transition-all hover:-translate-y-0.5 hover:border-black hover:text-black active:translate-y-[2px] active:shadow-[0_2px_0_#d1d1d1]"
                    >
                      View Details
                    </button>

                    {/* VERIFY */}

                    <button
                      type="button"
                      onClick={() => verifyNGO(ngo._id)}
                      disabled={actionLoading === ngo._id}
                      className="rounded-xl bg-black px-3 py-3 text-sm font-bold text-white shadow-[0_4px_0_#aaa] transition-all hover:-translate-y-0.5 hover:bg-gray-800 active:translate-y-[2px] active:shadow-[0_2px_0_#999] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionLoading === ngo._id
                        ? "Processing..."
                        : "✓ Verify"}
                    </button>

                    {/* REJECT */}

                    <button
                      type="button"
                      onClick={() => rejectNGO(ngo._id)}
                      disabled={actionLoading === ngo._id}
                      className="rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm font-bold text-gray-800 shadow-[0_4px_0_#d1d1d1] transition-all hover:-translate-y-0.5 hover:border-black active:translate-y-[2px] active:shadow-[0_2px_0_#bbb] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ✕ Reject
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          NGO DETAILS MODAL
      ================================================= */}

      {selectedNGO && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"
          onClick={() => setSelectedNGO(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-gray-200 bg-black p-6 text-white">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  NGO Verification
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {selectedNGO.name}
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setSelectedNGO(null)}
                className="rounded-xl border border-white/20 px-3 py-2 text-sm font-bold transition hover:bg-white hover:text-black"
              >
                ✕
              </button>

            </div>

            {/* Modal Details */}

            <div className="grid gap-5 p-6 sm:grid-cols-2">

              <Detail
                label="Registration Number"
                value={selectedNGO.registrationNumber}
              />

              <Detail
                label="Registration Authority"
                value={selectedNGO.registrationAuthority}
              />

              <Detail
                label="Established Year"
                value={selectedNGO.establishedYear}
              />

              <Detail
                label="Website"
                value={selectedNGO.website}
              />

              <div className="sm:col-span-2">
                <Detail
                  label="Official Address"
                  value={selectedNGO.officialAddress}
                />
              </div>

              <Detail
                label="City"
                value={selectedNGO.city}
              />

              <Detail
                label="NGO Phone"
                value={selectedNGO.phone}
              />

              <Detail
                label="Contact Person"
                value={selectedNGO.contactPerson?.name}
              />

              <Detail
                label="Designation"
                value={selectedNGO.contactPerson?.designation}
              />

              <Detail
                label="Contact Phone"
                value={selectedNGO.contactPerson?.phone}
              />

              <div className="sm:col-span-2">
                <Detail
                  label="Description"
                  value={selectedNGO.description}
                />
              </div>

              <div className="sm:col-span-2">

                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Categories
                </p>

                <div className="mt-2 flex flex-wrap gap-2">

                  {selectedNGO.categories?.length > 0 ? (

                    selectedNGO.categories.map((category) => (

                      <span
                        key={category}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold capitalize text-gray-700"
                      >
                        {category}
                      </span>

                    ))

                  ) : (

                    <span className="text-sm text-gray-400">
                      None provided
                    </span>

                  )}

                </div>

              </div>

              <div className="sm:col-span-2">

                <Detail
                  label="Application Submitted"
                  value={
                    selectedNGO.createdAt
                      ? new Date(
                          selectedNGO.createdAt
                        ).toLocaleString()
                      : null
                  }
                />

              </div>

            </div>

            {/* Modal Actions */}

            <div className="grid grid-cols-2 gap-3 border-t border-gray-200 bg-gray-50 p-6">

              <button
                type="button"
                onClick={() =>
                  verifyNGO(selectedNGO._id)
                }
                disabled={
                  actionLoading === selectedNGO._id
                }
                className="rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-[0_4px_0_#aaa] transition-all hover:-translate-y-0.5 hover:bg-gray-800 active:translate-y-[2px] disabled:opacity-50"
              >
                {actionLoading === selectedNGO._id
                  ? "Processing..."
                  : "✓ Verify NGO"}
              </button>

              <button
                type="button"
                onClick={() =>
                  rejectNGO(selectedNGO._id)
                }
                disabled={
                  actionLoading === selectedNGO._id
                }
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-800 shadow-[0_4px_0_#d1d1d1] transition-all hover:-translate-y-0.5 hover:border-black active:translate-y-[2px] disabled:opacity-50"
              >
                ✕ Reject NGO
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =========================
// DETAIL COMPONENT
// =========================

function Detail({ label, value }) {
  return (
    <div>

      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words font-semibold text-gray-800">
        {value || "Not provided"}
      </p>

    </div>
  );
}

export default AdminDashboard;