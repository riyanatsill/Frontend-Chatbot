import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/smart-pnj.png"; // Ubah sesuai lokasi logo kamu

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  // Ambil user dari session backend
  useEffect(() => {
    fetch(`${API_BASE}/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUsername(data.username))
      .catch(() => navigate("/login"));
  }, []);

  const handleLogout = () => {
    fetch(`${API_BASE}/logout`, {
      method: "GET",
      credentials: "include",
    })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.error("Logout gagal:", err);
      });
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">

          {/* Kiri: Logo + Judul */}
          <div className="d-flex align-items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
            <span className="fw-bold">Chatbot Admin Dashboard</span>
          </div>

          {/* Kanan: Link + Username + Logout */}
          <div className="d-flex align-items-center gap-4">
            <Link to="/my-account" className="text-decoration-none text-dark">
              My Account
            </Link>
            <span className="text-muted">Halo, {username}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={() => setShowModal(true)}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Modal Konfirmasi Logout */}
      {showModal && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Konfirmasi Logout</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Apakah kamu yakin ingin logout?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setShowModal(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default NavbarAdmin;
