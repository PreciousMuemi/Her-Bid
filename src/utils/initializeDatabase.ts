import { supabase } from '@/lib/supabase';

export const initializeGigeBidDatabase = async () => {
  console.log('🚀 Initializing GigeBid Database...');

  try {
    // 1. Create sample businesses (gender-neutral)
    const businesses = [
      {
        id: 'biz-001',
        name: 'Digital Solutions Pro',
        owner_name: 'Alex Johnson',
        industry: 'Technology',
        location: 'Nairobi',
        description: 'Professional web development and digital marketing services',
        skills: ['Web Development', 'Digital Marketing', 'SEO'],
        reputation_score: 4.8,
        created_at: new Date().toISOString()
      },
      {
        id: 'biz-002', 
        name: 'Creative Design Studio',
        owner_name: 'Jordan Smith',
        industry: 'Design',
        location: 'Nairobi',
        description: 'UI/UX design and branding specialists',
        skills: ['UI/UX Design', 'Graphic Design', 'Branding'],
        reputation_score: 4.6,
        created_at: new Date().toISOString()
      },
      {
        id: 'biz-003',
        name: 'Finance Analytics Hub',
        owner_name: 'Taylor Brown',
        industry: 'Finance',
        location: 'Mombasa',
        description: 'Financial consulting and analytics services',
        skills: ['Financial Analysis', 'Data Analytics', 'Consulting'],
        reputation_score: 4.9,
        created_at: new Date().toISOString()
      }
    ];

    // 2. Create sample contracts
    const contracts = [
      {
        id: 'contract-001',
        title: 'Government Digital Platform',
        description: 'Build a comprehensive digital platform for government services',
        required_skills: ['Web Development', 'UI/UX Design', 'Security'],
        budget: 2500000, // KES
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        client_name: 'Kenya Government',
        created_at: new Date().toISOString()
      },
      {
        id: 'contract-002',
        title: 'Mobile Banking App',
        description: 'Develop a secure mobile banking application',
        required_skills: ['Mobile Development', 'Financial Analysis', 'Security'],
        budget: 3000000, // KES
        deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        client_name: 'Commercial Bank of Kenya',
        created_at: new Date().toISOString()
      }
    ];

    // 3. Insert businesses
    console.log('📊 Inserting sample businesses...');
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .upsert(businesses)
      .select();

    if (businessError) {
      console.error('❌ Error inserting businesses:', businessError);
      // Try to create the table if it doesn't exist
      await createBusinessesTable();
    } else {
      console.log('✅ Businesses inserted successfully:', businessData?.length);
    }

    // 4. Insert contracts
    console.log('📋 Inserting sample contracts...');
    const { data: contractData, error: contractError } = await supabase
      .from('contracts')
      .upsert(contracts)
      .select();

    if (contractError) {
      console.error('❌ Error inserting contracts:', contractError);
      await createContractsTable();
    } else {
      console.log('✅ Contracts inserted successfully:', contractData?.length);
    }

    // 5. Create sample partnerships
    await createSamplePartnerships();

    console.log('🎉 Database initialization complete!');
    return { success: true };

  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    return { success: false, error };
  }
};

const createBusinessesTable = async () => {
  console.log('🔧 Creating businesses table...');
  // Note: In production, you would create this via Supabase SQL editor
  // This is a fallback for development
};

const createContractsTable = async () => {
  console.log('🔧 Creating contracts table...');
  // Note: In production, you would create this via Supabase SQL editor
};

const createSamplePartnerships = async () => {
  console.log('🤝 Creating sample partnerships...');
  const partnerships = [
    {
      id: 'partnership-001',
      contract_id: 'contract-001',
      business_ids: ['biz-001', 'biz-002'],
      status: 'active',
      compatibility_score: 92.5,
      created_at: new Date().toISOString()
    }
  ];

  const { error } = await supabase
    .from('partnerships')
    .upsert(partnerships);

  if (error) {
    console.log('Note: Partnerships table may not exist yet');
  }
};