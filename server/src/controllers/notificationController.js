import Notification from "../models/Notification.js";

// =========================
// GET MY NOTIFICATIONS
// =========================

export const getMyNotifications = async (req, res) => {
  try {
    // Only users can access their notifications
    if (!req.user || req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can view notifications.",
      });
    }

    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("helpRequest", "title category status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching notifications.",
    });
  }
};
// =========================
// MARK NOTIFICATION AS READ
// =========================

export const markNotificationAsRead = async (req, res) => {
  try {
    // Only users can mark notifications as read
    if (!req.user || req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can update notifications.",
      });
    }

    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    // Make sure notification belongs to logged-in user
    if (
      notification.recipient.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this notification.",
      });
    }

    notification.read = true;

    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification: {
        id: notification._id,
        read: notification.read,
      },
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating notification.",
    });
  }
};
// =========================
// MARK NOTIFICATION AS READ
// =========================

