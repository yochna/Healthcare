const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    condition: { type: String, required: true },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    supportNeeded: { type: String, required: true },
    address: { type: String },
    status: { type: String, enum: ["pending", "assigned", "resolved"], default: "pending" },
    aiSummary: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
