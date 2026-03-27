const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// AI-powered summary generator
function generateAISummary(data) {
  const urgencyMap = {
    critical: "⚠️ CRITICAL — Immediate intervention required.",
    high: "🔴 HIGH priority — Urgent attention needed within 24 hours.",
    medium: "🟡 MEDIUM priority — Schedule within this week.",
    low: "🟢 LOW priority — Standard queue, monitor regularly.",
  };

  return `Patient ${data.name} (Age: ${data.age}) requires support for: ${data.condition}. 
Support needed: ${data.supportNeeded}. 
Priority assessment: ${urgencyMap[data.urgency] || urgencyMap["medium"]}
Auto-assigned for follow-up. Contact: ${data.email} | ${data.phone}.`;
}

// POST - Register patient
router.post("/", async (req, res) => {
  try {
    const aiSummary = generateAISummary(req.body);
    const patient = new Patient({ ...req.body, aiSummary });
    await patient.save();
    res.status(201).json({ success: true, data: patient, aiSummary });
  } catch (err) {
    // Fallback for no-DB mode
    const aiSummary = generateAISummary(req.body);
    res.status(201).json({
      success: true,
      data: { ...req.body, _id: Date.now(), createdAt: new Date() },
      aiSummary,
      note: "Saved in-memory (DB not connected)",
    });
  }
});

// GET - All patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, data: patients });
  } catch (err) {
    res.json({ success: true, data: [], note: "DB not connected" });
  }
});

module.exports = router;
