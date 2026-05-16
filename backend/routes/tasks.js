const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Create a task
router.post('/projects/:projectId/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assigneeId } = req.body;
    const { projectId } = req.params;

    // Check if user is member/admin
    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } }
    });
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (project.ownerId !== req.user.id && !membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (project.ownerId !== req.user.id && membership.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can create tasks' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a task (Members can update status of assigned tasks, Admins can update anything)
router.patch('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const { status, title, description, priority, assigneeId } = req.body;
    const taskId = req.params.id;

    const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const projectId = task.projectId;
    const project = task.project;

    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } }
    });

    const isAdmin = project.ownerId === req.user.id || (membership && membership.role === 'ADMIN');
    const isAssignee = task.assigneeId === req.user.id;

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    // Members can only update status
    const dataToUpdate = {};
    if (status) dataToUpdate.status = status;

    if (isAdmin) {
      if (title) dataToUpdate.title = title;
      if (description) dataToUpdate.description = description;
      if (priority) dataToUpdate.priority = priority;
      if (assigneeId !== undefined) dataToUpdate.assigneeId = assigneeId;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: dataToUpdate
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
