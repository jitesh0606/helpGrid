import jwt from "jsonwebtoken";
import HelpRequest from "../models/HelpRequest.js";
import Message from "../models/Message.js";
export const setupChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.id}`
    );

    // =====================================================
    // AUTHENTICATE SOCKET
    // =====================================================

    socket.on("authenticate", async (token) => {
      try {
        if (!token) {
          socket.emit("chat_error", {
            message: "Authentication required.",
          });

          return;
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );

        socket.user = decoded;

        socket.emit("authenticated", {
          success: true,
          userId: decoded.id,
          role: decoded.role,
        });

        console.log(
          `Socket authenticated: ${decoded.id}`
        );
      } catch (error) {
        console.error(
          "Socket authentication error:",
          error.message
        );

        socket.emit("chat_error", {
          message: "Invalid or expired token.",
        });
      }
    });

    // =====================================================
    // JOIN HELP REQUEST CHAT
    // =====================================================

    socket.on(
      "join_chat",
      async ({ helpRequestId }) => {
        try {
          if (!socket.user) {
            socket.emit("chat_error", {
              message:
                "Please authenticate first.",
            });

            return;
          }

          if (!helpRequestId) {
            socket.emit("chat_error", {
              message:
                "Help request ID is required.",
            });

            return;
          }

          const request =
            await HelpRequest.findById(
              helpRequestId
            ).select(
              "requester acceptedBy status"
            );

          if (!request) {
            socket.emit("chat_error", {
              message:
                "Help request not found.",
            });

            return;
          }

          // =================================================
          // CHAT ONLY AFTER ACCEPTANCE
          // =================================================

          if (
            request.status !==
            "accepted"
          ) {
            socket.emit("chat_error", {
              message:
                "Chat is available only after the request is accepted.",
            });

            return;
          }

          const userId =
            socket.user.id.toString();

          const requesterId =
            request.requester.toString();

          const acceptedNGOId =
            request.acceptedBy?.toString();

          // =================================================
          // ONLY REQUESTER OR ACCEPTED NGO
          // =================================================

          if (
            userId !== requesterId &&
            userId !== acceptedNGOId
          ) {
            socket.emit("chat_error", {
              message:
                "You are not authorized to access this chat.",
            });

            return;
          }

          const roomId =
            `help_${helpRequestId}`;

          socket.join(roomId);

          socket.emit("chat_joined", {
            success: true,
            roomId,
            helpRequestId,
          });

          console.log(
            `User ${userId} joined chat ${roomId}`
          );
        } catch (error) {
          console.error(
            "Join chat error:",
            error
          );

          socket.emit("chat_error", {
            message:
              "Unable to join chat.",
          });
        }
      }
    );

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    socket.on(
      "send_message",
      async ({
        helpRequestId,
        message,
      }) => {
        try {
          if (!socket.user) {
            socket.emit("chat_error", {
              message:
                "Please authenticate first.",
            });

            return;
          }

          if (
            !helpRequestId ||
            !message ||
            !message.trim()
          ) {
            socket.emit("chat_error", {
              message:
                "Help request ID and message are required.",
            });

            return;
          }

          const request =
            await HelpRequest.findById(
              helpRequestId
            ).select(
              "requester acceptedBy status"
            );

          if (!request) {
            socket.emit("chat_error", {
              message:
                "Help request not found.",
            });

            return;
          }

          // Chat only after acceptance
          if (
            request.status !==
              "accepted" &&
            request.status !==
              "in_progress"
          ) {
            socket.emit("chat_error", {
              message:
                "Chat is not available for this request.",
            });

            return;
          }

          const userId =
            socket.user.id.toString();

          const requesterId =
            request.requester.toString();

          const acceptedNGOId =
            request.acceptedBy?.toString();

          // Only requester and accepted NGO
          if (
            userId !== requesterId &&
            userId !== acceptedNGOId
          ) {
            socket.emit("chat_error", {
              message:
                "You are not authorized to send messages.",
            });

            return;
          }

          const roomId =
            `help_${helpRequestId}`;

          const savedMessage =
  await Message.create({
    helpRequest:
      helpRequestId,

    sender:
      userId,

    senderRole:
      socket.user.role,

    message:
      message.trim(),
  });

const messageData = {
  id: savedMessage._id,

  senderId:
    savedMessage.sender,

  senderRole:
    savedMessage.senderRole,

  message:
    savedMessage.message,

  helpRequestId,

  createdAt:
    savedMessage.createdAt,
};
          // Send to everyone in this request's room
          io.to(roomId).emit(
            "receive_message",
            messageData
          );

          console.log(
            `Message sent in ${roomId} by ${userId}`
          );
        } catch (error) {
          console.error(
            "Send message error:",
            error
          );

          socket.emit("chat_error", {
            message:
              "Unable to send message.",
          });
        }
      }
    );

    // =====================================================
    // LEAVE CHAT
    // =====================================================

    socket.on(
      "leave_chat",
      ({ helpRequestId }) => {
        if (!helpRequestId) {
          return;
        }

        const roomId =
          `help_${helpRequestId}`;

        socket.leave(roomId);

        console.log(
          `Socket ${socket.id} left ${roomId}`
        );
      }
    );

    // =====================================================
    // DISCONNECT
    // =====================================================

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected: ${socket.id}`
      );
    });
  });
};