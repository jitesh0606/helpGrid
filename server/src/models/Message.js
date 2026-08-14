import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    helpRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelpRequest",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["user", "ngo"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Fast chat history lookup
messageSchema.index({
  helpRequest: 1,
  createdAt: 1,
});

export default mongoose.model(
  "Message",
  messageSchema
);