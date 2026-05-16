require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes); // Tasks routes handle /projects/:projectId/tasks and /tasks/:id
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Team Task Manager API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
