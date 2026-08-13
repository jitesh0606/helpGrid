import mongoose from "mongoose";

const helpRequestSchema = new mongoose.Schema(
  {
    // =====================================================
    // PERSON WHO CREATED THE REQUEST
    // =====================================================

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =====================================================
    // TYPE OF HELP REQUIRED
    // =====================================================

    category: {
      type: String,
      enum: [
        "food",
        "clothes",
        "medical",
        "education",
        "shelter",
        "transport",
        "emergency",
        "other",
      ],
      required: true,
    },

    // =====================================================
    // REQUEST DETAILS
    // =====================================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // USER LOCATION
    // =====================================================

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    // =====================================================
    // REQUEST EXPIRY
    // =====================================================

    expiresAt: {
      type: Date,
      required: true,
    },

    // =====================================================
    // NGOs MATCHED FOR THIS REQUEST
    //
    // IMPORTANT:
    // These are candidate NGOs.
    // They do NOT all receive the request at once.
    //
    // Example:
    //
    // [NGO-A, NGO-B, NGO-C]
    //
    // First NGO-A gets the request.
    // If NGO-A rejects/times out,
    // NGO-B gets it.
    // =====================================================

    notifiedNGOs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NGO",
      },
    ],

    // =====================================================
    // CURRENT NGO OFFER
    //
    // Only this NGO is currently allowed
    // to accept the request.
    // =====================================================

    currentOfferNGO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      default: null,
    },

    // =====================================================
    // NGO THAT FINALLY ACCEPTED THE REQUEST
    // =====================================================

    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      default: null,
    },

    // =====================================================
    // DISPATCH INDEX
    //
    // 0 = first NGO
    // 1 = second NGO
    // 2 = third NGO
    //
    // Example:
    //
    // notifiedNGOs = [A, B, C]
    // dispatchIndex = 0
    // currentOfferNGO = A
    //
    // A rejects:
    // dispatchIndex = 1
    // currentOfferNGO = B
    // =====================================================

    dispatchIndex: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // CURRENT OFFER EXPIRY
    //
    // Example:
    // NGO A gets request at 10:00
    // offerExpiresAt = 10:05
    //
    // If A does not respond,
    // later we will automatically send it to NGO B.
    // =====================================================

    offerExpiresAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // REQUEST STATUS
    // =====================================================

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "in_progress",
        "completed",
        "expired",
        "cancelled",
      ],
      default: "pending",
    },

    // =====================================================
    // WHEN NGO STARTED HELPING
    // =====================================================

    startedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // WHEN HELP WAS COMPLETED
    // =====================================================

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// GEOSPATIAL INDEX
// =====================================================

helpRequestSchema.index({
  location: "2dsphere",
});

// =====================================================
// INDEX FOR ACTIVE NGO OFFERS
// =====================================================

helpRequestSchema.index({
  currentOfferNGO: 1,
  status: 1,
  offerExpiresAt: 1,
});

// =====================================================
// INDEX FOR REQUEST DISPATCH
// =====================================================

helpRequestSchema.index({
  status: 1,
  offerExpiresAt: 1,
});

export default mongoose.model(
  "HelpRequest",
  helpRequestSchema
);