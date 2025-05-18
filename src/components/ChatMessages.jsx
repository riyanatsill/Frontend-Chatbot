import React from 'react';
import './Chatbot.css';

const ChatMessages = ({ messages, chatContainerRef }) => (
  <div
    ref={chatContainerRef}
    className="flex-grow-1 overflow-auto mb-3 p-3 bg-superdash rounded"
  >
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
      >
        <div
          className={`p-2 rounded shadow-sm ${
            msg.sender === 'user' ? 'bg-message text-black' : 'bg-white border'
          }`}
          style={{ maxWidth: '80%' }}
        >
          {msg.text}
        </div>
      </div>
    ))}
  </div>
);

export default ChatMessages;
