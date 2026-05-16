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

// Global error handler to prevent crashes
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Always start the HTTP server so Railway doesn't get a 502
// Log any DB connection errors clearly
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  try {
    await prisma.$connect();
    console.log('Successfully connected to MongoDB Atlas!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
});

