import HelpRequest from "../models/HelpRequest.js";
import NGO from "../models/NGO.js";
import Notification from "../models/Notification.js";

// =====================================================
// DISPATCH SETTINGS
// =====================================================

// NGO gets 5 minutes to respond.
// Automatic timeout will be added in the next step.
const DISPATCH_TIMEOUT_MS = 5 * 60 * 1000;

// =====================================================
// DISTANCE HELPER
// =====================================================

const calculateDistanceKm = (
  longitude1,
  latitude1,
  longitude2,
  latitude2
) => {
  const earthRadiusKm = 6371;

  const latitudeDifference =
    ((latitude2 - latitude1) * Math.PI) / 180;

  const longitudeDifference =
    ((longitude2 - longitude1) * Math.PI) / 180;

  const latitude1Rad =
    (latitude1 * Math.PI) / 180;

  const latitude2Rad =
    (latitude2 * Math.PI) / 180;

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(latitude1Rad) *
      Math.cos(latitude2Rad) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
};

// =====================================================
// DISPATCH REQUEST TO CURRENT NGO
// =====================================================
//
// Only ONE NGO gets the active offer.
//
// Example:
//
// notifiedNGOs = [A, B, C]
// dispatchIndex = 0
//
// → NGO A gets request
//
// If A rejects:
//
// dispatchIndex = 1
//
// → NGO B gets request
// =====================================================

const dispatchToCurrentNGO = async (request) => {
  if (
    !request.notifiedNGOs ||
    request.notifiedNGOs.length === 0
  ) {
    request.currentOfferNGO = null;
    request.offerExpiresAt = null;
    request.status = "expired";

    await request.save();

    return null;
  }

  const currentIndex =
    request.dispatchIndex;

  if (
    currentIndex >=
    request.notifiedNGOs.length
  ) {
    request.currentOfferNGO = null;
    request.offerExpiresAt = null;
    request.status = "expired";

    await request.save();

    return null;
  }

  const ngoId =
    request.notifiedNGOs[currentIndex];

  request.currentOfferNGO = ngoId;

  request.offerExpiresAt = new Date(
    Date.now() + DISPATCH_TIMEOUT_MS
  );

  await request.save();

  // Send notification only to the
  // currently selected NGO.
  await Notification.create({
    recipient: ngoId,
    type: "new_help_request",
    message:
      "A new help request is available near your location.",
    helpRequest: request._id,
  });

  return ngoId;
};

// =====================================================
// CREATE HELP REQUEST
// =====================================================

