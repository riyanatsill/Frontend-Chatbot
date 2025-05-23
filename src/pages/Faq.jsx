import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarFaq from '../components/NavbarFaq';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL;

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: null, question: '', answer: '', category: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();


  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/faq`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Gagal mengambil FAQ:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch(`${API_BASE}/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        // Sudah login, tidak perlu lakukan apa-apa
      })
      .catch(() => {
        // Belum login, redirect ke halaman login
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenModal = (faq = null) => {
    if (faq) {
      setFormData(faq);
      setIsEdit(true);
    } else {
      setFormData({ id: null, question: '', answer: '', category: '' });
      setIsEdit(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showToast = (type, message) => {
  setToast({ show: true, type, message });
  setTimeout(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, 4000);
};

  const handleSubmit = async () => {
  const { question, answer, category } = formData;

  // Validasi
  if (!question.trim()) {
    showToast("danger", "Pertanyaan tidak boleh kosong.");
    return;
  }

  if (!answer.trim()) {
    showToast("danger", "Jawaban tidak boleh kosong.");
    return;
  }

  if (!category.trim()) {
    showToast("danger", "Kategori harus dipilih.");
    return;
  }

  try {
    if (isEdit) {
      await axios.put(`${API_BASE}/faq/${formData.id}`, formData);
    } else {
      await axios.post(`${API_BASE}/faq`, formData);
    }
    await fetchFaqs();
    handleCloseModal();
    showToast("success", "FAQ berhasil disimpan.");
  } catch (error) {
    console.error("Gagal simpan FAQ:", error);
    showToast("danger", "Gagal menyimpan FAQ.");
  }
};

const confirmDelete = (faqId) => {
  setFaqToDelete(faqId);
  setShowDeleteModal(true);
};

const executeDelete = async () => {
  try {
    await axios.delete(`${API_BASE}/faq/${faqToDelete}`);
    await fetchFaqs();
  } catch (error) {
    console.error('Gagal hapus FAQ:', error);
  } finally {
    setShowDeleteModal(false);
    setFaqToDelete(null);
  }
};


  const filteredFaqs = faqs
    .filter(faq =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
    )
    .filter(faq => !filterCategory || faq.category === filterCategory);

  return (
      <div className="d-flex flex-column min-vh-100 bg-light">
        <NavbarFaq />
        <section className="bg-superdash text-white text-center py-5">
        <h2 className="fw-bold mb-2">Frequently Ask Question</h2>
        </section>

        <div className="container py-5 flex-grow-1" style={{ maxWidth: "900px" }}>
          <div className="row align-items-center justify-content-between g-3 mb-4">
            <div className="col-12 col-md-auto">
              <button className="btn btn-success w-100" onClick={() => handleOpenModal()}>
                + Tambah FAQ Manual
              </button>
            </div>
            <div className="col-12 col-md d-flex flex-column flex-md-row gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Cari pertanyaan atau jawaban..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                <option value="SNBT">SNBT</option>
                <option value="SNBP">SNBP</option>
                <option value="Ujian Mandiri">Ujian Mandiri</option>
                <option value="Mandiri Prestasi">Mandiri Prestasi</option>
                <option value="RPL">RPL</option>
                <option value="PSDKU">PSDKU</option>
                <option value="Pascasarjana">Pascasarjana</option>
                <option value="WNBK">WNBK</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Pertanyaan</th>
                    <th>Jawaban</th>
                    <th>Kategori</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaqs.map((faq, index) => (
                    <tr key={faq.id}>
                      <td>{index + 1}</td>
                      <td>{faq.question}</td>
                      <td>{faq.answer}</td>
                      <td>{faq.category}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenModal(faq)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-danger me-2" onClick={() => confirmDelete(faq.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredFaqs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Tidak ada data FAQ yang sesuai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {showModal && (
          <>
            <div className="modal show fade d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {isEdit ? "Edit FAQ" : "Tambah FAQ Manual"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Pertanyaan</label>
                        <input
                          type="text"
                          name="question"
                          value={formData.question}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Jawaban</label>
                        <textarea
                          name="answer"
                          value={formData.answer}
                          onChange={handleChange}
                          className="form-control"
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Kategori</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="">Pilih kategori</option>
                          <option value="SNBT">SNBT</option>
                          <option value="SNBP">SNBP</option>
                          <option value="Ujian Mandiri">Ujian Mandiri</option>
                          <option value="Mandiri Prestasi">Mandiri Prestasi</option>
                          <option value="RPL">RPL</option>
                          <option value="PSDKU">PSDKU</option>
                          <option value="Pascasarjana">Pascasarjana</option>
                          <option value="WNBK">WNBK</option>
                          <option value="Umum">Umum</option>
                        </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                      Batal
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}

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
                    <p>Apakah kamu yakin ingin menghapus FAQ ini?</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Batal
                    </button>
                    <button className="btn btn-danger" onClick={executeDelete}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
        )}
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
        <Footer />
      </div>

  );
};

export default FAQ;