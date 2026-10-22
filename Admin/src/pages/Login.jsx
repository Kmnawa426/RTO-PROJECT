
import { useState } from "react";
import axios from "axios";
import { host } from "../Context/MyContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState({
    Email: "",
    Password: "",
  });
  const nav = useNavigate()

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value, });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${host}/Admin/Login`, login);
      console.log("Login Response:", response.data);
      localStorage.setItem("AdminToken",response.data.Token)
      nav('/')
    } catch (error) {
      console.log(
        "Login Error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div
          className="d-flex align-items-center gap-2 mb-4"
          style={{ color: "var(--navy)" }}
        >
          <div
            className="brand-mark"
            style={{ background: "var(--navy)", color: "#fff" }}
          >
            <i className="bi bi-shield-check" />
          </div>

          <div>
            <div className="brand-name">RTO Admin</div>
            <div className="text-muted small">Transport Department</div>
          </div>
        </div>

        <h1 className="h5 mb-3">Sign in to your account</h1>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            name="Email"
            className="form-control"
            value={login.Email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="Password"
            className="form-control"
            value={login.Password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="button"
          className="btn btn-primary w-100 py-2"
          onClick={handleSubmit}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
