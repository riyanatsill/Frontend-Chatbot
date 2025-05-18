import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chat from '../components/Chat';
import './Login.css';

const Chatbot = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-superdash">
      <Navbar />
      <main className="flex-grow-1">
        <Chat />
      </main>
      <Footer />
    </div>
  );
};

export default Chatbot;
