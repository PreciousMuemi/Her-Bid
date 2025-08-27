const express = require('express');
const { db } = require('../models/database');

const router = express.Router();

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, status = 'open' } = req.query;
    
    const filters = { category, search, status };
    const jobs = await db.getJobs(filters);
    
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

// Get single job by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const jobResult = await db.query(`
      SELECT j.*, u.full_name as poster_name, u.rating as poster_rating, u.phone as poster_phone,
             array_agg(DISTINCT jt.tag) as tags
      FROM jobs j
      LEFT JOIN users u ON j.poster_id = u.id
      LEFT JOIN job_tags jt ON j.id = jt.job_id
      WHERE j.id = $1
      GROUP BY j.id, u.full_name, u.rating, u.phone
    `, [id]);
    
    if (jobResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Get milestones
    const milestonesResult = await db.query(
      'SELECT * FROM job_milestones WHERE job_id = $1 ORDER BY id',
      [id]
    );
    
    // Get applications count
    const applicationsResult = await db.query(
      'SELECT COUNT(*) as count FROM job_applications WHERE job_id = $1',
      [id]
    );
    
    const job = jobResult.rows[0];
    job.milestones = milestonesResult.rows;
    job.applicant_count = parseInt(applicationsResult.rows[0].count);
    
    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      location,
      deadline,
      poster_id,
      tags,
      milestones
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !category || !budget || !poster_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, category, budget, poster_id'
      });
    }
    
    const jobData = {
      title,
      description,
      category,
      budget: parseFloat(budget),
      location,
      deadline,
      poster_id,
      tags: tags || [],
      milestones: milestones || []
    };
    
    const job = await db.createJob(jobData);
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
});

// Apply for a job
router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { applicant_id, proposal, proposed_budget } = req.body;
    
    if (!applicant_id || !proposal) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: applicant_id, proposal'
      });
    }
    
    // Check if user already applied
    const existingApplication = await db.query(
      'SELECT id FROM job_applications WHERE job_id = $1 AND applicant_id = $2',
      [id, applicant_id]
    );
    
    if (existingApplication.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }
    
    const result = await db.query(
      `INSERT INTO job_applications (job_id, applicant_id, proposal, proposed_budget)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, applicant_id, proposal, proposed_budget ? parseFloat(proposed_budget) : null]
    );
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
});

// Get job applications
router.get('/:id/applications', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT ja.*, u.full_name, u.rating, u.skills, u.bio
      FROM job_applications ja
      JOIN users u ON ja.applicant_id = u.id
      WHERE ja.job_id = $1
      ORDER BY ja.applied_at DESC
    `, [id]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// Get user's applications
router.get('/user/:user_id/applications', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await db.query(`
      SELECT ja.*, j.title, j.budget, j.location, j.status as job_status
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.applicant_id = $1
      ORDER BY ja.applied_at DESC
    `, [user_id]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// Get user's posted jobs
router.get('/user/:user_id/posted', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await db.query(`
      SELECT j.*, COUNT(ja.id) as application_count
      FROM jobs j
      LEFT JOIN job_applications ja ON j.id = ja.job_id
      WHERE j.poster_id = $1
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `, [user_id]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posted jobs',
      error: error.message
    });
  }
});

module.exports = router;
