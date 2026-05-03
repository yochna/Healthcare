const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const patientService = require("../services/patientService");

// POST — public
router.post("/", async (req, res) => {
    try {
        const { patient, aiSummary } = await patientService.registerPatient(req.body);
        res.status(201).json({
            success: true,
            message: "Registration successful ✅",
            data: patient,
            aiSummary
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
        const { patients, pagination } = await patientService.getAllPatients(req.query);
        res.json({ success: true, data: patients, pagination });
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
        const patient = await patientService.getPatientById(req.params.id);
        res.json({ success: true, data: patient });
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
        const patient = await patientService.updatePatient(req.params.id, req.body);
        res.json({
            success: true,
            message: "Patient updated ✅",
            data: patient
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
        await patientService.deletePatient(req.params.id);
        res.json({ success: true, message: "Patient deleted ✅" });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

module.exports = router;