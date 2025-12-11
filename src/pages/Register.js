import React, { useState, useContext } from "react";
import { register as apiRegister, verifyOtp } from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const {} = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register"); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  function isValidPassword(pwd) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?=.{8,})/; 
    return passwordRegex.test(pwd);
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, and 1 special character."
      );
      return;
    }

    setLoading(true);
    try {
      await apiRegister(email.trim(), password); 
      setStep("otp");                 
      setError(null);
    } catch (err) {
      console.error("Register error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email.trim(), otp.trim()); 
      setModalMessage("Email verified successfully! Please log in.");
      setShowModal(true);
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  function handleModalConfirm() {
    setShowModal(false);
    navigate("/login");
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>
          {step === "register" ? "Register" : "Verify Email"}
        </h2>

        {step === "register" ? (
          <form onSubmit={handleRegisterSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />

            <div style={styles.passwordWrapper}>
              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.passwordInput}
                required
              />
              <span onClick={() => setShow(!show)} style={styles.eyeIcon}>
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} style={styles.form}>
            <p style={{ fontSize: 14, marginBottom: 4 }}>
              We sent a 6-digit code to <strong>{email}</strong>.
              <br />
              Enter it below to verify your email.
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button onClick={() => navigate("/login")} style={styles.linkButton}>
          Back to Login
        </button>
      </div>

      {showModal && (
        <div role="dialog" aria-modal="true" style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h4 style={{ marginTop: 0 }}>Success</h4>
            <p style={{ marginBottom: 18 }}>{modalMessage}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                style={{ ...styles.smallBtn, background: "#eee" }}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                style={{ ...styles.smallBtn, background: "#007bff", color: "white" }}
                onClick={handleModalConfirm}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 40,
  },
  card: {
    width: 320,
    padding: 20,
    borderRadius: 8,
    background: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    padding: "8px 10px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "10px",
    borderRadius: 6,
    border: "none",
    background: "#007bff",
    color: "white",
    cursor: "pointer",
  },
  linkButton: {
    marginTop: 6,
    padding: "8px",
    width: "100%",
    borderRadius: 4,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "crimson",
    marginBottom: 8,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 8,
    padding: 18,
    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  },
  smallBtn: {
    padding: "8px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    padding: "8px 36px 8px 10px",
    fontSize: 14,
    borderRadius: 4,
    border: "1px solid #ccc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#555",
  },
};
