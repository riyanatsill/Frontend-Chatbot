import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const Chat = () => {
  const chatContainerRef = useRef(null);

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    if (!showChat) setShowChat(true);

    const userMessage = { text: question, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/ask', {
        question: question,
      });

      const botAnswer = response.data.answer;
      const botMessage = { text: botAnswer, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);

      try {
        await axios.post('http://localhost:5000/submit-question', {
          question: question,
          answer: botAnswer,
        });
      } catch (err) {
        console.warn('Gagal simpan ke DB:', err.message);
      }

    } catch (error) {
      console.error('Gagal menjawab:', error);
      const errorMessage = { text: 'Maaf, terjadi kesalahan.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  if (!showChat) {
    return (
      <div className="container py-5 text-center text-white">
        <h1 className="mb-3">Selamat Datang</h1>
        <p className="mb-4">Tanyakan apa pun kepada saya tentang PMB, saya siap membantu!</p>
        <form onSubmit={handleSubmit} className="d-flex justify-content-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="form-control w-50"
            placeholder="Tulis pertanyaanmu..."
          />
          <button type="submit" className="btn btn-dark">
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center" style={{ height: '85vh' }}>
      <div className="d-flex flex-column px-3 w-100" style={{ maxWidth: '800px' }}>
        <ChatMessages messages={messages} chatContainerRef={chatContainerRef} />
        <ChatInput
          question={question}
          setQuestion={setQuestion}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Chat;
