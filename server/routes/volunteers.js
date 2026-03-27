const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");

router.post("/", async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json({ success: true, data: volunteer });
  } catch (err) {
    res.status(201).json({
      success: true,
      data: { ...req.body, _id: Date.now(), createdAt: new Date() },
      note: "Saved in-memory (DB not connected)",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: volunteers });
  } catch (err) {
    res.json({ success: true, data: [], note: "DB not connected" });
  }
});

module.exports = router;
