const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// generate tokens
const generateTokens = (id) => {
    const accessToken = jwt.sign(
        { id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
        { id, role: "admin" },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const admin = await Admin.findOne({ email });
        if(!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const match = await bcrypt.compare(password, admin.password);
        if(!match) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const { accessToken, refreshToken } = generateTokens(admin._id);

        res.json({
            accessToken,
            refreshToken,
            admin: { name: admin.name, email: admin.email }
        });

    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// REFRESH TOKEN
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if(!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const { accessToken, refreshToken: newRefresh } = generateTokens(decoded.id);

        res.json({ accessToken, refreshToken: newRefresh });

    } catch(err) {
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

module.exports = { login, refresh };