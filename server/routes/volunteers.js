const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const volunteerService = require("../services/volunteerService");

/**
 * @swagger
 * /api/volunteers:
 *   post:
 *     summary: Register a new volunteer
 *     tags: [Volunteers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       201:
 *         description: Volunteer registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/volunteers:
 *   get:
 *     summary: Get all volunteers with pagination and filters
 *     tags: [Volunteers]
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
 *           enum: [pending, approved, active]
 *       - in: query
 *         name: availability
 *         schema:
 *           type: string
 *           enum: [weekdays, weekends, both, flexible]
 *     responses:
 *       200:
 *         description: List of volunteers
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/volunteers/{id}:
 *   get:
 *     summary: Get single volunteer by ID
 *     tags: [Volunteers]
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
 *         description: Volunteer found
 *       404:
 *         description: Volunteer not found
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/volunteers/{id}:
 *   put:
 *     summary: Update volunteer status
 *     tags: [Volunteers]
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
 *                 enum: [pending, approved, active]
 *     responses:
 *       200:
 *         description: Volunteer updated
 *       404:
 *         description: Volunteer not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, async (req, res) => {
    try {
        const volunteer = await volunteerService.updateVolunteer(req.params.id, req.body);
        res.json({ success: true, message: "Volunteer updated ✅", data: volunteer });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

/**
 * @swagger
 * /api/volunteers/{id}:
 *   delete:
 *     summary: Delete a volunteer
 *     tags: [Volunteers]
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
 *         description: Volunteer deleted
 *       404:
 *         description: Volunteer not found
 *       401:
 *         description: Unauthorized
 */
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