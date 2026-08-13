import HelpRequest from "../models/HelpRequest.js";
import Notification from "../models/Notification.js";

const DISPATCH_INTERVAL_MS = 30 * 1000;

// =====================================================
// SEND CURRENT REQUEST OFFER TO NGO
// =====================================================

export const dispatchToCurrentNGO = async (request) => {
  try {
    // No NGOs left
    if (
      !request.notifiedNGOs ||
      request.dispatchIndex >= request.notifiedNGOs.length
    ) {
      request.currentOfferNGO = null;
      request.offerExpiresAt = null;
      request.status = "expired";

      await request.save();

      console.log(
        `Request ${request._id}: no more NGOs available.`
      );

      return null;
    }

    const currentNGO =
      request.notifiedNGOs[request.dispatchIndex];

    // Current NGO gets 5 minutes
    request.currentOfferNGO = currentNGO;

    request.offerExpiresAt = new Date(
      Date.now() + 45 * 60 * 1000
    );

    await request.save();

    // Notify NGO
    await Notification.create({
      recipient: currentNGO,
      type: "new_help_request",
      message:
        "A new help request is available for your NGO.",
      helpRequest: request._id,
    });

    console.log(
      `Request ${request._id} dispatched to NGO ${currentNGO}.`
    );

    return currentNGO;
  } catch (error) {
    console.error(
      `Dispatch error for request ${request._id}:`,
      error
    );

    throw error;
  }
};

// =====================================================
// MOVE EXPIRED OFFER TO NEXT NGO
// =====================================================

const processExpiredOffers = async () => {
  try {
    const now = new Date();

    const expiredRequests =
      await HelpRequest.find({
        status: "pending",

        currentOfferNGO: {
          $ne: null,
        },

        offerExpiresAt: {
          $lte: now,
        },

        expiresAt: {
          $gt: now,
        },
      });

    for (const request of expiredRequests) {
      try {
        // Move to next NGO
        request.dispatchIndex += 1;

        request.currentOfferNGO = null;
        request.offerExpiresAt = null;

        // No more NGOs
        if (
          request.dispatchIndex >=
          request.notifiedNGOs.length
        ) {
          request.status = "expired";

          await request.save();

          console.log(
            `Request ${request._id} expired: no NGO accepted it.`
          );

          continue;
        }

        // Save current state
        await request.save();

        // Dispatch to next NGO
        await dispatchToCurrentNGO(request);

        console.log(
          `Request ${request._id} moved to next NGO.`
        );
      } catch (error) {
        console.error(
          `Error processing request ${request._id}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error(
      "Request dispatcher error:",
      error
    );
  }
};

// =====================================================
// START WORKER
// =====================================================

export const startRequestDispatcher = () => {
  console.log(
    "HelpGrid request dispatcher started."
  );

  // Run immediately
  processExpiredOffers();

  // Check every 30 seconds
  setInterval(
    processExpiredOffers,
    DISPATCH_INTERVAL_MS
  );
};