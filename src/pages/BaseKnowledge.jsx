import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarKnowledge from '../components/NavbarKnowledge';
import Footer from '../components/Footer';

const BaseKnowledge = () => {
  const [files, setFiles] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: "" });
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/uploaded-files`);
      setFiles(res.data.files);
    } catch (err) {
      console.error('Gagal mengambil daftar file:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setUser({ username: data.username });
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await axios.post(`${API_BASE}/upload`, formData, {
        withCredentials: true,
      });
      showToast("success", res.data.message);
      setUploadFile(null);
      fetchFiles();
    } catch (err) {
      console.error('Gagal upload file:', err);
      showToast("danger", "Gagal upload file.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      const res = await axios.delete(`${API_BASE}/delete-file/${encodeURIComponent(fileToDelete)}`);
      showToast("success", res.data.message);
      fetchFiles();
    } catch (err) {
      console.error('Gagal menghapus file:', err);
      showToast("danger", "Gagal menghapus file.");
    }

    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavbarKnowledge />

      {/* HEADER */}
      <section className="bg-superdash text-white text-center py-5">
        <h2 className="fw-bold mb-2">Base Knowledge</h2>
        <p className="mb-0">Upload dokumen QA per kategori (misal: Ujian Mandiri 2025, SNBT 2025, dll)</p>
      </section>

      <div className="container-xl py-5" style={{ maxWidth: "800px" }}>
        <form onSubmit={handleUpload} className="mb-4">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-8">
              <input
                type='file'
                accept=".pdf, .docx, .xlsx, .json, .txt"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="form-control"
              />
            </div>
            <div className="col-12 col-md-4">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Mengunggah...' : 'Upload File'}
              </button>
            </div>
          </div>
        </form>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Daftar File Terunggah</h5>
          <a href="/qa-data" className="btn btn-outline-primary">
            Lihat QA Terindeks
          </a>
        </div>

        {files.length === 0 ? (
          <p className="text-muted">Belum ada file diupload.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>No</th>
                  <th>Nama File</th>
                  <th>Diunggah Oleh</th>
                  <th>Waktu</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr key={file.filename}>
                    <td>{idx + 1}</td>
                    <td>
                      {file.filename}
                      <div><small className="text-muted">QA otomatis terindeks</small></div>
                    </td>
                    <td>{file.uploaded_by || "-"}</td>
                    <td>{new Date(file.uploaded_at).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setFileToDelete(file.filename);
                          setShowDeleteModal(true);
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
            ></button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Konfirmasi Hapus</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Yakin ingin menghapus file <strong>{fileToDelete}</strong>?</p>
                  <p className="text-muted">Seluruh QA dari file ini juga akan dihapus dari index.</p>
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
                    onClick={handleDelete}
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

      <Footer />
    </div>
  );
};

export default BaseKnowledge;
