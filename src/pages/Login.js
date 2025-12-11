import React, { useState, useContext } from "react";
import { login } from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setUser({ email });
      navigate("/");
    } catch (err) {
      alert(err.message); 
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>Login</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.passwordWrapper}
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
          <span onClick={()=>setShow(!show)} style={styles.eyeIcon}>{show ? <FaEyeSlash/> : <FaEye/>}</span>
        </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <button
          onClick={() => navigate("/register")}
          style={styles.linkButton}
        >
          Create New Account
        </button>
      </div>
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
