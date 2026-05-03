import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Patients() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // read filters from URL
    const status = searchParams.get("status") || "";
    const urgency = searchParams.get("urgency") || "";
    const page = parseInt(searchParams.get("page")) || 1;

    // fetch when URL changes
    useEffect(() => {
        fetchPatients();
    }, [status, urgency, page]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            // if no token → redirect to login
            if(!token) {
                navigate("/admin/login");
                return;
            }

            // build query
            const params = new URLSearchParams();
            if(status) params.set("status", status);
            if(urgency) params.set("urgency", urgency);
            params.set("page", page);
            params.set("limit", 10);

            const res = await axios.get(
                `${BASE_URL}/api/patients?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPatients(res.data.data);
            setPagination(res.data.pagination);

        } catch(err) {
            if(err.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/admin/login");
            }
        } finally {
            setLoading(false);
        }
    };

    // update URL filter
    const setFilter = (key, value) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if(value) params.set(key, value);
            else params.delete(key);
            if(key !== "page") params.set("page", "1");
            return params;
        });
    };

    // reset all filters
    const resetFilters = () => setSearchParams({});

    // logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("adminName");
        navigate("/admin/login");
    };

    // urgency colors
    const urgencyColor = {
        critical: "#dc2626",
        high: "#ea580c",
        medium: "#ca8a04",
        low: "#16a34a"
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>

            {/* Header */}
            <div style={{
                background: "#0a7c6e",
                color: "white",
                padding: "15px 30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2 style={{ margin: 0 }}>HealthBridge Admin</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ fontSize: "14px" }}>
                        {localStorage.getItem("adminName")}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "white",
                            color: "#0a7c6e",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ padding: "30px" }}>
                <h3>Patients</h3>

                {/* URL display */}
                <p style={{ color: "gray", fontSize: "12px", marginBottom: "15px" }}>
                    🔗 {window.location.href}
                </p>

                {/* Filters */}
                <div style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    flexWrap: "wrap"
                }}>
                    <select
                        value={status}
                        onChange={(e) => setFilter("status", e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="resolved">Resolved</option>
                    </select>

                    <select
                        value={urgency}
                        onChange={(e) => setFilter("urgency", e.target.value)}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}
                    >
                        <option value="">All Urgency</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <button
                        onClick={resetFilters}
                        style={{
                            padding: "8px 15px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            background: "white",
                            cursor: "pointer"
                        }}
                    >
                        Reset Filters
                    </button>
                </div>

                {/* Loading */}
                {loading && <p>Loading patients...</p>}

                {/* Patient List */}
                {!loading && patients.map(patient => (
                    <div key={patient._id} style={{
                        background: "white",
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        borderLeft: `4px solid ${urgencyColor[patient.urgency]}`
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <h4 style={{ margin: "0 0 5px" }}>{patient.name} — Age {patient.age}</h4>
                                <p style={{ margin: "0 0 5px", color: "gray" }}>{patient.condition}</p>
                                <p style={{ margin: "0", fontSize: "13px" }}>
                                    📧 {patient.email} | 📱 {patient.phone}
                                </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span style={{
                                    background: urgencyColor[patient.urgency],
                                    color: "white",
                                    padding: "3px 10px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    display: "block",
                                    marginBottom: "5px"
                                }}>
                                    {patient.urgency}
                                </span>
                                <span style={{
                                    background: "#e0e7ff",
                                    color: "#3730a3",
                                    padding: "3px 10px",
                                    borderRadius: "20px",
                                    fontSize: "12px"
                                }}>
                                    {patient.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* No results */}
                {!loading && patients.length === 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "gray"
                    }}>
                        No patients found for selected filters.
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "20px",
                        alignItems: "center"
                    }}>
                        <button
                            onClick={() => setFilter("page", page - 1)}
                            disabled={page === 1}
                            style={{
                                padding: "8px 15px",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                                cursor: page === 1 ? "not-allowed" : "pointer",
                                background: page === 1 ? "#f0f0f0" : "white"
                            }}
                        >
                            Previous
                        </button>

                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setFilter("page", i + 1)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #0a7c6e",
                                    background: page === i + 1 ? "#0a7c6e" : "white",
                                    color: page === i + 1 ? "white" : "#0a7c6e",
                                    cursor: "pointer",
                                    fontWeight: page === i + 1 ? "bold" : "normal"
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setFilter("page", page + 1)}
                            disabled={page === pagination.totalPages}
                            style={{
                                padding: "8px 15px",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                                cursor: page === pagination.totalPages ? "not-allowed" : "pointer",
                                background: page === pagination.totalPages ? "#f0f0f0" : "white"
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Pagination info */}
                {pagination.totalPatients > 0 && (
                    <p style={{ color: "gray", fontSize: "13px", marginTop: "10px" }}>
                        Showing page {pagination.currentPage} of {pagination.totalPages}
                        ({pagination.totalPatients} total patients)
                    </p>
                )}
            </div>
        </div>
    );
}