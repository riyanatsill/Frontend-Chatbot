import React, { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import './Login.css';
import { useNavigate } from "react-router-dom";
import NavbarAccount from '../components/NavbarAccount';

const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedRole, setEditedRole] = useState('');
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const navigate = useNavigate();

  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

    
  useEffect(() => {
  fetch("http://localhost:5000/me", { credentials: "include" })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then((data) => {
      if (data.role !== "superadmin") {
        navigate("/dashboard"); // atau redirect ke login
      }
    })
    .catch(() => navigate("/login"));
  }, []);
    

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data admin:", err);
        setLoading(false);
      });
  }, []);

  const refreshData = () => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setAdmins(data));
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ ...toast, show: false }), 4000);
  };

  const handleCreate = () => {
    const { username, email, password, role } = newAdmin;

    if (!username.trim() || !email.trim() || !password.trim()) {
      showToast('danger', 'Semua field wajib diisi.');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('danger', 'Format email tidak valid.');
      return;
    }

    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAdmin)
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        refreshData();
        setNewAdmin({ username: '', email: '', password: '', role: 'admin' });
        showToast('success', 'Admin berhasil ditambahkan');
      })
      .catch(() => showToast('danger', 'Gagal menambahkan admin'));
  };

  const startEdit = (id, currentRole) => {
    setEditingId(id);
    setEditedRole(currentRole);
  };

  const handleSave = (id) => {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editedRole })
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        refreshData();
        setEditingId(null);
        setEditedRole('');
        showToast('success', 'Role berhasil diperbarui');
      })
      .catch(() => showToast('danger', 'Gagal memperbarui role'));
  };

  const handleDelete = (id) => {
  fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      refreshData();
      showToast('success', 'Admin berhasil dihapus');
    })
    .catch(() => showToast('danger', 'Gagal menghapus admin'));
  };


  return (
    <div className="d-flex flex-column min-vh-100 bg-white position-relative">
      <NavbarAccount />
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

      {/* HEADER */}
      <section className="bg-superdash text-white text-center py-5">
        <h2 className="fw-bold mb-2">Manage Chatbot Account</h2>
        <p className="mb-0">Create, edit role, or delete admin accounts</p>
      </section>

      {/* MAIN */}
      <main className="container py-5">
        {/* FORM */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">Create New Admin</h4>
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-dark w-100" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <h4 className="fw-bold mb-3">Daftar Admin</h4>
        {loading ? (
          <p>Loading...</p>
        ) : admins.length === 0 ? (
          <p className="text-muted">Belum ada admin yang terdaftar.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={admin.id}>
                    <td>{index + 1}</td>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>
                      {editingId === admin.id ? (
                        <select
                          className="form-select"
                          value={editedRole}
                          onChange={(e) => setEditedRole(e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      ) : (
                        <span className="badge bg-secondary">{admin.role}</span>
                      )}
                    </td>
                    <td>
                      {admin.created_at &&
                        new Date(admin.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                    </td>
                    <td>
                      {editingId === admin.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleSave(admin.id)}
                          >
                            Simpan
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setEditingId(null)}
                          >
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => startEdit(admin.id, admin.role)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => {
                              setSelectedAdminId(admin.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showDeleteModal && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Konfirmasi Hapus Admin</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Apakah kamu yakin ingin menghapus admin ini?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setShowDeleteModal(false);
                      if (selectedAdminId) handleDelete(selectedAdminId);
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      </main>
      <Footer />
    </div>
  );
};

export default ManageAdmin;
