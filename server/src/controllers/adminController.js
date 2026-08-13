import NGO from "../models/NGO.js";

// =========================
// GET PENDING NGOS
// =========================

export const getPendingNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find({
      verificationStatus: "pending",
    })
      .select(
        "name email phone description categories location serviceRadius availability pickupAvailable volunteerCount verificationStatus createdAt"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: ngos.length,
      ngos,
    });
  } catch (error) {
    console.error("Get pending NGOs error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending NGOs.",
    });
  }
};

// =========================
// VERIFY NGO
// =========================

export const verifyNGO = async (req, res) => {
  try {
    const { id } = req.params;

    const ngo = await NGO.findById(id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found.",
      });
    }

    if (ngo.verificationStatus === "verified") {
      return res.status(409).json({
        success: false,
        message: "NGO is already verified.",
      });
    }

    ngo.verificationStatus = "verified";

    await ngo.save();

    return res.status(200).json({
      success: true,
      message: "NGO verified successfully.",
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        verificationStatus: ngo.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Verify NGO error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while verifying NGO.",
    });
  }
};

// =========================
// REJECT NGO
// =========================

export const rejectNGO = async (req, res) => {
  try {
    const { id } = req.params;

    const ngo = await NGO.findById(id);

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found.",
      });
    }

    ngo.verificationStatus = "rejected";

    await ngo.save();

    return res.status(200).json({
      success: true,
      message: "NGO rejected successfully.",
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        verificationStatus: ngo.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Reject NGO error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while rejecting NGO.",
    });
  }
};