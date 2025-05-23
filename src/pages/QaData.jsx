import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarKnowledge from '../components/NavbarKnowledge';
import Footer from '../components/Footer';
import { useNavigate } from "react-router-dom";

const QaData = () => {
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const API_BASE = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

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
    fetchQA();
  }, [page]);

  const fetchQA = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/qa-data?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      setQaList(res.data.qa || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Gagal mengambil data QA:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavbarKnowledge />

      <section className="bg-superdash text-white text-center py-5">
        <h2 className="fw-bold mb-2">Data Question-Answer</h2>
        <p className="mb-0">Berikut adalah seluruh data pertanyaan dan jawaban yang telah diindeks dari dokumen.</p>
      </section>

      <div className="container-xl py-5" style={{ maxWidth: "1000px" }}>
        {loading ? (
          <p className="text-center text-muted">Memuat data QA...</p>
        ) : qaList.length === 0 ? (
          <p className="text-muted">Belum ada data QA terindeks.</p>
        ) : (
          <>
            <div className="table-responsive mb-3">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>No</th>
                    <th>Pertanyaan</th>
                    <th>Jawaban</th>
                    <th>Sumber File</th>
                  </tr>
                </thead>
                <tbody>
                  {qaList.map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{item.question}</td>
                      <td>{item.answer}</td>
                      <td>{item.filename || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>Sebelumnya</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>Berikutnya</button>
                </li>
              </ul>
            </nav>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default QaData;
