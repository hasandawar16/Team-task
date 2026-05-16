import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, FolderKanban } from 'lucide-react';

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <FolderKanban className="icon-lg" />
        <span>TeamTasks</span>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link"><LayoutDashboard size={18} /> Dashboard</Link>
        <Link to="/projects" className="nav-link"><FolderKanban size={18} /> Projects</Link>
        <button onClick={handleLogout} className="btn-icon"><LogOut size={18} /> Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
