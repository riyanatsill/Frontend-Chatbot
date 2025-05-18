import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/react.svg"; // Ubah sesuai lokasi logo kamu

const NavbarFaq = () => {

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
            <Link to="/dashboard" className="text-decoration-none text-dark">
              Home
            </Link>
            <Link to="/faq-final" className="text-decoration-none text-dark">
              FAQ Final
            </Link>
            <Link to="/faq-suggestion" className="text-decoration-none text-dark">
              FAQ Suggestion
            </Link>
            <Link to="/history" className="text-decoration-none text-dark">
              Chat History
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarFaq;