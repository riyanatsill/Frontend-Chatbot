import React from 'react';
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';
import Chat from '../components/Chat';
import './Login.css';

const Chatbot = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-superdash">
      <Navbar />
      <main className="flex-grow-1">
        <Chat />
      </main>
      <Footer2 />
    </div>
  );
};

export default Chatbot;
