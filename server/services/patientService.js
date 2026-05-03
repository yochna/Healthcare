const Patient = require("../models/Patient");

// AI summary generator
const generateAISummary = (data) => {
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
};

// validation
const validatePatient = (data) => {
    const { name, age, email, phone, condition, supportNeeded } = data;

    if(!name || !age || !email || !phone || !condition || !supportNeeded)
        return "All fields are required";
    if(age < 0 || age > 120)
        return "Age must be between 0 and 120";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))
        return "Invalid email format";

    const phoneRegex = /^[0-9]{10}$/;
    if(!phoneRegex.test(phone))
        return "Phone must be 10 digits";

    return null; // no error
};

// register patient
const registerPatient = async (data) => {
    const error = validatePatient(data);
    if(error) throw { statusCode: 400, message: error };

    const aiSummary = generateAISummary(data);
    const patient = new Patient({ ...data, aiSummary });
    await patient.save();
    return { patient, aiSummary };
};

// get all patients
const getAllPatients = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if(query.status) filter.status = query.status;
    if(query.urgency) filter.urgency = query.urgency;

    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        patients,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPatients: total
        }
    };
};

// get single patient
const getPatientById = async (id) => {
    const patient = await Patient.findById(id);
    if(!patient) throw { statusCode: 404, message: "Patient not found" };
    return patient;
};

// update patient
const updatePatient = async (id, data) => {
    const { status, urgency } = data;

    const validStatus = ["pending", "assigned", "resolved"];
    if(status && !validStatus.includes(status))
        throw { statusCode: 400, message: "Invalid status" };

    const validUrgency = ["low", "medium", "high", "critical"];
    if(urgency && !validUrgency.includes(urgency))
        throw { statusCode: 400, message: "Invalid urgency" };

    const patient = await Patient.findByIdAndUpdate(
        id,
        { status, urgency },
        { new: true, runValidators: true }
    );
    if(!patient) throw { statusCode: 404, message: "Patient not found" };
    return patient;
};

// delete patient
const deletePatient = async (id) => {
    const patient = await Patient.findByIdAndDelete(id);
    if(!patient) throw { statusCode: 404, message: "Patient not found" };
    return patient;
};

module.exports = {
    registerPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient
};