const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all projects the user is part of
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      select: { id: true }
    });

    const projectIds = projects.map(p => p.id);

    // If user has no projects, return empty stats
    if (projectIds.length === 0) {
      return res.json({
        totalTasks: 0,
        byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
        overdueTasks: 0,
        myTasks: 0
      });
    }

    // Tasks across user's projects
    const allTasks = await prisma.task.findMany({
      where: { projectId: { in: projectIds } }
    });

    const totalTasks = allTasks.length;
    
    const byStatus = {
      TODO: allTasks.filter(t => t.status === 'TODO').length,
      IN_PROGRESS: allTasks.filter(t => t.status === 'IN_PROGRESS').length,
      DONE: allTasks.filter(t => t.status === 'DONE').length,
    };

    const myTasks = allTasks.filter(t => t.assigneeId === userId).length;

    const today = new Date();
    const overdueTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'DONE').length;

    res.json({
      totalTasks,
      byStatus,
      overdueTasks,
      myTasks
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
