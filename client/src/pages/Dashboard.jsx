import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard() {
  // =====================================================
  // STATE
  // =====================================================
  const [showNotifications, setShowNotifications] =
  useState(false);

  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] =
    useState([]);

  // =====================================================
  // CHAT STATE
  // =====================================================

  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

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
          `${API_URL}/api/requests`,
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
          `${API_URL}/api/requests/my`,
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
            `${API_URL}/api/notifications`,
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
          `${API_URL}/api/notifications/${notificationId}/read`,
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
  // CHAT HELPERS
  // =====================================================

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return payload.id || payload._id || payload.userId || null;
    } catch {
      return null;
    }
  };

  const getMessageSenderId = (message) => {
    if (!message?.sender) return null;

    if (typeof message.sender === "object") {
      return message.sender._id || message.sender.id || null;
    }

    return message.sender;
  };

  const isSameMessage = (first, second) => {
    if (!first || !second) return false;

    if (
      first._id &&
      second._id &&
      first._id.toString() === second._id.toString()
    ) {
      return true;
    }

    if (
      first.id &&
      second.id &&
      first.id.toString() === second.id.toString()
    ) {
      return true;
    }

    return (
      first.message === second.message &&
      getMessageSenderId(first)?.toString() ===
        getMessageSenderId(second)?.toString() &&
      new Date(first.createdAt || 0).getTime() ===
        new Date(second.createdAt || 0).getTime()
    );
  };

  const openChat = async (request) => {
    if (!request?._id) return;

    try {
      setChatLoading(true);
      setChatError("");
      setMessages([]);
      setActiveChat(request);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You are not logged in.");
      }

      const response = await fetch(
        `${API_URL}/api/chat/${request._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load chat."
        );
      }

      setMessages(data.messages || []);

      const socket = window.helpGridSocket;

      if (socket) {
        socket.emit("join_chat", {
          helpRequestId: request._id,
        });
      }
    } catch (error) {
      console.error("Open chat error:", error);
      setChatError(error.message);
    } finally {
      setChatLoading(false);
    }
  };

  const closeChat = () => {
    const socket = window.helpGridSocket;

    if (socket && activeChat?._id) {
      socket.emit("leave_chat", {
        helpRequestId: activeChat._id,
      });
    }

    setActiveChat(null);
    setMessages([]);
    setMessageText("");
    setChatError("");
  };

  const sendMessage = () => {
    const text = messageText.trim();

    if (!text || !activeChat?._id) {
      return;
    }

    const socket = window.helpGridSocket;

    if (!socket) {
      setChatError(
        "Chat connection is not ready. Please close and reopen the chat."
      );
      return;
    }

    const optimisticMessage = {
      id: `local-${Date.now()}-${Math.random()}`,
      sender: getCurrentUserId(),
      message: text,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    // Show my message immediately.
    setMessages((previous) => [
      ...previous,
      optimisticMessage,
    ]);

    socket.emit("send_message", {
      helpRequestId: activeChat._id,
      message: text,
    });

    setMessageText("");
    setChatError("");
  };

  // =====================================================
  // CHAT SOCKET
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const socket = io(API_URL);

    window.helpGridSocket = socket;

    socket.on("connect", () => {
      socket.emit("authenticate", token);
    });

    socket.on("receive_message", (message) => {
      setMessages((previous) => {
        // Ignore messages for another chat.
        if (
          activeChat?._id &&
          message?.helpRequestId &&
          message.helpRequestId.toString() !==
            activeChat._id.toString()
        ) {
          return previous;
        }

        // Server may echo the same message we added optimistically.
        const optimisticIndex = previous.findIndex(
          (item) =>
            item._optimistic &&
            item.message === message.message &&
            getMessageSenderId(item)?.toString() ===
              getMessageSenderId(message)?.toString()
        );

        if (optimisticIndex !== -1) {
          const updated = [...previous];
          updated[optimisticIndex] = {
            ...message,
            _optimistic: false,
          };
          return updated;
        }

        if (
          previous.some((item) =>
            isSameMessage(item, message)
          )
        ) {
          return previous;
        }

        return [...previous, message];
      });
    });

    socket.on("chat_error", (error) => {
      console.error("Chat error:", error);
      setChatError(
        error?.message || "Unable to send message."
      );
    });

    return () => {
      socket.disconnect();

      if (window.helpGridSocket === socket) {
        window.helpGridSocket = null;
      }
    };
  }, [activeChat?._id]);

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
          `${API_URL}/api/requests/${requestId}/cancel`,
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
         </div>
          {/* STATS */}

          {/* HEADER ACTIONS */}

<div className="flex items-center gap-3">

  {/* NOTIFICATION BELL */}

  <div className="relative">

    <button
      type="button"
      onClick={() =>
        setShowNotifications(
          (previous) => !previous
        )
      }
      className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-gray-200 bg-white text-2xl shadow-[0_5px_0_#e5e5e5] transition hover:-translate-y-0.5 hover:border-black"
    >
      🔔

      {unreadNotifications > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-black text-white">
          {unreadNotifications > 9
            ? "9+"
            : unreadNotifications}
        </span>
      )}
       </button>

    {/* NOTIFICATION DROPDOWN */}

    {showNotifications && (
      <div className="fixed right-5 top-24 z-[9999] w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-950 shadow-[0_15px_40px_rgba(0,0,0,0.15)]">

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

          <div>
            <p className="text-sm font-black">
              Notifications
            </p>

            <p className="mt-0.5 text-xs text-gray-400">
              {unreadNotifications > 0
                ? `${unreadNotifications} unread`
                : "You're all caught up"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowNotifications(false)
            }
            className="text-lg text-gray-400 hover:text-black"
          >
            ✕
          </button>

        </div>

        <div className="max-h-[400px] overflow-y-auto">

          {notificationLoading ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">
                Loading notifications...
              </p>
            </div>
          ) : notificationError ? (
            <div className="p-5">
              <p className="text-sm font-semibold text-red-600">
                {notificationError}
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                🔔
              </div>

              <p className="text-sm font-semibold">
                No notifications
              </p>

              <p className="mt-1 text-xs text-gray-400">
                New updates will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {notifications.map(
                (notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(
                          notification._id
                        );
                      }
                    }}
                    className={`w-full px-5 py-4 text-left transition hover:bg-gray-50 ${
                      notification.read
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >

                    <div className="flex gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-sm text-white">
                        🔔
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">

                          <p className="text-xs font-black capitalize">
                            {notification.type.replaceAll(
                              "_",
                              " "
                            )}
                          </p>

                          {!notification.read && (
                            <span className="rounded-full bg-black px-2 py-0.5 text-[8px] font-bold uppercase text-white">
                              New
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {notification.message}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
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

        </div>

      </div>
    )}

  </div>

  {/* ACTIVE */}

  <div className="min-w-[105px] rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-[0_5px_0_#e5e5e5]">
    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
      Active
    </p>

    <p className="mt-1 text-2xl font-black">
      {activeRequests}
    </p>
  </div>

  {/* COMPLETED */}

  <div className="min-w-[105px] rounded-2xl border border-gray-200 bg-black px-5 py-4 text-white shadow-[0_5px_0_#d1d1d1]">
    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
      Completed
    </p>

    <p className="mt-1 text-2xl font-black">
      {completedRequests}
    </p>
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

                        {/* CHAT */}

                        {request.acceptedBy &&
                          ["accepted", "in_progress"].includes(
                            request.status
                          ) && (
                            <button
                              type="button"
                              onClick={() => openChat(request)}
                              className="mt-5 w-full rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white shadow-[0_5px_0_#cfcfcf] transition-all hover:-translate-y-0.5 hover:bg-gray-800 active:translate-y-[2px]"
                            >
                              💬 Chat with NGO
                            </button>
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

        

                   


        {/* =================================================
            CHAT MODAL
        ================================================= */}

        {activeChat && (
          <div className="fixed inset-0 z-[10000] flex items-end justify-end bg-black/20 p-4 sm:p-6">
            <div className="flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

              {/* HEADER */}
              <div className="flex items-center justify-between bg-black px-5 py-4 text-white">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    HelpGrid Chat
                  </p>

                  <h3 className="mt-1 truncate text-lg font-black">
                    {activeChat.acceptedBy?.name || "NGO"}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeChat}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
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
                  messages.map((message) => {
                    const myId = getCurrentUserId();
                    const senderId = getMessageSenderId(message);

                    const isMine =
                      senderId?.toString() ===
                      myId?.toString();

                    return (
                      <div
                        key={
                          message._id ||
                          message.id ||
                          `${message.createdAt}-${message.message}`
                        }
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
                  })
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
                    setMessageText(event.target.value)
                  }
                  placeholder="Type a message..."
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-black"
                />

                <button
                  type="submit"
                  disabled={!messageText.trim()}
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
export default Dashboard;