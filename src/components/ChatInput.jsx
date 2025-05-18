import React from 'react';

const ChatInput = ({ question, setQuestion, handleSubmit, loading }) => (
  <form onSubmit={handleSubmit} className="d-flex gap-2">
    <textarea
      rows="1"
      className="form-control"
      placeholder="Tulis pesan..."
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
    />
    <button className="btn btn-dark" type="submit" disabled={loading}>
      {loading ? 'Mengirim...' : 'Kirim'}
    </button>
  </form>
);

export default ChatInput;
