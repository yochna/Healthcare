const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const contactService = require("../services/contactService");

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Message sent successfully with auto reply
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", async (req, res) => {
    try {
        const { contact, autoReply } = await contactService.submitContact(req.body);
        res.status(201).json({
            success: true,
            message: "Message sent successfully ✅",
            data: contact,
            autoReply
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
 * /api/contacts:
 *   get:
 *     summary: Get all contact messages with pagination
 *     tags: [Contacts]
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
 *     responses:
 *       200:
 *         description: List of contact messages
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, async (req, res) => {
    try {
        const { contacts, pagination } = await contactService.getAllContacts(req.query);
        res.json({ success: true, data: contacts, pagination });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Delete a contact message
 *     tags: [Contacts]
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
 *         description: Contact deleted
 *       404:
 *         description: Contact not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, async (req, res) => {
    try {
        await contactService.deleteContact(req.params.id);
        res.json({ success: true, message: "Contact deleted ✅" });
    } catch(err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
});

module.exports = router;