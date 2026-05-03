const Volunteer = require("../models/Volunteer");

const validateVolunteer = (data) => {
    const { name, email, phone, motivation } = data;

    if(!name || !email || !phone || !motivation)
        return "Name, email, phone and motivation are required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))
        return "Invalid email format";

    const phoneRegex = /^[0-9]{10}$/;
    if(!phoneRegex.test(phone))
        return "Phone must be 10 digits";

    const validAvailability = ["weekdays", "weekends", "both", "flexible"];
    if(data.availability && !validAvailability.includes(data.availability))
        return "Invalid availability";

    return null;
};

const registerVolunteer = async (data) => {
    const error = validateVolunteer(data);
    if(error) throw { statusCode: 400, message: error };

    const volunteer = new Volunteer(data);
    await volunteer.save();
    return volunteer;
};

const getAllVolunteers = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if(query.status) filter.status = query.status;
    if(query.availability) filter.availability = query.availability;

    const total = await Volunteer.countDocuments(filter);
    const volunteers = await Volunteer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    return {
        volunteers,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalVolunteers: total
        }
    };
};

const getVolunteerById = async (id) => {
    const volunteer = await Volunteer.findById(id);
    if(!volunteer) throw { statusCode: 404, message: "Volunteer not found" };
    return volunteer;
};

const updateVolunteer = async (id, data) => {
    const validStatus = ["pending", "approved", "active"];
    if(data.status && !validStatus.includes(data.status))
        throw { statusCode: 400, message: "Invalid status" };

    const volunteer = await Volunteer.findByIdAndUpdate(
        id,
        { status: data.status },
        { new: true, runValidators: true }
    );
    if(!volunteer) throw { statusCode: 404, message: "Volunteer not found" };
    return volunteer;
};

const deleteVolunteer = async (id) => {
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if(!volunteer) throw { statusCode: 404, message: "Volunteer not found" };
    return volunteer;
};

module.exports = {
    registerVolunteer,
    getAllVolunteers,
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer
};