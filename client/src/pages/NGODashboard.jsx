import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function NGODashboard() {
  const [requests, setRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);

  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [nearbyError, setNearbyError] = useState("");
  const [nearbyRadius, setNearbyRadius] = useState(10);
  const [showNearbyNGOs, setShowNearbyNGOs] = useState(false);

  const [loading, setLoading] = useState(true);
  const [assignedLoading, setAssignedLoading] = useState(true);

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const [error, setError] = useState("");
  const [assignedError, setAssignedError] = useState("");

// =====================================================
// FETCH NEARBY ACTIVE OFFERS
// =====================================================

const fetchNearbyRequests = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const response = await fetch(
      `${API_URL}/api/requests/nearby`,
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
        data.message ||
          "Failed to fetch nearby requests."
      );
    }

    setRequests(data.requests || []);
    setError("");
  } catch (error) {
    console.error(
      "Nearby requests error:",
      error
    );

    setError(error.message);
  } finally {
    setLoading(false);
  }
};

// =====================================================
// FETCH ASSIGNED REQUESTS
// =====================================================

const fetchAssignedRequests = async () => {
  try {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setAssignedError(
        "You are not logged in."
      );

      setAssignedLoading(false);
      return;
    }

    const response = await fetch(
      `${API_URL}/api/requests/assigned`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch assigned requests."
      );
    }

    setAssignedRequests(
      data.requests || []
    );

    setAssignedError("");
  } catch (error) {
    console.error(
      "Assigned requests error:",
      error
    );

    setAssignedError(
      error.message
    );
  } finally {
    setAssignedLoading(false);
  }
};

// =====================================================
// FIND NEARBY VERIFIED NGOs
// =====================================================

