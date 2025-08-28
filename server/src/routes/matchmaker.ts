import { Router } from 'express';
import matchmaker from '../services/matchmaker.js';
import escrow from '../services/escrow.js';

const router = Router();

// Get all users
router.get('/users', (req, res) => {
  try {
    const users = matchmaker.getUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile
router.get('/users/:userId', (req, res) => {
  try {
    const user = matchmaker.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all projects
router.get('/projects', (req, res) => {
  try {
    const projects = matchmaker.getProjects();
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get project by ID
router.get('/projects/:projectId', (req, res) => {
  try {
    const project = matchmaker.getProjectById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Find optimal team for project
router.post('/match-team', (req, res) => {
  try {
    const { projectId } = req.body;
    
    if (!projectId) {
      return res.status(400).json({ success: false, error: 'Project ID is required' });
    }

    const matchResult = matchmaker.findOptimalTeam(projectId);
    
    res.json({ 
      success: true, 
      match_result: matchResult,
      message: 'Team matching completed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign team to project
router.post('/assign-team', (req, res) => {
  try {
    const { projectId, teamIds } = req.body;
    
    if (!projectId || !teamIds) {
      return res.status(400).json({ success: false, error: 'Project ID and team IDs are required' });
    }

    const team = teamIds.map((id: string) => matchmaker.getUserById(id)).filter(Boolean);
    matchmaker.assignTeamToProject(projectId, team);
    
    res.json({ 
      success: true, 
      message: 'Team assigned successfully',
      team_size: team.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Secure funds endpoint
router.post('/secure-funds', async (req, res) => {
  try {
    const { projectId, amount, phoneNumber } = req.body;
    
    if (!projectId || !amount || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project ID, amount, and phone number are required' 
      });
    }

    const result = await escrow.secureFunds(projectId, amount, phoneNumber);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Confirm milestone endpoint
router.post('/confirm-milestone', async (req, res) => {
  try {
    const { projectId, teamMemberId } = req.body;
    
    if (!projectId || !teamMemberId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Project ID and team member ID are required' 
      });
    }

    const result = await escrow.confirmMilestone(projectId, teamMemberId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get transactions for project
router.get('/transactions/:projectId', (req, res) => {
  try {
    const transactions = escrow.getTransactionsByProject(req.params.projectId);
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;