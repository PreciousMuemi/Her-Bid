import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration:');
  console.error('SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  throw new Error('Missing Supabase environment variables');
}

console.log('🔧 Supabase Config Check:');
console.log('URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseServiceKey);
console.log('Service Key prefix:', supabaseServiceKey?.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

class SupabaseDatabase {
  // Users operations
  async getAllUsers(): Promise<any[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} users`);
    return data || [];
  }

  async getUserById(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Supabase query error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`✅ Successfully fetched user: ${data?.name || 'Unknown'}`);
    return data;
  }

  async createUser(userData: any): Promise<any> {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log(`✅ Successfully created user: ${data.name}`);
    return data;
  }

  async updateUser(userId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Projects operations
  async getAllProjects(): Promise<any[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_milestones(*),
        escrow_details(*)
      `);

    if (error) throw error;
    return data;
  }

  async getProjectById(projectId: string): Promise<any> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_milestones(*),
        escrow_details(*)
      `)
      .eq('id', projectId)
      .single();

    if (error) throw error;
    return data;
  }

  async createProject(projectData: any): Promise<any> {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProject(projectId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Milestones operations
  async createMilestone(milestoneData: any): Promise<any> {
    const { data, error } = await supabase
      .from('project_milestones')
      .insert([milestoneData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMilestone(milestoneId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('project_milestones')
      .update(updates)
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMilestonesByProject(projectId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('id');

    if (error) throw error;
    return data;
  }

  // Milestone payments operations
  async createMilestonePayment(paymentData: any): Promise<any> {
    const { data, error } = await supabase
      .from('milestone_payments')
      .insert([paymentData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMilestonePayment(paymentId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('milestone_payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPaymentsByMilestone(milestoneId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('milestone_payments')
      .select('*')
      .eq('milestone_id', milestoneId);

    if (error) throw error;
    return data;
  }

  // Escrow operations
  async createEscrowDetails(escrowData: any): Promise<any> {
    const { data, error } = await supabase
      .from('escrow_details')
      .insert([escrowData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEscrowDetails(projectId: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('escrow_details')
      .update(updates)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getEscrowByProject(projectId: string): Promise<any> {
    const { data, error } = await supabase
      .from('escrow_details')
      .select('*')
      .eq('project_id', projectId)
      .single();

    if (error) throw error;
    return data;
  }

  // Seed initial data
  async seedInitialData(): Promise<void> {
    // Check if users already exist
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      console.log('Database already seeded');
      return;
    }

    // Seed users
    const users = [
      {
        id: "user_001",
        name: "Mary Wanjiku",
        location: "Kibera, Nairobi",
        skills: ["Egg Supply", "Poultry Management", "Local Distribution"],
        capacity: "3 schools/day",
        capacity_numeric: 3,
        reputation_score: 9.2,
        phone: "+254712345001",
        completed_projects: [
          "Successfully delivered 2,000 eggs to St. Mary's Primary School",
          "Supplied fresh eggs to 5 schools in Kibera for 3 months",
          "Managed poultry distribution for community feeding program"
        ],
        total_earnings: 45000,
        projects_completed: 12,
        specialization: "egg_supply"
      },
      {
        id: "user_002",
        name: "Grace Nyokabi",
        location: "Kibera, Nairobi",
        skills: ["Egg Supply", "Quality Control", "Bulk Purchasing"],
        capacity: "4 schools/day",
        capacity_numeric: 4,
        reputation_score: 8.8,
        phone: "+254712345002",
        completed_projects: [
          "Delivered 3,500 eggs to 8 schools in one week",
          "Quality-checked egg supplies for government feeding program",
          "Coordinated bulk egg purchases for 15 local vendors"
        ],
        total_earnings: 38000,
        projects_completed: 9,
        specialization: "egg_supply"
      },
      {
        id: "user_003",
        name: "Sarah Muthoni",
        location: "Kibera, Nairobi",
        skills: ["Egg Supply", "Transportation", "Customer Relations"],
        capacity: "2 schools/day",
        capacity_numeric: 2,
        reputation_score: 9.0,
        phone: "+254712345003",
        completed_projects: [
          "Transported and delivered eggs to remote schools in Kibera",
          "Maintained excellent customer relationships with 10+ schools",
          "Never missed a delivery deadline in 8 months"
        ],
        total_earnings: 32000,
        projects_completed: 8,
        specialization: "egg_supply"
      },
      {
        id: "user_004",
        name: "James Kiprotich",
        location: "Kibera, Nairobi",
        skills: ["Logistics", "Transportation", "Route Optimization"],
        capacity: "15 schools/day",
        capacity_numeric: 15,
        reputation_score: 9.5,
        phone: "+254712345004",
        completed_projects: [
          "Optimized delivery routes for 20+ schools saving 30% time",
          "Managed logistics for large-scale feeding programs",
          "Coordinated transportation for multiple suppliers simultaneously"
        ],
        total_earnings: 67000,
        projects_completed: 18,
        specialization: "logistics"
      },
      {
        id: "user_005",
        name: "Agnes Wambui",
        location: "Mathare, Nairobi",
        skills: ["Egg Supply", "Inventory Management", "Quality Assurance"],
        capacity: "3 schools/day",
        capacity_numeric: 3,
        reputation_score: 8.5,
        phone: "+254712345005",
        completed_projects: [
          "Managed inventory for 12 schools with zero wastage",
          "Implemented quality assurance protocols for egg suppliers",
          "Reduced spoilage rates by 40% through better inventory management"
        ],
        total_earnings: 41000,
        projects_completed: 10,
        specialization: "egg_supply"
      },
      {
        id: "user_006",
        name: "Peter Ochieng",
        location: "Eastlands, Nairobi",
        skills: ["Logistics", "Fleet Management", "Coordination"],
        capacity: "20 schools/day",
        capacity_numeric: 20,
        reputation_score: 8.9,
        phone: "+254712345006",
        completed_projects: [
          "Managed fleet of 8 vehicles for school feeding program",
          "Coordinated deliveries to 50+ schools across Nairobi",
          "Reduced delivery costs by 25% through route optimization"
        ],
        total_earnings: 78000,
        projects_completed: 22,
        specialization: "logistics"
      },
      {
        id: "user_007",
        name: "Catherine Njeri",
        location: "Kawangware, Nairobi",
        skills: ["Egg Supply", "Community Relations", "Bulk Sourcing"],
        capacity: "2 schools/day",
        capacity_numeric: 2,
        reputation_score: 9.1,
        phone: "+254712345007",
        completed_projects: [
          "Built strong relationships with 15+ schools in Kawangware",
          "Sourced high-quality eggs directly from farmers",
          "Maintained 100% on-time delivery record for 10 months"
        ],
        total_earnings: 35000,
        projects_completed: 11,
        specialization: "egg_supply"
      },
      {
        id: "user_008",
        name: "David Mutua",
        location: "Kibera, Nairobi",
        skills: ["Quality Control", "Documentation", "Compliance"],
        capacity: "10 schools/day",
        capacity_numeric: 10,
        reputation_score: 9.3,
        phone: "+254712345008",
        completed_projects: [
          "Ensured 100% compliance with food safety standards",
          "Documented quality control processes for 25+ suppliers",
          "Reduced quality complaints by 60% through systematic checks"
        ],
        total_earnings: 52000,
        projects_completed: 15,
        specialization: "quality_control"
      }
    ];

    const { error: usersError } = await supabase
      .from('users')
      .insert(users);

    if (usersError) {
      console.error('Error seeding users:', usersError);
      throw usersError;
    }

    console.log('Database seeded successfully with initial data');
  }

  // Additional methods
  async getUsersBySkills(skills: string[]) {
    try {
      console.log(`🔍 Fetching users with skills: ${skills.join(', ')}`);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .contains('skills', skills);

      if (error) {
        console.error('❌ Supabase query error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log(`✅ Found ${data?.length || 0} users with matching skills`);
      return data || [];
    } catch (error) {
      console.error('❌ getUsersBySkills error:', error);
      throw error;
    }
  }

  async getUsersByLocation(location: string) {
    try {
      console.log(`🔍 Fetching users in location: ${location}`);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .ilike('location', `%${location}%`);

      if (error) {
        console.error('❌ Supabase query error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log(`✅ Found ${data?.length || 0} users in ${location}`);
      return data || [];
    } catch (error) {
      console.error('❌ getUsersByLocation error:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        console.error('❌ Connection test failed:', error);
        return false;
      }

      console.log('✅ Database connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Connection test error:', error);
      return false;
    }
  }
}

const database = new SupabaseDatabase();
export default database;
