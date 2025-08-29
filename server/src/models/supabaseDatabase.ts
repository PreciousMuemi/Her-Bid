import { createClient } from '@supabase/supabase-js';

export class SupabaseDatabase {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    console.log('🔧 Supabase Config Check:');
    console.log('URL:', supabaseUrl);
    console.log('Service Key exists:', !!supabaseKey);
    console.log('Service Key prefix:', supabaseKey?.substring(0, 20) + '...');
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getAllUsers(): Promise<any[]> {
    try {
      console.log('🔄 Querying users table...');
      
      // First, try with basic columns that are likely to exist
      const { data, error } = await this.supabase
        .from('users')
        .select('id, name, email, skills, location')
        .limit(100);

      if (error) {
        console.error('❌ Supabase query error:', error);
        
        // If the table doesn't exist, create some demo data structure
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('📊 Users table does not exist, using fallback approach');
          throw new Error(`Database table not found: ${error.message}`);
        }
        
        throw new Error(`Database error: ${error.message}`);
      }

      console.log(`✅ Successfully retrieved ${data?.length || 0} users from database`);
      
      // Transform data to match expected format
      const transformedUsers = (data || []).map(user => ({
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email || 'no-email@example.com',
        skills: Array.isArray(user.skills) ? user.skills : ['General'],
        location: user.location || 'Nairobi',
        capacity_numeric: 5, // Default capacity
        reputation_score: 8.5, // Default reputation
        projects_completed: 10, // Default projects
        specialization: user.skills?.[0] || 'General',
        created_at: new Date().toISOString()
      }));

      return transformedUsers;
      
    } catch (error) {
      console.error('❌ Database connection error:', error);
      throw error;
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert({
          name: userData.name,
          email: userData.email,
          skills: userData.skills || [],
          location: userData.location || 'Nairobi'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  async getProjectById(id: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  }

  async createProject(projectData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async createMilestone(milestoneData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('project_milestones')
        .insert(milestoneData)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create milestone error:', error);
      throw error;
    }
  }

  async createEscrow(escrowData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('escrow_details')
        .insert(escrowData)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create escrow error:', error);
      throw error;
    }
  }

  async createEscrowDetails(escrowData: any): Promise<any> {
    return this.createEscrow(escrowData);
  }

  async createMilestonePayment(paymentData: any): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('milestone_payments')
        .insert(paymentData)
        .select()
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create milestone payment error:', error);
      throw error;
    }
  }
}

// Export instance as default
const database = new SupabaseDatabase();
export default database;
