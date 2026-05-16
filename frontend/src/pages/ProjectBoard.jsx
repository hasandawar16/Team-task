import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Plus, UserPlus } from 'lucide-react';

const ProjectBoard = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/tasks`, newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: newMemberEmail });
      setShowMemberModal(false);
      setNewMemberEmail('');
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || 'Error adding member');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.error || 'Error updating task');
    }
  };

  if (!project) return <div>Loading project...</div>;

  const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowMemberModal(true)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}><UserPlus size={18} /> Add Member</button>
          <button onClick={() => setShowTaskModal(true)}><Plus size={18} /> New Task</button>
        </div>
      </div>

      <div className="board-container">
        {statuses.map(status => (
          <div key={status} className="board-column">
            <div className="column-header">
              <h4 style={{ color: 'white' }}>{status.replace('_', ' ')}</h4>
              <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem' }}>
                {project.tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            {project.tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} className="task-card">
                <div className={`task-badge badge-${task.priority}`}>{task.priority}</div>
                <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>{task.title}</h4>
                <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{task.description}</p>
                
                <div className="flex-between">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {task.assignee ? task.assignee.name : 'Unassigned'}
                  </span>
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    style={{ width: 'auto', padding: '0.2rem', fontSize: '0.75rem', background: 'transparent' }}
                  >
                    <option value="TODO" style={{color: 'black'}}>To Do</option>
                    <option value="IN_PROGRESS" style={{color: 'black'}}>In Progress</option>
                    <option value="DONE" style={{color: 'black'}}>Done</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3 className="mb-4">Create Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="LOW" style={{color: 'black'}}>Low</option>
                  <option value="MEDIUM" style={{color: 'black'}}>Medium</option>
                  <option value="HIGH" style={{color: 'black'}}>High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Assignee</label>
                <select value={newTask.assigneeId} onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}>
                  <option value="" style={{color: 'black'}}>Unassigned</option>
                  {project.members.map(m => (
                    <option key={m.user.id} value={m.user.id} style={{color: 'black'}}>{m.user.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-between mt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>Cancel</button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px' }}>
            <h3 className="mb-4">Add Member</h3>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>User Email</label>
                <input type="email" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} required />
              </div>
              <div className="flex-between mt-4">
                <button type="button" onClick={() => setShowMemberModal(false)} style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>Cancel</button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