export const createHelpRequest = async (
  req,
  res
) => {
  try {
    // =================================================
    // ONLY USER CAN CREATE REQUEST
    // =================================================

    if (
      !req.user ||
      req.user.role !== "user"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only users can create help requests.",
      });
    }

    const {
      category,
      title,
      description,
      coordinates,
      expiresAt,
    } = req.body;

    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (
      !category ||
      !title ||
      !description ||
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category, title, description and valid coordinates are required.",
      });
    }

    // =================================================
    // VALIDATE COORDINATES
    // =================================================

    const [
      longitude,
      latitude,
    ] = coordinates;

    if (
      typeof longitude !== "number" ||
      typeof latitude !== "number" ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid coordinates.",
      });
    }

    // =================================================
    // EXPIRY
    // =================================================

    const expiryTime = expiresAt
      ? new Date(expiresAt)
      : new Date(
          Date.now() +
            2 * 60 * 60 * 1000
        );

    if (
      isNaN(
        expiryTime.getTime()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid expiry time.",
      });
    }

    if (
      expiryTime <= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Expiry time must be in the future.",
      });
    }

    // =================================================
    // CREATE REQUEST
    // =================================================

    const helpRequest =
      await HelpRequest.create({
        requester: req.user.id,

        category,

        title,

        description,

        location: {
          type: "Point",
          coordinates: [
            longitude,
            latitude,
          ],
        },

        expiresAt:
          expiryTime,

        status: "pending",

        dispatchIndex: 0,
      });

    // =================================================
    // FIND VERIFIED + AVAILABLE NGOs
    // =================================================
    //
    // We first search within 50 KM.
    // Actual NGO serviceRadius is checked
    // below.
    // =================================================

    const nearbyNGOs =
      await NGO.find({
        verificationStatus:
          "verified",

        availability:
          "available",

        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [
                longitude,
                latitude,
              ],
            },

            $maxDistance:
              50000,
          },
        },

        
      }).select(
        "_id name email location categories serviceRadius availability"
      );

    // =================================================
    // SMART MATCHING
    // =================================================

    const matchingNGOs =
      nearbyNGOs
        .map((ngo) => {
          // -------------------------------------------
          // NGO LOCATION
          // -------------------------------------------

          if (
            !ngo.location ||
            !ngo.location.coordinates ||
            ngo.location.coordinates.length !==
              2
          ) {
            return null;
          }

          const [
            ngoLongitude,
            ngoLatitude,
          ] =
            ngo.location.coordinates;

          // -------------------------------------------
          // DISTANCE
          // -------------------------------------------

          const distanceKm =
            calculateDistanceKm(
              longitude,
              latitude,
              ngoLongitude,
              ngoLatitude
            );

          // -------------------------------------------
          // NGO SERVICE RADIUS
          // -------------------------------------------

          const serviceRadius =
            typeof ngo.serviceRadius ===
              "number" &&
            ngo.serviceRadius > 0
              ? ngo.serviceRadius
              : 10;

          if (
            distanceKm >
            serviceRadius
          ) {
            return null;
          }

          // -------------------------------------------
          // CATEGORY
          // -------------------------------------------

          

          // -------------------------------------------
          // SCORE
          // -------------------------------------------

          // -------------------------------------------
// SCORE
// -------------------------------------------

let matchScore = 100;

// Distance based score only.
// Category is NOT used for filtering.
matchScore += Math.max(
  0,
  Math.round(
    30 - distanceKm * 3
  )
);

return {
  ngo,
  distanceKm: Number(
    distanceKm.toFixed(2)
  ),
  matchScore,
};
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.matchScore -
            a.matchScore
        );

    // =================================================
    // SAVE ONLY MATCHED NGOs
    // =================================================

    helpRequest.notifiedNGOs =
      matchingNGOs.map(
        (item) =>
          item.ngo._id
      );

    helpRequest.dispatchIndex = 0;

    await helpRequest.save();

    // =================================================
    // START SEQUENTIAL DISPATCH
    // =================================================
    //
    // Only the FIRST NGO receives the active offer.
    // =================================================

    if (
      matchingNGOs.length > 0
    ) {
      await dispatchToCurrentNGO(
        helpRequest
      );
    } else {
      helpRequest.status =
        "expired";

      await helpRequest.save();
    }

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        matchingNGOs.length > 0
          ? "Help request created and sent to the nearest matching NGO."
          : "Help request created, but no matching NGO is currently available.",

      request: {
        id:
          helpRequest._id,

        category:
          helpRequest.category,

        title:
          helpRequest.title,

        description:
          helpRequest.description,

        status:
          helpRequest.status,

        expiresAt:
          helpRequest.expiresAt,

        currentOfferNGO:
          helpRequest.currentOfferNGO,

        nearbyNGOsMatched:
          matchingNGOs.length,
      },

      matchedNGOs:
        matchingNGOs.map(
          (item) => ({
            id:
              item.ngo._id,

            name:
              item.ngo.name,

            categories:
              item.ngo.categories,

            serviceRadius:
              item.ngo.serviceRadius,

            distanceKm:
              item.distanceKm,

            matchScore:
              item.matchScore,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Create help request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating help request.",
    });
  }
};

// =====================================================
// GET SMART NEARBY REQUESTS
// =====================================================
//
// IMPORTANT:
// NGO should ONLY see a request when
// that NGO is the CURRENT active offer.
//
// This prevents NGO B from seeing a request
// while NGO A is currently handling the offer.
// =====================================================

export const getNearbyRequests = async (
  req,
  res
) => {
  try {
    if (
      !req.user ||
      req.user.role !== "ngo"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only NGOs can view nearby help requests.",
      });
    }

    const ngo =
      await NGO.findById(
        req.user.id
      );

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message:
          "NGO not found.",
      });
    }

    // =================================================
    // VERIFIED CHECK
    // =================================================

    if (
      ngo.verificationStatus !==
      "verified"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your NGO account is not verified.",
      });
    }

    // =================================================
    // AVAILABILITY CHECK
    // =================================================

    if (
      ngo.availability !==
      "available"
    ) {
      return res.status(200).json({
        success: true,
        count: 0,
        requests: [],
        message:
          "Your NGO is currently not available for new requests.",
      });
    }

    // =================================================
    // FIND ACTIVE OFFERS FOR THIS NGO
    // =================================================

    const requests =
      await HelpRequest.find({
        status: "pending",

        currentOfferNGO:
          req.user.id,

        offerExpiresAt: {
          $gt: new Date(),
        },

        expiresAt: {
          $gt: new Date(),
        },
      })
        .populate(
          "requester",
          "name phone"
        )
        .sort({
          createdAt: -1,
        });

    // =================================================
    // ADD DISTANCE
    // =================================================

    const ngoCoordinates =
      ngo.location?.coordinates;

    let formattedRequests =
      requests;

    if (
      Array.isArray(
        ngoCoordinates
      ) &&
      ngoCoordinates.length ===
        2
    ) {
      const [
        ngoLongitude,
        ngoLatitude,
      ] = ngoCoordinates;

      formattedRequests =
        requests.map(
          (request) => {
            const [
              requestLongitude,
              requestLatitude,
            ] =
              request.location
                .coordinates;

            const distanceKm =
              calculateDistanceKm(
                ngoLongitude,
                ngoLatitude,
                requestLongitude,
                requestLatitude
              );

            return {
              ...request.toObject(),

              distanceKm:
                Number(
                  distanceKm.toFixed(
                    2
                  )
                ),

              matchReason:
                "Active offer assigned to your NGO.",
            };
          }
        );
    }

    return res.status(200).json({
      success: true,

      count:
        formattedRequests.length,

      requests:
        formattedRequests,
    });
  } catch (error) {
    console.error(
      "Get nearby requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching nearby help requests.",
    });
  }
};

