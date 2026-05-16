import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Plus } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <h2>Your Projects</h2>
        <button onClick={() => setShowModal(true)}><Plus size={18} /> New Project</button>
      </div>

      <div className="stats-grid">
        {projects.map(p => (
          <Link to={`/projects/${p.id}`} key={p.id} style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{p.name}</h3>
              <p>{p.description || 'No description provided.'}</p>
              <div className="mt-4" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Members: {p.members.length}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3 className="mb-4">Create Project</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Name</label>
                <input value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div className="flex-between mt-4">
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>Cancel</button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
