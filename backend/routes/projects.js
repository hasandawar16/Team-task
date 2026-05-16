const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Get all projects the user is part of (as owner or member)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        owner: { select: { id: true, name: true, email: true } }
      }
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        owner: { select: { id: true, name: true, email: true } },
        tasks: { include: { assignee: { select: { id: true, name: true } } } }
      }
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    // Simple check: is user owner or member?
    const isOwner = project.ownerId === req.user.id;
    const isMember = project.members.some(m => m.userId === req.user.id);
    
    if (!isOwner && !isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'ADMIN'
          }
        }
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add member to project (Admin only)
router.post('/:id/members', authMiddleware, async (req, res) => {
  try {
    const { email, role } = req.body;
    const projectId = req.params.id;

    // Check if requester is ADMIN
    const requesterMember = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId: projectId } }
    });

    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (project.ownerId !== req.user.id && (!requesterMember || requesterMember.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Only admins can add members' });
    }

    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return res.status(404).json({ error: 'User not found' });

    const newMember = await prisma.projectMember.create({
      data: {
        userId: userToAdd.id,
        projectId: projectId,
        role: role || 'MEMBER'
      }
    });

    res.status(201).json(newMember);
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'User is already a member' });
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
