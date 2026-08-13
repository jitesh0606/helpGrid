import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC NGO DETAILS
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  registrationNumber: {
  type: String,
  trim: true,
},

registrationAuthority: {
  type: String,
  trim: true,
},

establishedYear: {
  type: Number,
  min: 1800,
  max: new Date().getFullYear(),
},

officialAddress: {
  type: String,
  trim: true,
},

contactPerson: {
  name: {
    type: String,
    trim: true,
  },

  phone: {
    type: String,
    trim: true,
  },

  designation: {
    type: String,
    trim: true,
  },
},

website: {
  type: String,
  trim: true,
},

verificationNotes: {
  type: String,
  trim: true,
},
    website: {
      type: String,
      trim: true,
    },

    // =========================
    // NGO REGISTRATION
    // =========================

    registrationNumber: {
      type: String,
      trim: true,
    },

    // =========================
    // CONTACT PERSON
    // =========================

    contactPersonName: {
      type: String,
      trim: true,
    },

    contactPersonDesignation: {
      type: String,
      trim: true,
    },

    // =========================
    // ADDRESS
    // =========================

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    // =========================
    // CATEGORIES
    // =========================

    categories: [
      {
        type: String,
        enum: [
          "food",
          "education",
          "medical",
          "clothes",
          "shelter",
          "volunteer",
          "other",
        ],
      },
    ],

    // =========================
    // LOCATION
    // =========================

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    // =========================
    // SERVICE DETAILS
    // =========================

    serviceRadius: {
      type: Number,
      default: 10,
    },

    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },

    pickupAvailable: {
      type: Boolean,
      default: false,
    },

    volunteerCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =========================
    // VERIFICATION
    // =========================

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    verificationDocuments: [
      {
        type: String,
        trim: true,
      },
    ],

    verifiedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

ngoSchema.index({ location: "2dsphere" });

const NGO = mongoose.model("NGO", ngoSchema);

export default NGO;