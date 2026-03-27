const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    skills: [{ type: String }],
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "both", "flexible"],
      default: "flexible",
    },
    experience: { type: String },
    location: { type: String },
    motivation: { type: String },
    status: { type: String, enum: ["pending", "approved", "active"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
