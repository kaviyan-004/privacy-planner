import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import ImageAnalyzer from './pages/Image';
import Caption from './pages/Caption';
import Chat from './pages/Chat';
import WhatIf from './pages/WhatIf';
import About from './pages/About';

function App() {
  // Always set a default user to bypass authentication checks
  const [user, setUser] = useState({ username: 'Demo User', avatar_color: 'var(--purple-primary)' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Login verification bypassed
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="main-content">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/login" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/analyze" element={user ? <Analyze /> : <Navigate to="/login" />} />
        <Route path="/image" element={user ? <ImageAnalyzer /> : <Navigate to="/login" />} />
        <Route path="/caption" element={user ? <Caption /> : <Navigate to="/login" />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
        <Route path="/whatif" element={user ? <WhatIf /> : <Navigate to="/login" />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
