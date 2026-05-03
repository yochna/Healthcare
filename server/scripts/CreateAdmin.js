require("dotenv").config({ path: `${__dirname}/../.env` });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected ✅");

        // check if admin already exists
        const existing = await Admin.findOne({ email: "admin@healthbridge.com" });
        if(existing) {
            console.log("Admin already exists ✅");
            process.exit();
        }

        // create admin
        const hashed = await bcrypt.hash("admin123", 10);
        const admin = new Admin({
            name: "HealthBridge Admin",
            email: "admin@healthbridge.com",
            password: hashed
        });

        await admin.save();
        console.log("Admin created successfully ✅");
        console.log("Email: admin@healthbridge.com");
        console.log("Password: admin123");
        process.exit();

    } catch(err) {
        console.log("Error:", err.message);
        process.exit(1);
    }
};

createAdmin();