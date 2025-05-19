import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import Chatbot from './pages/Chatbot.jsx';
import Login from './pages/Login';
import FaqSuggestion from './pages/FaqSuggestion.jsx';
import FaqFinal from './pages/FaqFinal.jsx';
import QuestionHistory from './pages/QuestionHistory.jsx';
import BaseKnowledge from './pages/BaseKnowledge';
import Dashboard from './pages/Dashboard.jsx';
import MyAccount from './pages/MyAccount.jsx';
import MainUser from './pages/Home.jsx';  
import ManageAdmin from './pages/ManageAdmin.jsx';





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainUser />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/faq-suggestion" element={<FaqSuggestion />} />
        <Route path="/faq-final" element={<FaqFinal />} />
        <Route path="/history" element={<QuestionHistory />} />
        <Route path="/manage-admin" element={<ManageAdmin />} />
        <Route path="/base-knowledge" element={<BaseKnowledge />} />
        <Route path="/my-account" element={<MyAccount />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
