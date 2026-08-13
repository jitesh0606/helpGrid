import { useEffect, useMemo, useState } from "react";

function Dashboard() {
  // =====================================================
  // STATE
  // =====================================================

  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [notificationLoading, setNotificationLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [notificationError, setNotificationError] =
    useState("");

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [location, setLocation] =
    useState(null);

  const [formData, setFormData] =
    useState({
      category: "food",
      title: "",
      description: "",
      expiresAt: "",
    });

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]:
        e.target.value,
    }));
  };

  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

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
        const longitude =
          position.coords.longitude;

        const latitude =
          position.coords.latitude;

        setLocation({
          latitude,
          longitude,
        });

        setLocationLoading(false);
      },
      (error) => {
        console.error(
          "Location error:",
          error
        );

        let message =
          "Unable to get your location.";

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          message =
            "Location permission was denied. Please allow location access.";
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          message =
            "Your location is currently unavailable.";
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          message =
            "Location request timed out.";
        }

        setLocationError(message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // =====================================================
  // CREATE HELP REQUEST
  // =====================================================

  const createRequest = async (e) => {
    e.preventDefault();

    setError("");

    if (!location) {
      setLocationError(
        "Please get your current location before creating a request."
      );

      return;
    }

    if (
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      setError(
        "Please enter a title and description."
      );

      return;
    }

    try {
      setCreating(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not logged in."
        );
      }

      const response =
        await fetch(
          "http://localhost:5000/api/requests",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              category:
                formData.category,

              title:
                formData.title.trim(),

              description:
                formData.description.trim(),

              coordinates: [
                location.longitude,
                location.latitude,
              ],

              ...(formData.expiresAt
                ? {
                    expiresAt:
                      new Date(
                        formData.expiresAt
                      ).toISOString(),
                  }
                : {}),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create help request."
        );
      }

      // =================================================
      // RESET FORM
      // =================================================

      setFormData({
        category: "food",
        title: "",
        description: "",
        expiresAt: "",
      });

      // Refresh request list
      await fetchMyRequests();

      alert(
        data.message ||
          "Help request created successfully."
      );
    } catch (error) {
      console.error(
        "Create request error:",
        error
      );

      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // FETCH MY REQUESTS
  // =====================================================

  const fetchMyRequests = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "You are not logged in."
        );

        return;
      }

      const response =
        await fetch(
          "http://localhost:5000/api/requests/my",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch requests."
        );
      }

      setRequests(
        data.requests || []
      );

      setError("");
    } catch (error) {
      console.error(
        "Requests error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications =
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        if (!token) {
          setNotificationError(
            "You are not logged in."
          );

          return;
        }

        const response =
          await fetch(
            "http://localhost:5000/api/notifications",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch notifications."
          );
        }

        setNotifications(
          data.notifications || []
        );

        setNotificationError("");
      } catch (error) {
        console.error(
          "Notifications error:",
          error
        );

        setNotificationError(
          error.message
        );
      } finally {
        setNotificationLoading(false);
      }
    };

  // =====================================================
  // MARK NOTIFICATION AS READ
  // =====================================================

  const markAsRead = async (
    notificationId
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          `http://localhost:5000/api/notifications/${notificationId}/read`,
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to mark notification as read."
        );
      }

      setNotifications(
        (previous) =>
          previous.map(
            (notification) =>
              notification._id ===
              notificationId
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
          )
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  };

  // =====================================================
  // CANCEL REQUEST
  // =====================================================

  const cancelRequest = async (
    requestId
  ) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this help request?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          `http://localhost:5000/api/requests/${requestId}/cancel`,
          {
            method: "PATCH",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to cancel request."
        );
      }

      setRequests(
        (previous) =>
          previous.map(
            (request) =>
              request._id ===
              requestId
                ? {
                    ...request,
                    status:
                      "cancelled",
                  }
                : request
          )
      );
    } catch (error) {
      console.error(
        "Cancel request error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchMyRequests();
    fetchNotifications();

    // Refresh status every 10 seconds.
    const interval =
      setInterval(() => {
        fetchMyRequests();
        fetchNotifications();
      }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // STATS
  // =====================================================

  const activeRequests =
    useMemo(() => {
      return requests.filter(
        (request) =>
          request.status ===
            "pending" ||
          request.status ===
            "accepted" ||
          request.status ===
            "in_progress"
      ).length;
    }, [requests]);

  const completedRequests =
    useMemo(() => {
      return requests.filter(
        (request) =>
          request.status ===
          "completed"
      ).length;
    }, [requests]);

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  // =====================================================
  // STATUS INFORMATION
  // =====================================================

  const getStatusInfo = (
    status
  ) => {
    switch (status) {
      case "pending":
        return {
          label:
            "Finding an NGO",
          description:
            "HelpGrid is contacting suitable nearby NGOs.",
          icon: "🔎",
        };

      case "accepted":
        return {
          label:
            "NGO Accepted",
          description:
            "An NGO has accepted your request.",
          icon: "🤝",
        };

      case "in_progress":
        return {
          label:
            "Help In Progress",
          description:
            "The NGO is currently helping you.",
          icon: "🚀",
        };

      case "completed":
        return {
          label:
            "Completed",
          description:
            "Your help request has been completed.",
          icon: "✓",
        };

      case "cancelled":
        return {
          label:
            "Cancelled",
          description:
            "This request was cancelled.",
          icon: "✕",
        };

      case "expired":
        return {
          label:
            "No NGO Available",
          description:
            "No matching NGO accepted the request.",
          icon: "!",
        };

      default:
        return {
          label: status,
          description:
            "Request status updated.",
          icon: "•",
        };
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
        <div className="text-center">

          <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="text-sm font-semibold text-gray-500">
            Loading your HelpGrid dashboard...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen overflow-hidden bg-[#fafafa] text-gray-900">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed left-[-180px] top-[180px] h-96 w-96 rounded-full bg-gray-200/50 blur-3xl" />

      <div className="pointer-events-none fixed bottom-[-180px] right-[-120px] h-96 w-96 rounded-full bg-gray-200/40 blur-3xl" />

      <main className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-600 shadow-sm">

              <span className="h-2 w-2 rounded-full bg-black" />

              Individual Portal

            </div>

            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              HelpGrid
              <span className="text-gray-400">
                .
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-gray-500">
              Ask for help and let HelpGrid
              connect you with the right
              nearby organization.
            </p>

          </div>

          {/* STATS */}

          <div className="flex gap-3">

            <div className="min-w-[105px] rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_5px_0_#e5e5e5]">

              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Active
              </p>

              <p className="mt-1 text-2xl font-black">
                {activeRequests}
              </p>

            </div>

            <div className="min-w-[105px] rounded-2xl border border-gray-200 bg-black px-5 py-4 text-white shadow-[0_5px_0_#d1d1d1]">

              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Completed
              </p>

              <p className="mt-1 text-2xl font-black">
                {completedRequests}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            CREATE REQUEST
        ================================================= */}

        <section className="mb-14">

          <div className="mb-6">

            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Need Help?
            </p>

            <h2 className="text-2xl font-black tracking-tight">
              Create a Help Request
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tell us what you need and your
              location. HelpGrid will find
              suitable nearby NGOs.
            </p>

          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_10px_0_#e5e5e5]">

            <div className="h-1.5 bg-black" />

            <form
              onSubmit={createRequest}
              className="p-6 sm:p-8"
            >

              <div className="grid gap-6 lg:grid-cols-2">

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    What kind of help do you need?
                  </label>

                  <select
                    name="category"
                    value={
                      formData.category
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm font-medium outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  >

                    <option value="food">
                      Food
                    </option>

                    <option value="clothes">
                      Clothes
                    </option>

                    <option value="medical">
                      Medical
                    </option>

                    <option value="education">
                      Education
                    </option>

                    <option value="shelter">
                      Shelter
                    </option>

                    <option value="transport">
                      Transport
                    </option>

                    <option value="emergency">
                      Emergency
                    </option>

                    <option value="other">
                      Other
                    </option>

                  </select>

                </div>

                {/* TITLE */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Request title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Need food for my family"
                    maxLength={100}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="lg:col-span-2">

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Describe what you need
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Explain your situation and what kind of help would be useful..."
                    rows={5}
                    maxLength={1000}
                    required
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />

                </div>

                {/* EXPIRY */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Request expiry
                    <span className="ml-2 font-normal text-gray-400">
                      Optional
                    </span>
                  </label>

                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={
                      formData.expiresAt
                    }
                    onChange={
                      handleChange
                    }
                    min={
                      new Date(
                        Date.now() +
                          5 * 60 * 1000
                      )
                        .toISOString()
                        .slice(
                          0,
                          16
                        )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    If left empty, the default
                    request expiry will be used.
                  </p>

                </div>

                {/* LOCATION */}

                <div>

                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Your location
                  </label>

                  <button
                    type="button"
                    onClick={
                      getCurrentLocation
                    }
                    disabled={
                      locationLoading
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-left text-sm font-bold text-gray-800 shadow-[0_4px_0_#e5e5e5] transition-all hover:-translate-y-0.5 hover:border-black hover:shadow-[0_6px_0_#d1d1d1] active:translate-y-[2px] active:shadow-[0_2px_0_#d1d1d1] disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {locationLoading
                      ? "Getting your location..."
                      : location
                      ? "✓ Location captured — Update"
                      : "📍 Use my current location"}

                  </button>

                  {location && (
                    <p className="mt-2 text-xs font-medium text-gray-500">
                      Location ready. Your exact
                      coordinates will be used only
                      for matching nearby help.
                    </p>
                  )}

                  {locationError && (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      {locationError}
                    </p>
                  )}

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <div className="mt-7 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">

                <p className="max-w-xl text-xs leading-5 text-gray-400">
                  HelpGrid will first contact the
                  best matching verified NGO near
                  your location. If it does not
                  respond, the request can move to
                  the next suitable NGO.
                </p>

                <button
                  type="submit"
                  disabled={
                    creating ||
                    !location
                  }
                  className="shrink-0 rounded-xl bg-black px-7 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-[0_7px_0_#bdbdbd] active:translate-y-[3px] active:shadow-[0_2px_0_#bdbdbd] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Sending Request..."
                    : "Request Help →"}
                </button>

              </div>

            </form>

          </div>

        </section>

        {/* =================================================
            MY REQUESTS
        ================================================= */}

        <section className="mb-14">

          <div className="mb-6">

            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Tracking
            </p>

            <h2 className="text-2xl font-black tracking-tight">
              My Help Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Follow the progress of every
              request you have created.
            </p>

          </div>

          {requests.length === 0 ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-[0_6px_0_#d1d1d1]">
                🤝
              </div>

              <h3 className="text-xl font-bold">
                No requests yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Create your first help request
                above and HelpGrid will start
                looking for a suitable NGO.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2">

              {requests.map(
                (request) => {
                  const statusInfo =
                    getStatusInfo(
                      request.status
                    );

                  return (
                    <div
                      key={
                        request._id
                      }
                      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_0_#e5e5e5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_13px_0_#d4d4d4]"
                    >

                      <div className="h-1.5 bg-black" />

                      <div className="p-6">

                        {/* HEADER */}

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                              {
                                request.category
                              }
                            </span>

                            <h3 className="mt-3 text-xl font-black tracking-tight">
                              {
                                request.title
                              }
                            </h3>

                          </div>

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black text-xl text-white shadow-[0_4px_0_#d1d1d1]">
                            {
                              statusInfo.icon
                            }
                          </div>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="mt-4 text-sm leading-6 text-gray-500">
                          {
                            request.description
                          }
                        </p>

                        {/* STATUS */}

                        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">

                          <div className="flex items-center justify-between gap-4">

                            <div>

                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                                Current Status
                              </p>

                              <h4 className="mt-1 text-lg font-black">
                                {
                                  statusInfo.label
                                }
                              </h4>

                            </div>

                            <span className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-bold capitalize text-gray-700">
                              {
                                request.status.replace(
                                  "_",
                                  " "
                                )
                              }
                            </span>

                          </div>

                          <p className="mt-3 text-sm leading-6 text-gray-500">
                            {
                              statusInfo.description
                            }
                          </p>

                        </div>

                        {/* STATUS STEPS */}

                        <div className="mt-6">

                          <div className="flex items-center">

                            <div
                              className={`h-3 w-3 rounded-full ${
                                [
                                  "pending",
                                  "accepted",
                                  "in_progress",
                                  "completed",
                                ].includes(
                                  request.status
                                )
                                  ? "bg-black"
                                  : "bg-gray-300"
                              }`}
                            />

                            <div
                              className={`h-1 flex-1 ${
                                [
                                  "accepted",
                                  "in_progress",
                                  "completed",
                                ].includes(
                                  request.status
                                )
                                  ? "bg-black"
                                  : "bg-gray-200"
                              }`}
                            />

                            <div
                              className={`h-3 w-3 rounded-full ${
                                [
                                  "accepted",
                                  "in_progress",
                                  "completed",
                                ].includes(
                                  request.status
                                )
                                  ? "bg-black"
                                  : "bg-gray-300"
                              }`}
                            />

                            <div
                              className={`h-1 flex-1 ${
                                [
                                  "in_progress",
                                  "completed",
                                ].includes(
                                  request.status
                                )
                                  ? "bg-black"
                                  : "bg-gray-200"
                              }`}
                            />

                            <div
                              className={`h-3 w-3 rounded-full ${
                                [
                                  "in_progress",
                                  "completed",
                                ].includes(
                                  request.status
                                )
                                  ? "bg-black"
                                  : "bg-gray-300"
                              }`}
                            />

                            <div
                              className={`h-1 flex-1 ${
                                request.status ===
                                "completed"
                                  ? "bg-black"
                                  : "bg-gray-200"
                              }`}
                            />

                            <div
                              className={`h-3 w-3 rounded-full ${
                                request.status ===
                                "completed"
                                  ? "bg-black"
                                  : "bg-gray-300"
                              }`}
                            />

                          </div>

                          <div className="mt-2 grid grid-cols-4 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">

                            <span>
                              Request
                            </span>

                            <span>
                              Accepted
                            </span>

                            <span>
                              Helping
                            </span>

                            <span>
                              Done
                            </span>

                          </div>

                        </div>

                        {/* ACCEPTED NGO */}

                        {request.acceptedBy && (
                          <div className="mt-6 rounded-2xl border border-gray-200 bg-black p-5 text-white">

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                              Your NGO
                            </p>

                            <h4 className="mt-2 text-lg font-black">
                              {
                                request
                                  .acceptedBy
                                  .name
                              }
                            </h4>

                            <div className="mt-3 space-y-1 text-sm text-gray-300">

                              {request
                                .acceptedBy
                                .phone && (
                                <p>
                                  📞{" "}
                                  {
                                    request
                                      .acceptedBy
                                      .phone
                                  }
                                </p>
                              )}

                              {request
                                .acceptedBy
                                .email && (
                                <p className="break-all">
                                  ✉️{" "}
                                  {
                                    request
                                      .acceptedBy
                                      .email
                                  }
                                </p>
                              )}

                            </div>

                          </div>
                        )}

                        {/* DATE */}

                        <p className="mt-5 text-xs text-gray-400">
                          Created{" "}
                          {new Date(
                            request.createdAt
                          ).toLocaleString()}
                        </p>

                        {/* CANCEL */}

                        {request.status ===
                          "pending" && (

                          <button
                            type="button"
                            onClick={() =>
                              cancelRequest(
                                request._id
                              )
                            }
                            className="mt-5 w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 shadow-[0_4px_0_#e5e5e5] transition-all hover:-translate-y-0.5 hover:border-black hover:shadow-[0_6px_0_#d1d1d1] active:translate-y-[2px]"
                          >
                            Cancel Request
                          </button>

                        )}

                        {request.status ===
                          "cancelled" && (

                          <div className="mt-5 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-sm font-bold text-gray-500">
                            Request cancelled
                          </div>

                        )}

                        {request.status ===
                          "expired" && (

                          <div className="mt-5 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-center text-sm font-bold text-gray-600">
                            No matching NGO accepted
                            this request.
                          </div>

                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <section>

          <div className="mb-6 flex items-end justify-between">

            <div>

              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Updates
              </p>

              <h2 className="text-2xl font-black tracking-tight">
                Notifications
              </h2>

            </div>

            {unreadNotifications >
              0 && (
              <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                {unreadNotifications} unread
              </span>
            )}

          </div>

          {notificationLoading ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Loading notifications...
              </p>
            </div>

          ) : notificationError ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-7">
              <p className="font-semibold text-red-600">
                {
                  notificationError
                }
              </p>
            </div>

          ) : notifications.length ===
            0 ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                No notifications yet.
              </p>
            </div>

          ) : (

            <div className="grid gap-4 lg:grid-cols-2">

              {notifications.map(
                (notification) => (

                  <button
                    key={
                      notification._id
                    }
                    type="button"
                    onClick={() => {
                      if (
                        !notification.read
                      ) {
                        markAsRead(
                          notification._id
                        );
                      }
                    }}
                    className={`w-full rounded-2xl border p-5 text-left transition-all ${
                      notification.read
                        ? "border-gray-200 bg-white"
                        : "border-black bg-gray-50 shadow-[0_5px_0_#d1d1d1]"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                        🔔
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <p className="text-sm font-black capitalize">
                            {
                              notification.type.replaceAll(
                                "_",
                                " "
                              )
                            }
                          </p>

                          {!notification.read && (
                            <span className="rounded-full bg-black px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                              New
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                          {
                            notification.message
                          }
                        </p>

                        <p className="mt-2 text-[11px] text-gray-400">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;