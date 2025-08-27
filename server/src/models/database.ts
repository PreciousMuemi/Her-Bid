import { Pool, QueryResult } from 'pg';

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gige_bid',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Database schema creation
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        google_id VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        location VARCHAR(255),
        skills TEXT[],
        bio TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        total_jobs INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        budget DECIMAL(10,2) NOT NULL,
        location VARCHAR(255),
        deadline DATE,
        status VARCHAR(50) DEFAULT 'open',
        poster_id INTEGER REFERENCES users(id),
        escrow_amount DECIMAL(10,2),
        escrow_status VARCHAR(50) DEFAULT 'pending',
        mpesa_transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Job milestones table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_milestones (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Job applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        applicant_id INTEGER REFERENCES users(id),
        proposal TEXT NOT NULL,
        proposed_budget DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Job tags table
    await client.query(`
      CREATE TABLE IF NOT EXISTS job_tags (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        tag VARCHAR(100) NOT NULL
      )
    `);

    // M-Pesa transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mpesa_transactions (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id),
        user_id INTEGER REFERENCES users(id),
        phone_number VARCHAR(20) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        transaction_type VARCHAR(50) NOT NULL,
        mpesa_receipt_number VARCHAR(255),
        checkout_request_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
      CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
      CREATE INDEX IF NOT EXISTS idx_jobs_poster ON jobs(poster_id);
      CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
      CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(applicant_id);
      CREATE INDEX IF NOT EXISTS idx_mpesa_status ON mpesa_transactions(status);
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Database query helper functions
const db = {
  query: (text: string, params?: any[]): Promise<QueryResult> => pool.query(text, params),
  
  // User operations
  createUser: async (userData: any) => {
    const { email, password_hash, google_id, full_name, phone, location, skills, bio } = userData;
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, google_id, full_name, phone, location, skills, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [email, password_hash, google_id, full_name, phone, location, skills, bio]
    );
    return result.rows[0];
  },

  getUserByEmail: async (email: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  getUserById: async (id: number) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Job operations
  createJob: async (jobData: any) => {
    const { title, description, category, budget, location, deadline, poster_id, tags, milestones } = jobData;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create job
      const jobResult = await client.query(
        `INSERT INTO jobs (title, description, category, budget, location, deadline, poster_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, category, budget, location, deadline, poster_id]
      );
      
      const job = jobResult.rows[0];
      
      // Add tags
      if (tags && tags.length > 0) {
        for (const tag of tags) {
          await client.query(
            'INSERT INTO job_tags (job_id, tag) VALUES ($1, $2)',
            [job.id, tag]
          );
        }
      }
      
      // Add milestones
      if (milestones && milestones.length > 0) {
        for (const milestone of milestones) {
          await client.query(
            'INSERT INTO job_milestones (job_id, description, amount) VALUES ($1, $2, $3)',
            [job.id, milestone.description, milestone.amount]
          );
        }
      }
      
      await client.query('COMMIT');
      return job;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  getJobs: async (filters: any = {}) => {
    let query = `
      SELECT j.*, u.full_name as poster_name, u.rating as poster_rating,
             array_agg(DISTINCT jt.tag) as tags,
             COUNT(DISTINCT ja.id) as applicant_count
      FROM jobs j
      LEFT JOIN users u ON j.poster_id = u.id
      LEFT JOIN job_tags jt ON j.id = jt.job_id
      LEFT JOIN job_applications ja ON j.id = ja.job_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (filters.category && filters.category !== 'all') {
      conditions.push(`j.category = $${params.length + 1}`);
      params.push(filters.category);
    }
    
    if (filters.search) {
      conditions.push(`(j.title ILIKE $${params.length + 1} OR j.description ILIKE $${params.length + 1})`);
      params.push(`%${filters.search}%`);
    }
    
    if (filters.status) {
      conditions.push(`j.status = $${params.length + 1}`);
      params.push(filters.status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY j.id, u.full_name, u.rating ORDER BY j.created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  },

  // M-Pesa transaction operations
  createMpesaTransaction: async (transactionData: any) => {
    const { job_id, user_id, phone_number, amount, transaction_type, checkout_request_id } = transactionData;
    const result = await pool.query(
      `INSERT INTO mpesa_transactions (job_id, user_id, phone_number, amount, transaction_type, checkout_request_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [job_id, user_id, phone_number, amount, transaction_type, checkout_request_id]
    );
    return result.rows[0];
  },

  updateMpesaTransaction: async (checkout_request_id: string, updateData: any) => {
    const { status, mpesa_receipt_number } = updateData;
    const result = await pool.query(
      `UPDATE mpesa_transactions 
       SET status = $1, mpesa_receipt_number = $2, updated_at = CURRENT_TIMESTAMP
       WHERE checkout_request_id = $3 RETURNING *`,
      [status, mpesa_receipt_number, checkout_request_id]
    );
    return result.rows[0];
  }
};

export { pool, createTables, db };
