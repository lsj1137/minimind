const helpBtnStyle: React.CSSProperties = {
  position: "fixed",
  top: "25px",
  right: "25px",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  backgroundColor: "#4A90E2", // 파란색 계열
  color: "white",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  fontSize: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};

const resetBtnStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "30px",
  right: "30px",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "#ff4d4f",
  color: "white",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
};

const toastStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "100px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "#333",
  color: "white",
  padding: "10px 25px",
  borderRadius: "25px",
  fontSize: "14px",
  zIndex: 2000,
  animation: "fadeInOut 2s",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const helpContentStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "16px",
  width: "450px",
  maxWidth: "90%",
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  position: "relative",
};

const closeButtonStyle: React.CSSProperties = {
  marginTop: "30px",
  padding: "10px 30px",
  backgroundColor: "#4A90E2",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%",
  fontSize: "16px",
  fontWeight: "bold",
};

const resetModalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    minWidth: "300px", // 최소 너비 추가로 안정감 부여
  },
  title: {
    marginTop: 0,
    marginBottom: "10px",
    fontSize: "1.25rem",
    fontWeight: "bold",
  },
  message: {
    marginBottom: "20px",
    color: "#666",
  },
  buttonGroup: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  deleteButton: {
    padding: "10px 20px",
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#ddd",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export {
  helpBtnStyle,
  resetBtnStyle,
  toastStyle,
  modalOverlayStyle,
  closeButtonStyle,
  helpContentStyle,
  resetModalStyles,
};
