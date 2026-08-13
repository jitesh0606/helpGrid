import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import NGO from "./src/models/NGO.js";

dotenv.config();

const resetPassword = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "MongoDB URI not found. Check your .env file."
      );
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully 🚀");

    const newPassword = "TestPass123";

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    const ngo = await NGO.findOneAndUpdate(
      { email: "ngo@helpgrid.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (!ngo) {
      console.log("❌ NGO not found.");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log("✅ NGO password reset successfully!");
    console.log("Email:", ngo.email);
    console.log("Password:", newPassword);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Password reset failed:", error);
    process.exit(1);
  }
};

resetPassword();