const fetchNearbyNGOs = async () => {
  try {
    setNearbyLoading(true);
    setNearbyError("");
    setShowNearbyNGOs(true);

    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "You are not logged in."
      );
    }

    const response = await fetch(
      `${API_URL}/api/ngos/nearby?radius=${nearbyRadius}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to find nearby NGOs."
      );
    }

    setNearbyNGOs(
      data.ngos || []
    );
  } catch (error) {
    console.error(
      "Nearby NGOs error:",
      error
    );

    setNearbyError(
      error.message
    );

    setNearbyNGOs([]);
  } finally {
    setNearbyLoading(false);
  }
};

// =====================================================
// ACCEPT REQUEST
// =====================================================

const acceptRequest = async (
  requestId
) => {
  try {
    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        `${API_URL}/api/requests/${requestId}/accept`,
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
          "Failed to accept request."
      );
    }

    setRequests(
      (prevRequests) =>
        prevRequests.filter(
          (request) =>
            request._id !==
            requestId
        )
    );

    await fetchAssignedRequests();

    alert(
      "Help request accepted successfully."
    );
  } catch (error) {
    console.error(
      "Accept request error:",
      error
    );

    alert(error.message);

    await fetchNearbyRequests();
  }
};

// =====================================================
// REJECT REQUEST
// =====================================================

const rejectRequest = async (
  requestId
) => {
  try {
    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        `${API_URL}/api/requests/${requestId}/reject`,
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
          "Failed to reject request."
      );
    }

    setRequests(
      (prevRequests) =>
        prevRequests.filter(
          (request) =>
            request._id !==
            requestId
        )
    );

    await fetchNearbyRequests();
  } catch (error) {
    console.error(
      "Reject request error:",
      error
    );

    alert(error.message);

    await fetchNearbyRequests();
  }
};

// =====================================================
// START REQUEST
// =====================================================

const startRequest = async (
  requestId
) => {
  try {
    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        `${API_URL}/api/requests/${requestId}/start`,
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
          "Failed to start request."
      );
    }

    setAssignedRequests(
      (prevRequests) =>
        prevRequests.map(
          (request) =>
            request._id ===
            requestId
              ? {
                  ...request,
                  status:
                    "in_progress",
                  startedAt:
                    data.request
                      ?.startedAt,
                }
              : request
        )
    );

    alert(
      "Help request is now in progress."
    );
  } catch (error) {
    console.error(
      "Start request error:",
      error
    );

    alert(error.message);
  }
};

// =====================================================
// COMPLETE REQUEST
// =====================================================

const completeRequest = async (
  requestId
) => {
  try {
    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        `${API_URL}/api/requests/${requestId}/complete`,
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
          "Failed to complete request."
      );
    }

    setAssignedRequests(
      (prevRequests) =>
        prevRequests.map(
          (request) =>
            request._id ===
            requestId
              ? {
                  ...request,
                  status:
                    "completed",
                  completedAt:
                    data.request
                      ?.completedAt,
                }
              : request
        )
    );

    alert(
      "Help request completed successfully."
    );
  } catch (error) {
    console.error(
      "Complete request error:",
      error
    );

    alert(error.message);
  }
};

// =====================================================
// OPEN CHAT
// =====================================================

const openChat = async (
  request
) => {
  try {
    setChatLoading(true);
    setChatError("");
    setMessages([]);
    setActiveChat(request);

    const token =
      localStorage.getItem("token");

    // =========================
    // LOAD CHAT HISTORY
    // =========================

    const response =
      await fetch(
        `${API_URL}/api/chat/${request._id}`,
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
          "Failed to load chat."
      );
    }

    setMessages(
      data.messages || []
    );

    const socket =
      window.helpGridSocket;

    if (socket) {
      socket.emit(
        "join_chat",
        {
          helpRequestId:
            request._id,
        }
      );
    }
  } catch (error) {
    console.error(
      "Open chat error:",
      error
    );

    setChatError(
      error.message
    );
  } finally {
    setChatLoading(false);
  }
};

// =====================================================
// GET CURRENT USER ID
// =====================================================

const getCurrentUserId = () => {
  try {
    const token =
      localStorage.getItem("token");

    if (!token) return null;

    const payload =
      JSON.parse(
        atob(token.split(".")[1])
      );

    return (
      payload.id ||
      payload._id ||
      payload.userId ||
      null
    );
  } catch (error) {
    console.error(
      "Token decode error:",
      error
    );

    return null;
  }
};

// =====================================================
// GET SENDER ID
// =====================================================

const getSenderId = (
  message
) => {
  if (!message?.sender)
    return null;

  if (
    typeof message.sender ===
    "string"
  ) {
    return message.sender;
  }

  return (
    message.sender._id ||
    message.sender.id ||
    message.sender.userId ||
    null
  );
};

// =====================================================
// SEND MESSAGE
// =====================================================

const sendMessage = () => {
  const text =
    messageText.trim();

  if (!text || !activeChat) {
    return;
  }

  const socket =
    window.helpGridSocket;

  if (
    !socket ||
    !socket.connected
  ) {
    setChatError(
      "Chat connection is not ready. Please try again."
    );

    return;
  }

  const currentUserId =
    getCurrentUserId();

  const optimisticMessage = {
    _id: `local-${Date.now()}-${Math.random()}`,
    sender:
      currentUserId,
    message: text,
    createdAt:
      new Date().toISOString(),
    optimistic: true,
  };

  setMessages(
    (previous) => [
      ...previous,
      optimisticMessage,
    ]
  );

  socket.emit(
    "send_message",
    {
      helpRequestId:
        activeChat._id,
      message: text,
    }
  );

  setMessageText("");
};

// =====================================================
// CHAT SOCKET
// =====================================================

useEffect(() => {
  const token =
    localStorage.getItem("token");

  if (!token) {
    return;
  }

  const socket =
    io(API_URL);

  window.helpGridSocket =
    socket;

  socket.on(
    "connect",
    () => {
      socket.emit(
        "authenticate",
        token
      );
    }
  );

  socket.on(
    "receive_message",
    (message) => {
      setMessages(
        (previous) => [
          ...previous,
          message,
        ]
      );
    }
  );

  socket.on(
    "chat_error",
    (error) => {
      console.error(
        "Chat error:",
        error
      );

      setChatError(
        error?.message ||
          "Unable to send message."
      );
    }
  );

  return () => {
    socket.disconnect();

    if (
      window.helpGridSocket ===
      socket
    ) {
      window.helpGridSocket =
        null;
    }
  };
}, []);
  // =====================================================
  // INITIAL LOAD + AUTO REFRESH
  // =====================================================

  useEffect(() => {
    fetchNearbyRequests();
    fetchAssignedRequests();

    // Check every 10 seconds.
    //
    // This is NOT the server-side timeout.
    // The backend worker handles timeout.
    // This only refreshes the dashboard UI.
    const refreshInterval =
      setInterval(() => {
        fetchNearbyRequests();
        fetchAssignedRequests();
      }, 10000);

    return () => {
      clearInterval(
        refreshInterval
      );
    };
  }, []);

  // =====================================================
  // COUNTDOWN REFRESH
  // =====================================================

  const [, setCurrentTime] =
    useState(Date.now());

  useEffect(() => {
    const timer =
      setInterval(() => {
        setCurrentTime(
          Date.now()
        );
      }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // =====================================================
  // TIME LEFT
  // =====================================================

  const getTimeLeft = (
    expiresAt
  ) => {
    if (!expiresAt) {
      return "—";
    }

    const difference =
      new Date(
        expiresAt
      ).getTime() -
      Date.now();

    if (difference <= 0) {
      return "Expired";
    }

    const totalSeconds =
      Math.floor(
        difference / 1000
      );

    const minutes =
      Math.floor(
        totalSeconds / 60
      );

    const seconds =
      totalSeconds % 60;

    return `${String(
      minutes
    ).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "pending":
        return "border-gray-300 bg-gray-100 text-gray-700";

      case "accepted":
        return "border-black bg-black text-white";

      case "in_progress":
        return "border-gray-700 bg-gray-800 text-white";

      case "completed":
        return "border-gray-400 bg-white text-gray-900";

      default:
        return "border-gray-300 bg-gray-100 text-gray-700";
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
            Loading NGO dashboard...
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

      {/* Background depth */}

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
              NGO Portal
            </div>

            <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              HelpGrid
              <span className="text-gray-400">
                .
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-gray-500">
              Find nearby people who need
              help and manage requests your
              organization has accepted.
            </p>

          </div>
          
          {/* Stats */}

          <div className="flex gap-3">

            <div className="min-w-[105px] rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_5px_0_#e5e5e5]">

              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Offers
              </p>

              <p className="mt-1 text-2xl font-black">
                {requests.length}
              </p>

            </div>

            <div className="min-w-[105px] rounded-2xl border border-gray-200 bg-black px-5 py-4 text-white shadow-[0_5px_0_#d1d1d1]">

              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Assigned
              </p>

              <p className="mt-1 text-2xl font-black">
                {assignedRequests.length}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            FIND NEARBY NGOs
        ================================================= */}

        <section className="mb-14">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_8px_0_#e5e5e5] sm:p-7">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
               <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Local Network
                </p>

                <h2 className="text-2xl font-black tracking-tight">
                  Find NGOs Near You
                </h2>

                <p className="mt-1 max-w-xl text-sm text-gray-500">
                  Discover verified and currently available NGOs around your location.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                <select
                  value={nearbyRadius}
                  onChange={(event) =>
                    setNearbyRadius(
                      Number(event.target.value)
                            )
                  }
                  className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-black"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>

                <button
                  type="button"
                  onClick={fetchNearbyNGOs}
                  disabled={nearbyLoading}
                  className="rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all hover:-translate-y-0.5 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {nearbyLoading
                    ? "Finding..."
                    : "📍 Find Nearby NGOs"}
                </button>

              </div>
            </div>

            {showNearbyNGOs && (
              <div className="mt-7 border-t border-gray-100 pt-6">

                {nearbyError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm font-semibold text-red-600">
                      {nearbyError}
                    </p>
                  </div>
                ) : nearbyLoading ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                    <p className="text-sm text-gray-500">
                      Finding verified NGOs nearby...
                    </p>
                  </div>
                ) : nearbyNGOs.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                      📍
                    </div>

                    <h3 className="font-bold">
                      No nearby NGOs found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                      Try increasing the search radius or check again later.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-600">
                        {nearbyNGOs.length} verified NGO
                        {nearbyNGOs.length !== 1
                          ? "s"
                          : ""}{" "}
                        found
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setShowNearbyNGOs(false)
                        }
                        className="text-xs font-bold text-gray-400 hover:text-black"
                      >
                        Hide
                      </button>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      {nearbyNGOs.map((ngo) => (
                        <div
                          key={ngo.id}
                          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-black"
                        >
                          <div className="flex items-start justify-between gap-4">

                            <div>
                              <h3 className="text-lg font-black">
                                {ngo.name}
                              </h3>

                              <p className="mt-1 text-xs text-gray-400">
                                {ngo.city ||
                                  ngo.officialAddress ||
                                  "Location available"}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase text-gray-600">
                              🟢 Available
                            </span>

                          </div>

                          <div className="mt-4 inline-flex rounded-xl bg-black px-3 py-2 text-xs font-bold text-white">
                            📍 {ngo.distanceKm} km away
                          </div>

                          {ngo.description && (
                            <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">
                              {ngo.description}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {(ngo.categories || []).map(
                              (category) => (
                                <span
                                  key={category}
                                  className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600"
                                >
                                  {category}
                                </span>
                              )
                            )}
                          </div>

                          <div className="mt-5 grid gap-2 sm:grid-cols-2">
                            {ngo.phone && (
                              <a
                                href={`tel:${ngo.phone}`}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-700 hover:border-black"
                              >
                                📞 Call NGO
                              </a>
                            )}

                            {ngo.email && (
                              <a
                                href={`mailto:${ngo.email}`}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs font-bold text-gray-700 hover:border-black"
                              >
                                ✉️ Email NGO
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </section>

        {/* =================================================
            ACTIVE OFFERS
        ================================================= */}

        <section className="mb-14">

          <div className="mb-6 flex items-end justify-between">

            <div>

              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Incoming
              </p>

              <h2 className="text-2xl font-black tracking-tight">
                Help Requests For You
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These requests are currently
                assigned to your NGO.
              </p>

            </div>

            {requests.length > 0 && (
              <span className="hidden rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-600 sm:block">
                {requests.length} active offer
                {requests.length !== 1
                  ? "s"
                  : ""}
              </span>
            )}

          </div>

          {error ? (

            <div className="rounded-3xl border border-gray-300 bg-white p-7 shadow-sm">
              <p className="font-semibold text-red-600">
                {error}
              </p>
            </div>

          ) : requests.length === 0 ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-[0_6px_0_#d1d1d1]">
                ✓
              </div>

              <h3 className="text-xl font-bold">
                No active requests
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                There are currently no help
                requests assigned to your NGO.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2">

              {requests.map(
                (request) => {

                  const timeLeft =
                    getTimeLeft(
                      request.offerExpiresAt
                    );

                  const expired =
                    timeLeft ===
                    "Expired";

                  return (
                    <div
                      key={
                        request._id
                      }
                      className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_0_#e5e5e5] transition-all duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-[0_14px_0_#d4d4d4]"
                    >

                      {/* Top accent */}

                      <div className="h-1.5 bg-black" />

                      <div className="p-6">

                        {/* Header */}

                        <div className="mb-5 flex items-start justify-between gap-4">

                          <div className="flex flex-wrap gap-2">

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600">
                              {
                                request.category
                              }
                            </span>

                            <span className="rounded-full border border-black bg-black px-3 py-1 text-[11px] font-bold capitalize text-white">
                              Active Offer
                            </span>

                          </div>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg shadow-[0_3px_0_#d4d4d4]">
                            🤝
                          </div>

                        </div>

                        {/* Title */}

                        <h3 className="text-xl font-black tracking-tight text-gray-950">
                          {
                            request.title
                          }
                        </h3>

                        <p className="mt-3 leading-6 text-gray-500">
                          {
                            request.description
                          }
                        </p>

                        {/* Distance */}

                        {request.distanceKm !==
                          undefined && (
                          <div className="mt-4 inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600">
                            📍{" "}
                            {
                              request.distanceKm
                            }{" "}
                            km away
                          </div>
                        )}

                        {/* Requester */}

                        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">

                          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                            Requester
                          </p>

                          <div className="grid gap-3 sm:grid-cols-2">

                            <div>
                              <p className="text-xs text-gray-400">
                                Name
                              </p>

                              <p className="mt-1 font-semibold">
                                {
                                  request
                                    .requester
                                    ?.name ||
                                  "Not available"
                                }
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Phone
                              </p>

                              <p className="mt-1 font-semibold">
                                {
                                  request
                                    .requester
                                    ?.phone ||
                                  "Not available"
                                }
                              </p>
                            </div>

                          </div>

                        </div>

                        {/* =================================================
                            OFFER COUNTDOWN
                        ================================================= */}

                        <div className="mt-5 rounded-2xl border border-gray-200 bg-black p-4 text-white shadow-[0_5px_0_#d1d1d1]">

                          <div className="flex items-center justify-between">

                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                                Response Time
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                Accept or reject
                                this offer
                              </p>
                            </div>

                            <div className="text-right">

                              <p className="text-2xl font-black tabular-nums">
                                {timeLeft}
                              </p>

                              <p className="text-[10px] font-semibold uppercase text-gray-400">
                                remaining
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">

                          <button
                            type="button"
                            disabled={
                              expired
                            }
                            onClick={() =>
                              acceptRequest(
                                request._id
                              )
                            }
                            className="rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-[0_7px_0_#bdbdbd] active:translate-y-[3px] active:shadow-[0_2px_0_#bdbdbd] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Accept Request →
                          </button>

                          <button
                            type="button"
                            disabled={
                              expired
                            }
                            onClick={() =>
                              rejectRequest(
                                request._id
                              )
                            }
                            className="rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold text-gray-900 shadow-[0_5px_0_#d1d1d1] transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:shadow-[0_7px_0_#bdbdbd] active:translate-y-[3px] active:shadow-[0_2px_0_#bdbdbd] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Reject & Pass →
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* =================================================
            ASSIGNED REQUESTS
        ================================================= */}

        <section>

          <div className="mb-6">

            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Your Work
            </p>

            <h2 className="text-2xl font-black tracking-tight">
              My Assigned Requests
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage requests accepted by
              your organization.
            </p>

          </div>

          {assignedLoading ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">
                Loading assigned requests...
              </p>
            </div>

          ) : assignedError ? (

            <div className="rounded-3xl border border-gray-300 bg-white p-7">
              <p className="font-semibold text-red-600">
                {assignedError}
              </p>
            </div>

          ) : assignedRequests.length ===
            0 ? (

            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-300 bg-white text-2xl shadow-[0_5px_0_#d1d1d1]">
                📋
              </div>

              <h3 className="text-xl font-bold">
                No assigned requests
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Accept a help request and it
                will appear here.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 lg:grid-cols-2">

              {assignedRequests.map(
                (request) => (

                  <div
                    key={
                      request._id
                    }
                    className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_8px_0_#e5e5e5] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_0_#d4d4d4]"
                  >

                    <div
                      className={`h-1.5 ${
                        request.status ===
                        "completed"
                          ? "bg-gray-400"
                          : request.status ===
                            "in_progress"
                          ? "bg-gray-700"
                          : "bg-black"
                      }`}
                    />

                    <div className="p-6">

                      {/* Header */}

                      <div className="mb-5 flex items-start justify-between gap-4">

                        <div>

                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold capitalize ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status.replace(
                              "_",
                              " "
                            )}
                          </span>

                          <h3 className="mt-3 text-xl font-black tracking-tight">
                            {
                              request.title
                            }
                          </h3>

                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-[0_4px_0_#cfcfcf]">
                          {request.status ===
                          "completed"
                            ? "✓"
                            : "→"}
                        </div>

                      </div>

                      {/* Details */}

                      <div className="space-y-3 text-sm">

                        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">

                          <span className="text-gray-400">
                            Category
                          </span>

                          <span className="font-semibold capitalize">
                            {
                              request.category
                            }
                          </span>

                        </div>

                        <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">

                          <span className="text-gray-400">
                            Requester
                          </span>

                          <span className="font-semibold">
                            {
                              request
                                .requester
                                ?.name
                            }
                          </span>

                        </div>

                        <div className="flex justify-between gap-4">

                          <span className="text-gray-400">
                            Phone
                          </span>

                          <span className="font-semibold">
                            {
                              request
                                .requester
                                ?.phone
                            }
                          </span>

                        </div>

                      </div>

                      {/* Description */}

                      <div className="mt-5 rounded-2xl bg-gray-50 p-4">

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Description
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {
                            request.description
                          }
                        </p>

                      </div>

                      {/* START */}

                      {request.status === "accepted" && (
  <div className="mt-6 space-y-3">

    <button
      onClick={() =>
        openChat(request)
      }
      className="w-full rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold text-gray-900 shadow-[0_4px_0_#e5e5e5] transition-all hover:-translate-y-0.5 hover:border-black"
    >
      💬 Chat with User
    </button>

    <button
      onClick={() =>
        startRequest(
          request._id
        )
      }
      className="w-full rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
    >
      Start Request →
    </button>

  </div>
)}
                          

                      {/* IN PROGRESS */}

                      {request.status ===
                        "in_progress" && (

                        <div className="mt-6">

                          <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">

                            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-black" />

                            <p className="text-sm font-semibold text-gray-700">
                              Request is in progress
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              openChat(request)
                            }
                            className="mb-3 w-full rounded-xl border border-gray-300 bg-white px-5 py-3.5 text-sm font-bold text-gray-900 shadow-[0_4px_0_#e5e5e5] transition-all hover:-translate-y-0.5 hover:border-black"
                          >
                            💬 Chat with User
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              completeRequest(
                                request._id
                              )
                            }
                            className="w-full rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-[0_7px_0_#bdbdbd] active:translate-y-[3px] active:shadow-[0_2px_0_#bdbdbd]"
                          >
                            Complete Request ✓
                          </button>

                        </div>

                      )}

                      {/* COMPLETED */}

                      {request.status ===
                        "completed" && (

                        <div className="mt-6 rounded-xl border border-gray-300 bg-black px-4 py-3 text-center text-sm font-bold text-white shadow-[0_4px_0_#cfcfcf]">
                          ✓ Request completed
                          successfully
                        </div>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </section>
      {activeChat && (
  <div className="fixed inset-0 z-[100] flex items-end justify-end bg-black/20 p-4 sm:p-6">

    <div className="flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.2)]">

      {/* HEADER */}

      <div className="flex items-center justify-between bg-black px-5 py-4 text-white">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            HelpGrid Chat
          </p>

          <h3 className="mt-1 text-lg font-black">
            {activeChat.requester?.name ||
              "User"}
          </h3>
        </div>

        <button
          onClick={() => {
            const socket =
              window.helpGridSocket;

            if (socket) {
              socket.emit(
                "leave_chat",
                {
                  helpRequestId:
                    activeChat._id,
                }
              );
            }

            setActiveChat(null);
            setMessages([]);
            setMessageText("");
            setChatError("");
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
        >
          ✕
        </button>

      </div>

      {/* MESSAGES */}

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">

        {chatLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">
              Loading chat...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                💬
              </div>

              <p className="text-sm font-semibold text-gray-700">
                No messages yet
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Start the conversation.
              </p>
            </div>
          </div>
        ) : (
          messages.map(
            (message) => {
              const myId = getCurrentUserId();
              const senderId = getSenderId(message);

              const isMine =
                senderId &&
                myId &&
                String(senderId) === String(myId);

              return (
                <div
                  key={message.id || message._id}
                  className={`flex ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      isMine
                        ? "rounded-br-md bg-black text-white"
                        : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              );
            }
          )
        )}

      </div>

      {/* ERROR */}

      {chatError && (
        <div className="border-t border-red-100 bg-red-50 px-4 py-2">
          <p className="text-xs font-semibold text-red-600">
            {chatError}
          </p>
        </div>
      )}

      {/* INPUT */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
        className="flex gap-2 border-t border-gray-200 bg-white p-4"
      >

        <input
          value={messageText}
          onChange={(event) =>
            setMessageText(
              event.target.value
            )
          }
          placeholder="Type a message..."
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
        />

        <button
          type="submit"
          disabled={
            !messageText.trim()
          }
          className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send
        </button>

      </form>

    </div>

  </div>
)}
      </main>

    </div>
  );

}
export default NGODashboard;