const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// AI auto-response generator based on subject keywords
function generateAutoReply(subject, message) {
  const s = (subject + " " + message).toLowerCase();

  if (s.includes("appointment") || s.includes("schedule") || s.includes("book")) {
    return "Thank you for reaching out! Our team will get back to you within 24 hours to schedule your appointment. For urgent needs, please call our helpline at 1800-XXX-XXXX.";
  }
  if (s.includes("volunteer") || s.includes("help") || s.includes("join")) {
    return "Thank you for your interest in volunteering! We appreciate your dedication. Our volunteer coordinator will contact you within 48 hours with next steps and orientation details.";
  }
  if (s.includes("donation") || s.includes("donate") || s.includes("fund")) {
    return "Thank you for your generous support! Our finance team will reach out with secure payment options and tax exemption certificate details within 24 hours.";
  }
  if (s.includes("emergency") || s.includes("urgent") || s.includes("critical")) {
    return "⚠️ We've flagged your message as URGENT. A team member will contact you within 2 hours. If this is a medical emergency, please call 112 immediately.";
  }
  if (s.includes("medicine") || s.includes("medication") || s.includes("prescription")) {
    return "Thank you for your inquiry. Our medical support team will review your request and respond within 24 hours. Please do not make medication changes without consulting a doctor.";
  }

  return "Thank you for contacting HealthBridge NGO. We have received your message and our team will respond within 24–48 hours. For urgent matters, please call us at 1800-XXX-XXXX.";
}

router.post("/", async (req, res) => {
  try {
    const autoReply = generateAutoReply(req.body.subject, req.body.message);
    const contact = new Contact({ ...req.body, autoReply });
    await contact.save();
    res.status(201).json({ success: true, data: contact, autoReply });
  } catch (err) {
    const autoReply = generateAutoReply(req.body.subject, req.body.message);
    res.status(201).json({
      success: true,
      data: { ...req.body, _id: Date.now() },
      autoReply,
      note: "In-memory mode",
    });
  }
});

module.exports = router;
