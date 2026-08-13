import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // User who will receive the notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification type
    type: {
  type: String,
  enum: [
    "new_help_request",
    "request_accepted",
    "request_started",
    "request_completed",
    "request_cancelled",
    "request_expired",
  ],
  required: true,
},

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // Related help request
    helpRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelpRequest",
      default: null,
    },

    // Whether user has read it
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Fast lookup for user's notifications
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;