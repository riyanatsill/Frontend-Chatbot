import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import NavbarFaq from '../components/NavbarFaq';
import Footer from '../components/Footer';

const API_BASE = 'http://localhost:5000';

const FAQSuggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [inputAnswer, setInputAnswer] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });



  // === Ambil Data ===
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/faq-suggestions`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Gagal mengambil saran FAQ:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // === Tombol Generate ===
  const handleGenerateSuggestions = () => {
  setShowGenerateModal(true);
};

const confirmGenerateSuggestions = async () => {
  try {
    await axios.post(`${API_BASE}/faq-suggestions/generate`);
    fetchSuggestions();
  } catch (error) {
    console.error('Gagal generate suggestion:', error);
  } finally {
    setShowGenerateModal(false);
  }
};

  // === Modal ===
  const handleOpenModal = (faq) => {
    setSelectedFAQ(faq);
    setInputAnswer(faq.answer || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFAQ(null);
    setInputAnswer('');
  };

  const showToast = (type, message) => {
  setToast({ show: true, type, message });
  setTimeout(() => {
    setToast(prev => ({ ...prev, show: false }));
  }, 4000);
};


  const handleSubmitAnswer = async () => {
  if (!inputAnswer.trim()) {
    showToast("danger", "Jawaban tidak boleh kosong.");
    return;
  }

  try {
    await axios.post(`${API_BASE}/faq-suggestions/${selectedFAQ.id}/accept`, {
      answer: inputAnswer,
    });
    fetchSuggestions();
    handleCloseModal();
    showToast("success", "FAQ berhasil disimpan.");
  } catch (error) {
    console.error('Gagal menyimpan jawaban:', error);
    showToast("danger", "Gagal menyimpan FAQ.");
  }
};


  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavbarFaq />
      <section className="bg-superdash text-white text-center py-5">
        <h2 className="fw-bold mb-2">FAQ Suggestion</h2>
        <p className="mb-0">lorem ipsum</p>
      </section>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Saran FAQ (otomatis)</h5>
          <button className="btn btn-outline-secondary" onClick={handleGenerateSuggestions}>
            🔁 Generate FAQ Suggestion
          </button>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-muted">Belum ada saran FAQ.</p>
        ) : (
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Pertanyaan Utama</th>
                <th>Kategori</th> {/* Ditambahkan */}
                <th>Variasi Pertanyaan</th>
                <th>Jawaban</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.main_question}</td>
                  <td>{faq.category || 'Umum'}</td> {/* Ditambahkan */}
                  <td>
                    <ul className="mb-0 ps-3">
                      {faq.variations.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{faq.answer || <span className="text-muted">Belum dijawab</span>}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => handleOpenModal(faq)}>
                      Jadikan FAQ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Isi Jawaban FAQ</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <p><strong>Pertanyaan:</strong><br />{selectedFAQ?.main_question}</p>
                  <div className="mt-3">
                    <label className="form-label">Jawaban</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={inputAnswer}
                      onChange={(e) => setInputAnswer(e.target.value)}
                      placeholder="Tulis jawaban di sini"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={handleCloseModal}>Batal</button>
                  <button className="btn btn-primary" onClick={handleSubmitAnswer}>Simpan & Jadikan FAQ</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
      {showGenerateModal && (
        <>
          <div className="modal show fade d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Konfirmasi Generate</h5>
                  <button type="button" className="btn-close" onClick={() => setShowGenerateModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Yakin ingin menghasilkan saran FAQ baru dari pertanyaan user?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowGenerateModal(false)}>Batal</button>
                  <button className="btn btn-primary" onClick={confirmGenerateSuggestions}>Ya, Generate</button>
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

export default FAQSuggestion;
