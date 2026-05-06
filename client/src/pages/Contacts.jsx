import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

export default function Contacts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [contacts, setContacts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        confirmText: "Confirm",
        confirmColor: "#dc2626"
    });
    const navigate = useNavigate();

    const page = parseInt(searchParams.get("page")) || 1;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchContacts();
    }, [page]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page);
            params.set("limit", 10);

            const res = await api.get(`/api/contacts?${params.toString()}`);
            setContacts(res.data.data);
            setPagination(res.data.pagination);

        } catch(err) {
            if(err.response?.status === 401) {
                navigate("/admin/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const setFilter = (key, value) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            if(value) params.set(key, value);
            else params.delete(key);
            return params;
        });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/admin/login");
    };

    const handleDelete = (id) => {
        setModal({
            isOpen: true,
            title: "Delete Message",
            message: "Are you sure you want to delete this message? This action cannot be undone.",
            confirmText: "Delete",
            confirmColor: "#dc2626",
            onConfirm: async () => {
                try {
                    await api.delete(`/api/contacts/${id}`);
                    setContacts(prev => prev.filter(c => c._id !== id));
                    toast.success("Message deleted successfully ✅");
                } catch(err) {
                    toast.error("Failed to delete message");
                } finally {
                    setModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const SkeletonCard = () => (
        <div style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "10px",
            borderRadius: "8px"
        }}>
            {[["40%", "20px"], ["60%", "15px"], ["80%", "15px"], ["50%", "15px"]].map(([width, height], i) => (
                <div key={i} style={{
                    height,
                    width,
                    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.5s infinite",
                    borderRadius: "4px",
                    marginBottom: "10px"
                }}/>
            ))}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>

            {/* Header */}
            <div style={{
                background: "#0a7c6e",
                color: "white",
                padding: "15px 30px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px"
            }}>
                <h2 style={{ margin: 0 }}>HealthBridge Admin</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <button onClick={() => navigate("/admin/patients")}
                        style={{ background: "transparent", color: "white", border: "1px solid white", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
                        Patients
                    </button>
                    <button onClick={() => navigate("/admin/volunteers")}
                        style={{ background: "transparent", color: "white", border: "1px solid white", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
                        Volunteers
                    </button>
                    <button onClick={() => navigate("/admin/contacts")}
                        style={{ background: "white", color: "#0a7c6e", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
                        Contacts
                    </button>
                    <span style={{ fontSize: "14px" }}>👤 {localStorage.getItem("adminName")}</span>
                    <button onClick={handleLogout}
                        style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ padding: "30px" }}>

                {/* Title */}
                <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: 0 }}>
                        Contact Messages
                        {pagination.totalContacts > 0 && (
                            <span style={{ fontSize: "14px", color: "gray", fontWeight: "normal", marginLeft: "10px" }}>
                                ({pagination.totalContacts} total)
                            </span>
                        )}
                    </h3>
                    <p style={{ color: "gray", fontSize: "11px", margin: "5px 0 0" }}>
                        🔗 {window.location.href}
                    </p>
                </div>

                {/* Skeleton Loading */}
                {loading && (
                    <div>
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                )}

                {/* Contact List */}
                {!loading && contacts.map(contact => (
                    <div key={contact._id} style={{
                        background: "white",
                        border: "1px solid #ddd",
                        padding: "20px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        borderLeft: "4px solid #0a7c6e"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: "0 0 5px" }}>{contact.name}</h4>
                                <p style={{ margin: "0 0 5px", fontSize: "13px" }}>📧 {contact.email}</p>
                                <p style={{ margin: "0 0 8px", fontWeight: "600" }}>📌 {contact.subject}</p>
                                <p style={{ margin: "0 0 8px", fontSize: "13px", color: "gray" }}>{contact.message}</p>
                                {contact.autoReply && (
                                    <div style={{
                                        background: "#f0fdf4",
                                        border: "1px solid #86efac",
                                        padding: "10px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        color: "#166534"
                                    }}>
                                        <strong>Auto Reply:</strong> {contact.autoReply}
                                    </div>
                                )}
                                <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#999" }}>
                                    Received: {new Date(contact.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <button onClick={() => handleDelete(contact._id)}
                                    style={{ padding: "6px 10px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                                    🗑 Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* No results */}
                {!loading && contacts.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", color: "gray", background: "white", borderRadius: "8px" }}>
                        <p style={{ fontSize: "40px", margin: "0 0 10px" }}>📭</p>
                        <p style={{ fontSize: "16px", fontWeight: "500" }}>No messages found</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
                        <button onClick={() => setFilter("page", page - 1)} disabled={page === 1}
                            style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ddd", cursor: page === 1 ? "not-allowed" : "pointer", background: page === 1 ? "#f0f0f0" : "white" }}>
                            Previous
                        </button>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setFilter("page", i + 1)}
                                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #0a7c6e", background: page === i + 1 ? "#0a7c6e" : "white", color: page === i + 1 ? "white" : "#0a7c6e", cursor: "pointer" }}>
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => setFilter("page", page + 1)} disabled={page === pagination.totalPages}
                            style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ddd", cursor: page === pagination.totalPages ? "not-allowed" : "pointer", background: page === pagination.totalPages ? "#f0f0f0" : "white" }}>
                            Next
                        </button>
                    </div>
                )}

                {pagination.totalContacts > 0 && (
                    <p style={{ color: "gray", fontSize: "13px", marginTop: "10px" }}>
                        Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalContacts} total)
                    </p>
                )}
            </div>

            <ConfirmModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                confirmColor={modal.confirmColor}
                onConfirm={modal.onConfirm}
                onCancel={() => setModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}