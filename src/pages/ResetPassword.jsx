import React, { useState, useEffect } from 'react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Ambil email dari localStorage / context / API user info
    const userEmail = localStorage.getItem('email'); // kamu bisa sesuaikan key-nya
    setEmail(userEmail || 'admin@example.com'); // fallback demo
  }, []);

  const handleReset = () => {
    if (!password || !confirmPassword) {
      setMessage('Mohon isi semua kolom.');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Password dan konfirmasi tidak cocok.');
      return;
    }

    // Simulasi reset password
    setMessage(`✅ Password untuk "${email}" berhasil direset!`);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-superdash">
      {/* Header */}
      <header className="bg-white py-3 px-4 border-bottom">
        <h4 className="m-0 fw-bold">Chatbot Admin Dashboard</h4>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 d-flex justify-content-center align-items-center">
        <div className="w-100" style={{ maxWidth: '400px' }}>
          {message && <div className="alert alert-light text-center">{message}</div>}

          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              readOnly
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-white">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button className="btn btn-outline-light" onClick={handleReset}>
              Reset Password
            </button>
          </div>
        </div>
      </main>

      <footer className="text-center py-3 text-white-50 border-top mt-auto">
        © 2025 Chatbot Admin &nbsp; | &nbsp;
        <a href="#" className="text-white-50 text-decoration-none">Privacy Policy</a> &nbsp; | &nbsp;
        <a href="#" className="text-white-50 text-decoration-none">Terms & Conditions</a>
      </footer>
    </div>
  );
};

export default ResetPassword;