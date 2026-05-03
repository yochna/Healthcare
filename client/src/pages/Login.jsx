import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.post(`${BASE_URL}/api/auth/login`, {
                email,
                password
            });

            // save tokens
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            localStorage.setItem("adminName", res.data.admin.name);

            // redirect to patients
            navigate("/admin/patients");

        } catch(err) {
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    // allow login on Enter key
    const handleKeyPress = (e) => {
        if(e.key === "Enter") handleLogin();
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f4f8"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                width: "100%",
                maxWidth: "400px"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h2 style={{ color: "#0a7c6e", marginBottom: "8px" }}>
                        HealthBridge Admin
                    </h2>
                    <p style={{ color: "gray", fontSize: "14px" }}>
                        Sign in to access the dashboard
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "15px",
                        fontSize: "14px"
                    }}>
                        {error}
                    </div>
                )}

                {/* Email */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="admin@healthbridge.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* Password */}
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* Login Button */}
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: loading ? "#ccc" : "#0a7c6e",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "500"
                    }}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </div>
        </div>
    );
}