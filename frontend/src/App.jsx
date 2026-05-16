import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectBoard from './pages/ProjectBoard';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Auth setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/projects" element={isAuthenticated ? <ProjectList /> : <Navigate to="/login" />} />
          <Route path="/projects/:id" element={isAuthenticated ? <ProjectBoard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
