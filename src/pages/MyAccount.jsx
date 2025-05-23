import React, { useState, useEffect } from "react";
import './Login.css';
import NavbarAccount from "../components/NavbarAccount";
import Footer2 from "../components/Footer2";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const [user, setUser] = useState({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const API_BASE = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser({ username: data.username, email: data.email });
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const handlePasswordUpdate = () => {
  if (!newPassword.trim()) {
    showToast("danger", "Password baru tidak boleh kosong.");
    return;
  }

  fetch(`${API_BASE}/users/reset-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ password: newPassword })
  })
    .then((res) => {
      if (!res.ok) throw
      return res.json();
    })
    .then(() => {
      showToast("success", "Password berhasil diperbarui.");
      setNewPassword("");

      
      setTimeout(() => {
        fetch(`${API_BASE}/logout`, {
          method: "GET",
          credentials: "include"
        }).finally(() => {
          navigate("/login");
        });
      }, 1500);
    })
    .catch(() => {
      showToast("danger", "Gagal memperbarui password.");
    });
};


  return (
    <div className="bg-superdash d-flex flex-column min-vh-100">
        <NavbarAccount />
              {/* HEADER */}
        <section className="bg-superdash text-white text-center py-5">
            <h2 className="fw-bold mb-2">My Account</h2>
        </section>
        
        <div className="container py-5 position-relative">

        <div className="mb-3 col-md-6 mx-auto">
            <label className="form-label text-white">Username</label>
            <input type="text" className="form-control" value={user.username} disabled />
        </div>

        <div className="mb-3 col-md-6 mx-auto">
            <label className="form-label text-white">Email</label>
            <input type="text" className="form-control" value={user.email || ""} disabled/>
        </div>

        <div className="mb-3 col-md-6 mx-auto">
            <label className="form-label text-white">Password Baru</label>
            <div className="input-group bg-light rounded">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control px-3 py-2"
                placeholder="Masukan password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
              </button>
            </div>
        </div>
        <div className="text-center">
            <button className="btn btn-primary" onClick={handlePasswordUpdate}>
                Update Password
            </button>
        </div>
        {/* TOAST */}
        {toast.show && (
            <div
            className={`toast align-items-center text-bg-${toast.type} position-fixed bottom-0 end-0 m-4 show`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ zIndex: 9999 }}
            >
            <div className="d-flex">
                <div className="toast-body">{toast.message}</div>
                <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast({ ...toast, show: false })}
                ></button>
            </div>
            </div>
        )}
        </div>
        <Footer2 />
    </div>
  );
};

export default MyAccount;