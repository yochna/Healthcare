const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const contactService = require("../services/contactService");

// POST — public
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

// GET all — protected
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

// DELETE — protected
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