// =====================================================
// GET MY HELP REQUESTS
// =====================================================

export const getMyRequests = async (
  req,
  res
) => {
  try {
    if (
      !req.user ||
      req.user.role !== "user"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only users can view their help requests.",
      });
    }

    const requests =
      await HelpRequest.find({
        requester:
          req.user.id,
      })
        .populate(
          "acceptedBy",
          "name phone email categories"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count:
        requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get my requests error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching your requests.",
    });
  }
};

// =====================================================
// ACCEPT HELP REQUEST
// =====================================================
//
// ONLY the NGO currently holding the offer
// can accept it.
//
// Atomic query prevents two NGOs from accepting
// the same request simultaneously.
// =====================================================

export const acceptHelpRequest = async (
  req,
  res
) => {
  try {
    if (
      !req.user ||
      req.user.role !== "ngo"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only NGOs can accept help requests.",
      });
    }

    const { id } =
      req.params;

    const request =
      await HelpRequest.findOneAndUpdate(
        {
          _id: id,

          status: "pending",

          currentOfferNGO:
            req.user.id,

          offerExpiresAt: {
            $gt: new Date(),
          },

          expiresAt: {
            $gt: new Date(),
          },
        },
        {
          $set: {
            acceptedBy:
              req.user.id,

            status:
              "accepted",

            currentOfferNGO:
              null,

            offerExpiresAt:
              null,
          },
        },
        {
          new: true,
        }
      );

    if (!request) {
      return res.status(409).json({
        success: false,
        message:
          "This request is no longer available for your NGO.",
      });
    }

    const ngo =
      await NGO.findById(
        req.user.id
      ).select(
        "name phone email"
      );

    // =================================================
    // NOTIFY USER
    // =================================================

    await Notification.create({
      recipient:
        request.requester,

      type:
        "request_accepted",

      message:
        `${ngo.name} accepted your help request.`,

      helpRequest:
        request._id,
    });

    return res.status(200).json({
      success: true,

      message:
        "Help request accepted successfully.",

      request: {
        id:
          request._id,

        status:
          request.status,

        acceptedBy:
          request.acceptedBy,
      },
    });
  } catch (error) {
    console.error(
      "Accept help request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while accepting help request.",
    });
  }
};

// =====================================================
// REJECT HELP REQUEST
// =====================================================
//
// Current NGO rejects.
// Immediately move to next NGO.
//
// Timeout-based automatic movement
// will be added separately.
// =====================================================

export const rejectHelpRequest = async (
  req,
  res
) => {
  try {
    if (
      !req.user ||
      req.user.role !== "ngo"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only NGOs can reject help requests.",
      });
    }

    const { id } =
      req.params;

    const request =
      await HelpRequest.findOne({
        _id: id,

        status: "pending",

        currentOfferNGO:
          req.user.id,
      });

    if (!request) {
      return res.status(409).json({
        success: false,
        message:
          "This request is not currently assigned to your NGO.",
      });
    }

    // =================================================
    // MOVE TO NEXT NGO
    // =================================================

    request.dispatchIndex += 1;

    request.currentOfferNGO =
      null;

    request.offerExpiresAt =
      null;

    await request.save();

    const nextNGO =
      await dispatchToCurrentNGO(
        request
      );

    return res.status(200).json({
      success: true,

      message:
        nextNGO
          ? "Request passed to the next NGO."
          : "No more matching NGOs are available.",

      nextNGO,

      status:
        request.status,
    });
  } catch (error) {
    console.error(
      "Reject help request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while rejecting help request.",
    });
  }
};

// =====================================================
// START HELP REQUEST
// =====================================================

