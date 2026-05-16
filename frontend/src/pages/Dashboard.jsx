import React, { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!stats) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="flex-between mb-4">
        <h1>Welcome back, {user.name}!</h1>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-primary)' }}><ListTodo size={32} /></div>
          <div>
            <h3>Total Tasks</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stats.totalTasks}</p>
          </div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-icon" style={{ color: 'var(--success)' }}><CheckCircle size={32} /></div>
          <div>
            <h3>Completed</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stats.byStatus.DONE || 0}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ color: 'var(--warning)' }}><Clock size={32} /></div>
          <div>
            <h3>In Progress</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stats.byStatus.IN_PROGRESS || 0}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ color: 'var(--danger)' }}><AlertTriangle size={32} /></div>
          <div>
            <h3>Overdue</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>{stats.overdueTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
