import Message from "../models/Message.js";
import HelpRequest from "../models/HelpRequest.js";

export const getChatMessages = async (
  req,
  res
) => {
  try {
    const { helpRequestId } =
      req.params;

    if (
      !req.user ||
      !helpRequestId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid chat request.",
      });
    }

    const request =
      await HelpRequest.findById(
        helpRequestId
      ).select(
        "requester acceptedBy status"
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Help request not found.",
      });
    }

    // =================================================
    // CHAT ONLY AFTER ACCEPTANCE
    // =================================================

    if (
      request.status !== "accepted" &&
      request.status !== "in_progress"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Chat is available only after the request is accepted.",
      });
    }

    const userId =
      req.user.id.toString();

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
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this chat.",
      });
    }

    const messages =
      await Message.find({
        helpRequest:
          helpRequestId,
      })
        .sort({
          createdAt: 1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "Get chat messages error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching chat.",
    });
  }
};