export const startHelpRequest = async (
  req,
  res
) => {
  try {
    if (
      !req.user ||
      req.user.role !== "ngo"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only NGOs can start help requests.",
      });
    }

    const { id } =
      req.params;

    const request =
      await HelpRequest.findById(
        id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Help request not found.",
      });
    }

    // =================================================
    // ONLY ACCEPTED NGO
    // =================================================

    if (
      !request.acceptedBy ||
      request.acceptedBy.toString() !==
        req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the assigned NGO can start this request.",
      });
    }

    if (
      request.status !==
      "accepted"
    ) {
      return res.status(409).json({
        success: false,
        message:
          `Request cannot be started because it is ${request.status}.`,
      });
    }

    // =================================================
    // START
    // =================================================

    request.status =
      "in_progress";

    request.startedAt =
      new Date();

    await request.save();

    const ngo =
      await NGO.findById(
        req.user.id
      ).select("name");

    await Notification.create({
      recipient:
        request.requester,

      type:
        "request_started",

      message:
        `${ngo.name} started working on your help request.`,

      helpRequest:
        request._id,
    });

    return res.status(200).json({
      success: true,

      message:
        "Help request is now in progress.",

      request: {
        id:
          request._id,

        status:
          request.status,

        acceptedBy:
          request.acceptedBy,

        startedAt:
          request.startedAt,
      },
    });
  } catch (error) {
    console.error(
      "Start help request error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while starting help request.",
    });
  }
};

// =====================================================
// COMPLETE HELP REQUEST
// =====================================================

export const completeHelpRequest =
  async (req, res) => {
    try {
      if (
        !req.user ||
        req.user.role !== "ngo"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only NGOs can complete help requests.",
        });
      }

      const { id } =
        req.params;

      const request =
        await HelpRequest.findById(
          id
        );

      if (!request) {
        return res.status(404).json({
          success: false,
          message:
            "Help request not found.",
        });
      }

      // =================================================
      // ONLY ACCEPTED NGO
      // =================================================

      if (
        !request.acceptedBy ||
        request.acceptedBy.toString() !==
          req.user.id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only the assigned NGO can complete this request.",
        });
      }

      if (
        request.status !==
        "in_progress"
      ) {
        return res.status(409).json({
          success: false,
          message:
            `Request cannot be completed because it is ${request.status}.`,
        });
      }

      // =================================================
      // COMPLETE
      // =================================================

      request.status =
        "completed";

      request.completedAt =
        new Date();

      await request.save();

      const ngo =
        await NGO.findById(
          req.user.id
        ).select("name");

      await Notification.create({
        recipient:
          request.requester,

        type:
          "request_completed",

        message:
          `${ngo.name} completed your help request.`,

        helpRequest:
          request._id,
      });

      return res.status(200).json({
        success: true,

        message:
          "Help request completed successfully.",

        request: {
          id:
            request._id,

          status:
            request.status,

          acceptedBy:
            request.acceptedBy,

          startedAt:
            request.startedAt,

          completedAt:
            request.completedAt,
        },
      });
    } catch (error) {
      console.error(
        "Complete help request error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while completing help request.",
      });
    }
  };

// =====================================================
// CANCEL HELP REQUEST
// =====================================================

export const cancelHelpRequest =
  async (req, res) => {
    try {
      if (
        !req.user ||
        req.user.role !== "user"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only users can cancel help requests.",
        });
      }

      const { id } =
        req.params;

      const request =
        await HelpRequest.findById(
          id
        );

      if (!request) {
        return res.status(404).json({
          success: false,
          message:
            "Help request not found.",
        });
      }

      // =================================================
      // ONLY REQUEST OWNER
      // =================================================

      if (
        request.requester.toString() !==
        req.user.id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You can only cancel your own help requests.",
        });
      }

      // =================================================
      // ONLY PENDING
      // =================================================

      if (
        request.status !==
        "pending"
      ) {
        return res.status(409).json({
          success: false,
          message:
            `Request cannot be cancelled because it is ${request.status}.`,
        });
      }

      // =================================================
      // CANCEL
      // =================================================

      request.status =
        "cancelled";

      request.currentOfferNGO =
        null;

      request.offerExpiresAt =
        null;

      await request.save();

      return res.status(200).json({
        success: true,

        message:
          "Help request cancelled successfully.",

        request: {
          id:
            request._id,

          status:
            request.status,
        },
      });
    } catch (error) {
      console.error(
        "Cancel help request error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while cancelling help request.",
      });
    }
  };

// =====================================================
// GET MY ASSIGNED REQUESTS
// =====================================================

export const getMyAssignedRequests =
  async (req, res) => {
    try {
      if (
        !req.user ||
        req.user.role !== "ngo"
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only NGOs can view assigned requests.",
        });
      }

      const requests =
        await HelpRequest.find({
          acceptedBy:
            req.user.id,

          status: {
            $in: [
              "accepted",
              "in_progress",
            ],
          },
        })
          .populate(
            "requester",
            "name phone"
          )
          .sort({
            updatedAt: -1,
          });

      return res.status(200).json({
        success: true,

        count:
          requests.length,

        requests,
      });
    } catch (error) {
      console.error(
        "Get assigned requests error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching assigned requests.",
      });
    }
  };