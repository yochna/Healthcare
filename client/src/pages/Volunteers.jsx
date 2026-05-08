import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";

export default function Volunteers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [volunteers, setVolunteers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "Confirm",
    confirmColor: "#dc2626",
  });
  const navigate = useNavigate();

  const status = searchParams.get("status") || "";
  const availability = searchParams.get("availability") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const statusColor = {
    pending: "#ca8a04",
    approved: "#2563eb",
    active: "#16a34a",
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchVolunteers();
  }, [status, availability, page]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (availability) params.set("availability", availability);
      params.set("page", page);
      params.set("limit", 10);

      const res = await api.get(`/api/volunteers?${params.toString()}`);
      setVolunteers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const setFilter = (key, value) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (value) params.set(key, value);
      else params.delete(key);
      if (key !== "page") params.set("page", "1");
      return params;
    });
  };

  const resetFilters = () => setSearchParams({});

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const handleUpdateStatus = (id, newStatus) => {
    setModal({
      isOpen: true,
      title: "Update Volunteer Status",
      message: `Are you sure you want to change status to "${newStatus}"?`,
      confirmText: "Update",
      confirmColor: "#0a7c6e",
      onConfirm: async () => {
        try {
          await api.put(`/api/volunteers/${id}`, { status: newStatus });
          setVolunteers((prev) =>
            prev.map((v) => (v._id === id ? { ...v, status: newStatus } : v))
          );
          toast.success(`Status updated to "${newStatus}" ✅`);
        } catch (err) {
          toast.error("Failed to update status");
        } finally {
          setModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleDelete = (id) => {
    setModal({
      isOpen: true,
      title: "Delete Volunteer",
      message: "Are you sure you want to delete this volunteer? This action cannot be undone.",
      confirmText: "Delete",
      confirmColor: "#dc2626",
      onConfirm: async () => {
        try {
          await api.delete(`/api/volunteers/${id}`);
          setVolunteers((prev) => prev.filter((v) => v._id !== id));
          toast.success("Volunteer deleted successfully ✅");
        } catch (err) {
          toast.error("Failed to delete volunteer");
        } finally {
          setModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const SkeletonCard = () => (
    <div style={{ background: "white", border: "1px solid #ddd", padding: "20px", marginBottom: "10px", borderRadius: "8px" }}>
      {[["40%", "20px"], ["60%", "15px"], ["30%", "15px"]].map(([width, height], i) => (
        <div key={i} style={{
          height, width, marginBottom: "10px", borderRadius: "4px",
          background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
        }}/>
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>

      {/* Header */}
      <div style={{
        background: "#0a7c6e", color: "white", padding: "15px 30px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "10px"
      }}>
        <h2 style={{ margin: 0 }}>HealthBridge Admin</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/admin/patients")}
            aria-label="Go to Patients"
            style={{ background: "transparent", color: "white", border: "1px solid white", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
            Patients
          </button>
          <button onClick={() => navigate("/admin/volunteers")}
            aria-label="Go to Volunteers"
            style={{ background: "white", color: "#0a7c6e", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Volunteers
          </button>
          <button onClick={() => navigate("/admin/contacts")}
            aria-label="Go to Contacts"
            style={{ background: "transparent", color: "white", border: "1px solid white", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
            Contacts
          </button>
          <span style={{ fontSize: "14px" }}>👤 {localStorage.getItem("adminName")}</span>
          <button onClick={handleLogout}
            aria-label="Logout"
            style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "30px" }}>

        {/* Title - ✅ h3 not h2 (header already has h2) */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "24px" }}>
            Volunteers
            {pagination.totalVolunteers > 0 && (
              <span style={{ fontSize: "14px", color: "#555", fontWeight: "normal", marginLeft: "10px" }}>
                ({pagination.totalVolunteers} total)
              </span>
            )}
          </h3>
          <p style={{ color: "#555", fontSize: "11px", margin: "5px 0 0" }}>
            🔗 {window.location.href}
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <select value={status} onChange={(e) => setFilter("status", e.target.value)}
            aria-label="Filter by status"
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
          </select>
          <select value={availability} onChange={(e) => setFilter("availability", e.target.value)}
            aria-label="Filter by availability"
            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd" }}>
            <option value="">All Availability</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="both">Both</option>
            <option value="flexible">Flexible</option>
          </select>
          <button onClick={resetFilters}
            aria-label="Reset all filters"
            style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ddd", background: "white", cursor: "pointer" }}>
            Reset Filters
          </button>
        </div>

        {/* Skeleton Loading */}
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Volunteer List */}
        {!loading && volunteers.map((volunteer) => (
          <div key={volunteer._id} style={{
            background: "white", border: "1px solid #ddd", padding: "20px",
            marginBottom: "10px", borderRadius: "8px",
            borderLeft: `4px solid ${statusColor[volunteer.status] || "#ddd"}`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div>
                {/* ✅ h3 for correct heading order */}
                <h3 style={{ margin: "0 0 5px", fontSize: "16px", fontWeight: "700" }}>
                  {volunteer.name}
                </h3>
                <p style={{ margin: "0 0 5px", fontSize: "13px", color: "#333" }}>
                  📧 {volunteer.email} | 📱 {volunteer.phone}
                </p>
                {volunteer.skills?.length > 0 && (
                  <p style={{ margin: "0 0 5px", fontSize: "13px" }}>
                    🛠 {volunteer.skills.join(", ")}
                  </p>
                )}
                <p style={{ margin: "0 0 5px", fontSize: "13px", color: "#555" }}>
                  🕐 {volunteer.availability}
                </p>
                <p style={{ margin: "0 0 5px", fontSize: "12px", color: "#555" }}>
                  💬 {volunteer.motivation}
                </p>
                <p style={{ margin: "0", fontSize: "11px", color: "#666" }}>
                  Registered: {new Date(volunteer.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "150px" }}>
                <span style={{
                  background: statusColor[volunteer.status], color: "white",
                  padding: "3px 10px", borderRadius: "20px", fontSize: "12px", textAlign: "center"
                }}>
                  {volunteer.status}
                </span>
                <select value={volunteer.status}
                  onChange={(e) => handleUpdateStatus(volunteer._id, e.target.value)}
                  aria-label={`Update status for ${volunteer.name}`}
                  style={{ padding: "6px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="active">Active</option>
                </select>
                <button onClick={() => handleDelete(volunteer._id)}
                  aria-label={`Delete volunteer ${volunteer.name}`}
                  style={{ padding: "6px 10px", background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* No results */}
        {!loading && volunteers.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#555", background: "white", borderRadius: "8px" }}>
            <p style={{ fontSize: "40px", margin: "0 0 10px" }}>🔍</p>
            <p style={{ fontSize: "16px", fontWeight: "500", color: "#333" }}>No volunteers found</p>
            <p style={{ fontSize: "13px", color: "#555" }}>Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: "flex", gap: "8px", marginTop: "20px", flexWrap: "wrap" }}>
            <button onClick={() => setFilter("page", page - 1)} disabled={page === 1}
              aria-label="Previous page"
              style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ddd", cursor: page === 1 ? "not-allowed" : "pointer", background: page === 1 ? "#f0f0f0" : "white" }}>
              Previous
            </button>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button key={i} onClick={() => setFilter("page", i + 1)}
                aria-label={`Go to page ${i + 1}`}
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #0a7c6e", background: page === i + 1 ? "#0a7c6e" : "white", color: page === i + 1 ? "white" : "#0a7c6e", cursor: "pointer" }}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setFilter("page", page + 1)} disabled={page === pagination.totalPages}
              aria-label="Next page"
              style={{ padding: "8px 15px", borderRadius: "6px", border: "1px solid #ddd", cursor: page === pagination.totalPages ? "not-allowed" : "pointer", background: page === pagination.totalPages ? "#f0f0f0" : "white" }}>
              Next
            </button>
          </div>
        )}

        {pagination.totalVolunteers > 0 && (
          <p style={{ color: "#555", fontSize: "13px", marginTop: "10px" }}>
            Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalVolunteers} total)
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
        onCancel={() => setModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}