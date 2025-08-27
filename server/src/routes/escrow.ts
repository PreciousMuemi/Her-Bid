import express, { Request, Response } from 'express';
import database from '../models/supabaseDatabase.js';
import matchmaker from '../services/agiMatchmaker.js';

const router = express.Router();

// Generate team recommendation
router.post('/recommend-team', async (req: Request, res: Response) => {
  try {
    const { title, location, capacity_needed, budget, skills_required } = req.body;
    
    const projectRequirements = {
      title,
      location,
      capacity_needed: parseInt(capacity_needed),
      budget: parseFloat(budget),
      skills_required: skills_required || ['Egg Supply']
    };

    const recommendation = matchmaker.findOptimalTeam(projectRequirements);
    
    res.json({
      success: true,
      recommendation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Team recommendation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate team recommendation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Secure funds endpoint - simulates M-Pesa STK Push
router.post('/secure-funds', async (req: Request, res: Response) => {
  try {
    const { project_id, amount, phone_number, team_members } = req.body;
    
    // Validate inputs
    if (!project_id || !amount || !phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: project_id, amount, phone_number'
      });
    }

    // Find or create project
    let project;
    try {
      project = await database.getProjectById(project_id);
    } catch (error) {
      // Create new project
      const projectData = {
        id: project_id,
        title: req.body.title || 'New Project',
        budget: parseFloat(amount),
        status: 'in_progress',
        funds_status: 'pending',
        team_members: team_members || [],
        created_at: new Date().toISOString()
      };
      project = await database.createProject(projectData);
      
      // Create milestones
      const milestones = [
        { project_id, description: 'First delivery batch', percentage: 40, status: 'pending', amount: amount * 0.4 },
        { project_id, description: 'Second delivery batch', percentage: 30, status: 'pending', amount: amount * 0.3 },
        { project_id, description: 'Final delivery batch', percentage: 30, status: 'pending', amount: amount * 0.3 }
      ];
      
      for (const milestone of milestones) {
        await database.createMilestone(milestone);
      }
    }

    // Simulate M-Pesa STK Push
    const checkoutRequestId = `WS${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
    const mpesaReceiptNumber = `MPE${Date.now()}`;
    
    // Update project status
    await database.updateProject(project_id, { funds_status: 'secured' });
    
    // Create escrow details
    const escrowData = {
      project_id,
      checkout_request_id: checkoutRequestId,
      mpesa_receipt_number: mpesaReceiptNumber,
      amount: parseFloat(amount),
      phone_number,
      secured_at: new Date().toISOString(),
      paybill_number: '522533',
      account_reference: project_id
    };
    
    await database.createEscrowDetails(escrowData);

    // Simulate successful M-Pesa response
    setTimeout(() => {
      res.json({
        success: true,
        message: 'Funds successfully secured in escrow',
        escrow_details: {
          project_id,
          amount: parseFloat(amount),
          currency: 'KES',
          status: 'funds_in_escrow',
          checkout_request_id: checkoutRequestId,
          mpesa_receipt_number: mpesaReceiptNumber,
          paybill_number: '522533',
          account_reference: project_id,
          secured_at: new Date().toISOString()
        },
        next_steps: [
          'Team members have been notified',
          'Project execution can begin',
          'Milestone confirmations will release payments'
        ]
      });
    }, 1500); // Simulate processing delay

  } catch (error) {
    console.error('Secure funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to secure funds',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Confirm milestone and release payment
router.post('/confirm-milestone', async (req: Request, res: Response) => {
  try {
    const { project_id, milestone_id, confirmed_by } = req.body;
    
    if (!project_id || !milestone_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: project_id, milestone_id'
      });
    }

    // Find project
    const project = await database.getProjectById(project_id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.funds_status !== 'secured') {
      return res.status(400).json({
        success: false,
        message: 'No funds secured for this project'
      });
    }

    // Find milestone
    const milestones = await database.getMilestonesByProject(project_id);
    const milestone = milestones.find(m => m.id === parseInt(milestone_id));
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    if (milestone.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Milestone already completed'
      });
    }

    // Update milestone status
    const updatedMilestone = await database.updateMilestone(milestone.id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      confirmed_by: confirmed_by
    });

    // Get escrow details
    const escrowDetails = await database.getEscrowByProject(project_id);
    
    // Calculate payments for team members
    const paymentAmount = escrowDetails.amount * (milestone.percentage / 100);
    const teamMembers = project.team_members || [];
    const teamSize = teamMembers.length || 3;
    const paymentPerMember = paymentAmount / teamSize;

    // Create payment records
    const payments = [];
    for (let i = 0; i < teamSize; i++) {
      const member = teamMembers[i] || { id: `user_00${i + 1}`, name: `Team Member ${i + 1}`, phone: `+25471234500${i + 1}` };
      const paymentData = {
        milestone_id: milestone.id,
        user_id: member.id,
        name: member.name,
        amount: Math.round(paymentPerMember),
        phone: member.phone,
        status: 'sent_to_mpesa',
        transaction_id: `TXN${Date.now()}${i}`,
        sent_at: new Date().toISOString()
      };
      const payment = await database.createMilestonePayment(paymentData);
      payments.push(payment);
    }

    // Check if all milestones completed
    const allMilestones = await database.getMilestonesByProject(project_id);
    const completedCount = allMilestones.filter(m => m.status === 'completed').length;
    
    if (completedCount === allMilestones.length) {
      await database.updateProject(project_id, {
        status: 'completed',
        funds_status: 'fully_disbursed'
      });
    }

    res.json({
      success: true,
      message: `Milestone ${milestone_id} confirmed and payments released`,
      milestone_details: {
        milestone_id: milestone.id,
        description: milestone.description,
        percentage: milestone.percentage,
        status: milestone.status,
        completed_at: milestone.completed_at
      },
      payments_released: payments,
      total_amount_released: Math.round(paymentAmount),
      remaining_milestones: project.milestones.filter(m => m.status === 'pending').length,
      project_status: project.status
    });

  } catch (error) {
    console.error('Milestone confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm milestone',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get project status
router.get('/project-status/:project_id', async (req: Request, res: Response) => {
  try {
    const { project_id } = req.params;
    
    const project = await database.getProjectById(project_id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get milestones and calculate progress
    const milestones = await database.getMilestonesByProject(project_id);
    const completedMilestones = milestones.filter(m => m.status === 'completed');
    const totalProgress = completedMilestones.reduce((sum, m) => sum + m.percentage, 0);
    
    // Calculate total disbursed
    let totalDisbursed = 0;
    for (const milestone of completedMilestones) {
      const payments = await database.getPaymentsByMilestone(milestone.id);
      totalDisbursed += payments.reduce((sum, p) => sum + p.amount, 0);
    }
    
    const escrowDetails = await database.getEscrowByProject(project_id);

    res.json({
      success: true,
      project: {
        ...project,
        milestones,
        escrow_details: escrowDetails,
        progress_percentage: totalProgress,
        total_disbursed: totalDisbursed,
        remaining_in_escrow: escrowDetails ? escrowDetails.amount - totalDisbursed : 0
      }
    });

  } catch (error) {
    console.error('Project status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get project status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user profile
router.get('/user-profile/:user_id', async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    
    const userProfile = await database.getUserById(user_id);
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      profile: userProfile
    });

  } catch (error) {
    console.error('User profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
