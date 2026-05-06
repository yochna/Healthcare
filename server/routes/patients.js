const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const patientService = require("../services/patientService");

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients with pagination and filters
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Results per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, assigned, resolved]
 *       - in: query
 *         name: urgency
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *     responses:
 *       200:
 *         description: List of patients
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get single patient by ID
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient found
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient status or urgency
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, assigned, resolved]
 *               urgency:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *     responses:
 *       200:
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted
 *       404:
 *         description: Patient not found
 *       401:
 *         description: Unauthorized
 */
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