const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const volunteerService = require("../services/volunteerService");

// POST — public
router.post("/", async (req, res) => {
    try {
        const volunteer = await volunteerService.registerVolunteer(req.body);
        res.status(201).json({
            success: true,
            message: "Volunteer registered successfully ✅",
            data: volunteer
        });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

// GET all — protected
router.get("/", protect, async (req, res) => {
    try {
        const { volunteers, pagination } = await volunteerService.getAllVolunteers(req.query);
        res.json({ success: true, data: volunteers, pagination });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

// GET one — protected
router.get("/:id", protect, async (req, res) => {
    try {
        const volunteer = await volunteerService.getVolunteerById(req.params.id);
        res.json({ success: true, data: volunteer });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

// PUT — protected
router.put("/:id", protect, async (req, res) => {
    try {
        const volunteer = await volunteerService.updateVolunteer(req.params.id, req.body);
        res.json({
            success: true,
            message: "Volunteer updated ✅",
            data: volunteer
        });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

// DELETE — protected
router.delete("/:id", protect, async (req, res) => {
    try {
        await volunteerService.deleteVolunteer(req.params.id);
        res.json({ success: true, message: "Volunteer deleted ✅" });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

module.exports = router;