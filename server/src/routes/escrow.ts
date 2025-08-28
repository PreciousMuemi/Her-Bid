import express, { Request, Response } from 'express';
import matchmaker from '../services/agiMatchmaker.ts';
import database from '../models/supabaseDatabase.ts';

const router = express.Router();

// Team recommendation endpoint
router.post('/recommend-team', async (req: Request, res: Response) => {
  try {
    console.log('🎯 Team recommendation request received:', req.body);

    const { title, location, capacity_needed, budget, skills_required } = req.body;

    if (!location || !capacity_needed) {
      return res.status(400).json({
        success: false,
        message: 'Location and capacity_needed are required'
      });
    }

    // Call the correct method name
    const recommendation = await matchmaker.findOptimalTeam({
      capacity_needed: parseInt(capacity_needed),
      location,
      skills_required: skills_required || ['Egg Supply', 'Logistics'],
      budget: parseFloat(budget) || 0
    });

    res.json({
      success: true,
      recommendation,
      timestamp: new Date().toISOString(),
      request_data: { title, location, capacity_needed, budget }
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

// Secure funds endpoint - Real M-Pesa STK Push via Supabase
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

    console.log('🔒 Securing funds via real M-Pesa integration...');
    console.log('Project ID:', project_id);
    console.log('Amount:', amount);
    console.log('Phone:', phone_number);

    // Call the Supabase M-Pesa STK Push function
    const mpesaResponse = await fetch(`${process.env.SUPABASE_URL}/functions/v1/mpesa-stk-push`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone_number: phone_number,
        amount: parseFloat(amount),
        order_id: project_id,
        account_reference: `HerBid-${project_id}`
      })
    });

    const mpesaData = await mpesaResponse.json();
    
    if (!mpesaResponse.ok || !mpesaData.success) {
      console.error('❌ M-Pesa STK Push failed:', mpesaData);
      throw new Error(mpesaData.error || 'M-Pesa payment initiation failed');
    }

    console.log('✅ M-Pesa STK Push successful:', mpesaData);

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
    
    // Create escrow details with real M-Pesa data
    const escrowData = {
      project_id,
      checkout_request_id: mpesaData.checkout_request_id,
      mpesa_receipt_number: null, // Will be updated by callback
      amount: parseFloat(amount),
      phone_number,
      secured_at: new Date().toISOString(),
      paybill_number: process.env.MPESA_SHORTCODE || '174379',
      account_reference: `HerBid-${project_id}`
    };
    
    await database.createEscrowDetails(escrowData);

    // Send SMS notification about payment request
    try {
      await fetch(`${process.env.SUPABASE_URL}/functions/v1/africastalking`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'send_sms',
          to: phone_number,
          message: `Her-Bid payment request sent to your phone. Please enter your M-Pesa PIN to secure KES ${amount} for project ${project_id}. Your funds are protected by escrow.`,
          notification_type: 'payment_request'
        })
      });
      console.log('📱 SMS notification sent');
    } catch (smsError) {
      console.warn('⚠️ SMS notification failed:', smsError);
    }

    res.json({
      success: true,
      message: 'M-Pesa payment request sent successfully',
      escrow_details: {
        project_id,
        amount: parseFloat(amount),
        currency: 'KES',
        status: 'payment_pending',
        checkout_request_id: mpesaData.checkout_request_id,
        merchant_request_id: mpesaData.merchant_request_id,
        customer_message: mpesaData.customer_message,
        account_reference: `HerBid-${project_id}`,
        secured_at: new Date().toISOString()
      },
      next_steps: [
        'Check your phone for M-Pesa payment prompt',
        'Enter your M-Pesa PIN to confirm payment',
        'Funds will be secured in escrow upon confirmation',
        'Team members will be notified to begin work'
      ]
    });

  } catch (error) {
    console.error('❌ Secure funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to secure funds with M-Pesa',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Check M-Pesa credentials and network connection'
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
