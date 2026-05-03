const Contact = require("../models/Contact");

const generateAutoReply = (subject, message) => {
    const s = (subject + " " + message).toLowerCase();

    if(s.includes("appointment") || s.includes("schedule") || s.includes("book")) {
        return "Thank you for reaching out! Our team will get back to you within 24 hours to schedule your appointment.";
    }
    if(s.includes("volunteer") || s.includes("help") || s.includes("join")) {
        return "Thank you for your interest in volunteering! Our coordinator will contact you within 48 hours.";
    }
    if(s.includes("donation") || s.includes("donate") || s.includes("fund")) {
        return "Thank you for your generous support! Our finance team will reach out within 24 hours.";
    }
    if(s.includes("emergency") || s.includes("urgent") || s.includes("critical")) {
        return "⚠️ We've flagged your message as URGENT. A team member will contact you within 2 hours. If this is a medical emergency, please call 112 immediately.";
    }
    if(s.includes("medicine") || s.includes("medication") || s.includes("prescription")) {
        return "Our medical support team will review your request and respond within 24 hours.";
    }
    return "Thank you for contacting HealthBridge NGO. We will respond within 24–48 hours.";
};

const validateContact = (data) => {
    const { name, email, subject, message } = data;
    if(!name || !email || !subject || !message) {
        return "Name, email, subject and message are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return "Invalid email format";
    }
    if(message.trim().length < 10) {
        return "Message must be at least 10 characters";
    }
    return null;
};

const submitContact = async (data) => {
    const error = validateContact(data);
    if(error) throw { statusCode: 400, message: error };

    const autoReply = generateAutoReply(data.subject, data.message);
    const contact = new Contact({ ...data, autoReply });
    await contact.save();
    return { contact, autoReply };
};

const getAllContacts = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        contacts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalContacts: total
        }
    };
};

const deleteContact = async (id) => {
    const contact = await Contact.findByIdAndDelete(id);
    if(!contact) throw { statusCode: 404, message: "Contact not found" };
    return contact;
};

module.exports = { submitContact, getAllContacts, deleteContact };