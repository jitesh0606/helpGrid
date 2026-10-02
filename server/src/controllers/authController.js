import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import NGO from "../models/NGO.js";

// =========================
// REGISTER
// =========================

export const register = async (req, res) => {
  try {
   const {
  name,
  email,
  password,
  phone,
  role,
  description,
  categories,
  coordinates,

  registrationNumber,
  registrationAuthority,
  establishedYear,
  website,
  officialAddress,
  city,
  area,

  contactPersonName,
  contactPersonPhone,
  contactPersonDesignation,
} = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required.",
      });
    }

    // Validate role
    if (!["user", "ngo"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing account
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    const existingNGO = await NGO.findOne({
      email: normalizedEmail,
    });

    if (existingUser || existingNGO) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // =========================
    // USER REGISTRATION
    // =========================

    if (role === "user") {
      const user = await User.create({
  name,
  email: normalizedEmail,
  password: hashedPassword,
  phone,
  city,
  area,
  location: {
    type: "Point",
    coordinates: coordinates || [0, 0],
  },
});

      return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "user",
        },
      });
    }

    // =========================
    // NGO REGISTRATION
    // =========================

    const ngo = await NGO.create({
  name,
  email: normalizedEmail,
  password: hashedPassword,
  phone,

  description,

  registrationNumber,
  registrationAuthority,
  establishedYear,

  officialAddress,
  city,

  website,

  contactPerson: {
    name: contactPersonName,
    phone: contactPersonPhone,
    designation: contactPersonDesignation,
  },

  categories: categories || [],

  location: {
    type: "Point",
    coordinates: coordinates || [0, 0],
  },

  verificationStatus: "pending",
});

    return res.status(201).json({
      success: true,
      message: "NGO registered successfully. Verification is pending.",
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        verificationStatus: ngo.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
};

// =========================
// LOGIN
// =========================

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message:
          "Email, password and role are required.",
      });
    }

    // Validate role
    if (
      !["user", "ngo", "admin"].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // =================================================
    // FIND ACCOUNT
    // =================================================

    let account;

    if (
      role === "user" ||
      role === "admin"
    ) {
      account = await User.findOne({
        email: normalizedEmail,
      });
    } else {
      account = await NGO.findOne({
        email: normalizedEmail,
      });
    }

    // Account not found
    if (!account) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // =================================================
    // ADMIN ROLE CHECK
    // =================================================

    if (
      role === "admin" &&
      account.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Admin access required.",
      });
    }

    // =================================================
    // USER ROLE CHECK
    // =================================================

    if (
      role === "user" &&
      account.role === "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Please login using the Admin role.",
      });
    }

    // =================================================
    // PASSWORD CHECK
    // =================================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        account.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // =================================================
    // NGO VERIFICATION CHECK
    // =================================================

    if (
      role === "ngo" &&
      account.verificationStatus ===
        "rejected"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your NGO verification was rejected.",
      });
    }

    // =================================================
    // CREATE JWT
    // =================================================

    const token = jwt.sign(
      {
        id: account._id,

        // IMPORTANT:
        // Use actual login role.
        role: role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Login successful.",

      token,

      user: {
        id: account._id,

        name: account.name,

        email: account.email,

        role,

        ...(role === "ngo" && {
          verificationStatus:
            account.verificationStatus,
        }),
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login.",
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      secret,
    } = req.body;

    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret.",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    const existingNGO = await NGO.findOne({
      email: normalizedEmail,
    });

    if (existingUser || existingNGO) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const admin = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating admin.",
    });
  }
};
