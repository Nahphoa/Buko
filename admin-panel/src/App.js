// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './screens/AdminLogin';
import AdminDashboard from './screens/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
