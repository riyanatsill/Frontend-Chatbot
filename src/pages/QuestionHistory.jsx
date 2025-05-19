import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarFaq from '../components/NavbarFaq';
import Footer from '../components/Footer';

const API_BASE = import.meta.env.VITE_API_URL;

const QuestionHistory = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/history`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Gagal mengambil riwayat pertanyaan:', error);
    }
    setLoading(false);
  };

  const handleExportExcel = async () => {
  try {
    const response = await axios.get(`${API_BASE}/export-history-excel`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'chat_history.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Gagal mengekspor Excel:', error);
  }
};


  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavbarFaq />
      <section className="bg-superdash text-white text-center py-5">
        <h2 className="fw-bold mb-2">Chat History</h2>
      </section>
      <div className="container py-5">
        <div className="mb-3 text-end">
          <button onClick={handleExportExcel} className="btn btn-success">
            Export ke Excel
          </button>
        </div>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, index) => (
                <tr key={q.id}>
                  <td>{index + 1}</td>
                  <td>{q.question}</td>
                  <td>{q.answer || <span className="text-muted">Belum terjawab</span>}</td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    Tidak ada pertanyaan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default QuestionHistory;