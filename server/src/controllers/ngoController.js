import NGO from "../models/NGO.js";

// =====================================================
// GET NEARBY VERIFIED NGOs
// =====================================================

export const getNearbyNGOs = async (
  req,
  res
) => {
  try {
    // =================================================
    // ONLY NGO CAN ACCESS
    // =================================================

    if (
      !req.user ||
      req.user.role !== "ngo"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only NGOs can find nearby NGOs.",
      });
    }

    // =================================================
    // CURRENT NGO
    // =================================================

    const currentNGO =
      await NGO.findById(req.user.id);

    if (!currentNGO) {
      return res.status(404).json({
        success: false,
        message: "NGO not found.",
      });
    }

    // =================================================
    // VERIFICATION
    // =================================================

    if (
      currentNGO.verificationStatus !==
      "verified"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your NGO account is not verified.",
      });
    }

    // =================================================
    // LOCATION
    // =================================================

    if (
      !currentNGO.location ||
      !currentNGO.location.coordinates ||
      currentNGO.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Your NGO location is not available.",
      });
    }

    const [
      longitude,
      latitude,
    ] = currentNGO.location.coordinates;

    // =================================================
    // SEARCH RADIUS
    // =================================================

    const requestedRadius =
      Number(req.query.radius);

    const radiusKm =
      Number.isFinite(
        requestedRadius
      ) &&
      requestedRadius > 0
        ? Math.min(
            requestedRadius,
            50
          )
        : 10;

    const maxDistanceMeters =
      radiusKm * 1000;

    // =================================================
    // FIND NEARBY NGOS
    // =================================================

    const nearbyNGOs =
      await NGO.find({
        _id: {
          $ne: currentNGO._id,
        },

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
              maxDistanceMeters,
          },
        },
      })
        .select(
          "name email phone description categories location serviceRadius availability pickupAvailable volunteerCount city officialAddress website"
        )
        .limit(50);

    // =================================================
    // CALCULATE DISTANCE
    // =================================================

    const results =
      nearbyNGOs.map((ngo) => {
        const [
          ngoLongitude,
          ngoLatitude,
        ] =
          ngo.location.coordinates;

        const distance =
          calculateDistanceKm(
            longitude,
            latitude,
            ngoLongitude,
            ngoLatitude
          );

        return {
          id: ngo._id,
          name: ngo.name,
          email: ngo.email,
          phone: ngo.phone,
          description:
            ngo.description,

          categories:
            ngo.categories,

          availability:
            ngo.availability,

          serviceRadius:
            ngo.serviceRadius,

          pickupAvailable:
            ngo.pickupAvailable,

          volunteerCount:
            ngo.volunteerCount,

          city:
            ngo.city,

          officialAddress:
            ngo.officialAddress,

          website:
            ngo.website,

          distanceKm:
            Number(
              distance.toFixed(2)
            ),
        };
      });

    return res.status(200).json({
      success: true,

      count:
        results.length,

      radiusKm,

      ngos: results,
    });
  } catch (error) {
    console.error(
      "Get nearby NGOs error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while finding nearby NGOs.",
    });
  }
};

// =====================================================
// DISTANCE CALCULATOR
// =====================================================

const calculateDistanceKm = (
  lon1,
  lat1,
  lon2,
  lat2
) => {
  const toRadians = (value) =>
    (value * Math.PI) / 180;

  const earthRadiusKm =
    6371;

  const dLat =
    toRadians(lat2 - lat1);

  const dLon =
    toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      toRadians(lat1)
    ) *
      Math.cos(
        toRadians(lat2)
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return (
    earthRadiusKm * c
  );
};