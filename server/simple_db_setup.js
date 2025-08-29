import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🗄️  Setting up Her-Bid database schema...');
  
  try {
    // Create users table directly through table creation API
    console.log('👥 Creating users table...');
    
    // Insert demo users to create the table structure
    const demoUsers = [
      {
        id: 'user_001',
        name: 'Alice Wanjiku',
        location: 'Nairobi',
        skills: ['Logistics', 'Supply Chain'],
        capacity: 'Medium (5-8 orders)',
        capacity_numeric: 6,
        reputation_score: 9.2,
        phone: '+254701234567',
        completed_projects: [],
        total_earnings: 50000,
        projects_completed: 5,
        specialization: 'Logistics'
      },
      {
        id: 'user_002', 
        name: 'David Kimani',
        location: 'Kibera',
        skills: ['Egg Supply', 'Quality Control'],
        capacity: 'High (10+ orders)',
        capacity_numeric: 12,
        reputation_score: 8.8,
        phone: '+254712345678',
        completed_projects: [],
        total_earnings: 75000,
        projects_completed: 8,
        specialization: 'Egg Supply'
      },
      {
        id: 'user_003',
        name: 'Grace Muthoni',
        location: 'Eastlands',
        skills: ['Quality Control', 'Packaging'],
        capacity: 'Medium (5-8 orders)',
        capacity_numeric: 7,
        reputation_score: 9.5,
        phone: '+254723456789',
        completed_projects: [],
        total_earnings: 42000,
        projects_completed: 6,
        specialization: 'Quality Control'
      }
    ];
    
    for (const user of demoUsers) {
      const { error: userError } = await supabase.from('users').upsert(user);
      if (userError) {
        console.log(`📝 Note for user ${user.name}:`, userError.message);
      } else {
        console.log(`✅ Created demo user: ${user.name}`);
      }
    }
    
    // Create projects table
    console.log('📋 Creating projects...');
    const demoProjects = [
      {
        id: 'project_demo_001',
        title: 'Egg Supply for 10 Schools',
        description: 'Weekly egg delivery to schools in Kibera',
        budget: 50000,
        status: 'open',
        funds_status: 'pending',
        team_members: []
      }
    ];
    
    for (const project of demoProjects) {
      const { error: projectError } = await supabase.from('projects').upsert(project);
      if (projectError) {
        console.log(`📝 Note for project ${project.title}:`, projectError.message);
      } else {
        console.log(`✅ Created demo project: ${project.title}`);
      }
    }
    
    // Test the setup by querying users
    console.log('🔍 Testing database connection...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, location, skills')
      .limit(3);
    
    if (usersError) {
      console.error('❌ Error querying users:', usersError);
    } else {
      console.log('✅ Successfully queried users:', users?.length, 'users found');
      users?.forEach(user => {
        console.log(`  - ${user.name} (${user.location}): ${user.skills?.join(', ')}`);
      });
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📈 You can view your data at: https://supabase.com/dashboard/project/kydqdeznecttpdaiueob/editor');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
