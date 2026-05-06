export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", confirmColor = "#dc2626" }) {
    if(!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "white",
                padding: "30px",
                borderRadius: "12px",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
                {/* Title */}
                <h3 style={{ margin: "0 0 10px", color: "#111" }}>
                    {title}
                </h3>

                {/* Message */}
                <p style={{ margin: "0 0 25px", color: "gray", fontSize: "14px" }}>
                    {message}
                </p>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            background: "white",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "6px",
                            border: "none",
                            background: confirmColor,
                            color: "white",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}