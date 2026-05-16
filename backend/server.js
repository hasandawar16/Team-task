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

// Connect to MongoDB Atlas first before opening the server port
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to MongoDB Atlas via Prisma!');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Fatal: Could not connect to MongoDB Atlas:', error);
    process.exit(1); 
  }
}

startServer();
