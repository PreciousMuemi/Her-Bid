import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import database from '../models/supabaseDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load user data
const loadUserData = (): any => {
  const dataPath = path.join(__dirname, '../data/users.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(rawData);
};

// Save updated data
const saveUserData = (data: any): void => {
  const dataPath = path.join(__dirname, '../data/users.json');
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// AGI Matchmaker Engine
export class AGIMatchmaker {
  private data: any;

  constructor() {
    this.data = { users: [] };
    this.initializeDatabase();
  }

  async initializeDatabase(): Promise<void> {
    try {
      await database.seedInitialData();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  // Main matching function
  async findOptimalTeam(projectRequirements: any): Promise<any> {
    const {
      title,
      location,
      capacity_needed,
      budget,
      skills_required = ['Egg Supply'],
      project_type = 'egg_supply'
    } = projectRequirements;

    // Get users from database
    const users = await database.getAllUsers();

    // Filter users by relevant skills and location proximity
    const relevantUsers = users.filter(user => 
      this.hasRelevantSkills(user, skills_required) ||
      user.specialization === project_type
    );

    // Score and rank users
    const scoredUsers = relevantUsers.map(user => ({
      ...user,
      match_score: this.calculateMatchScore(user, projectRequirements)
    })).sort((a, b) => b.match_score - a.match_score);

    // Select optimal team using genetic algorithm approach
    const team = this.selectOptimalTeam(scoredUsers, capacity_needed);

    // Generate explanation
    const explanation = this.generateExplanation(team, projectRequirements);

    return {
      recommended_team: team,
      explanation,
      total_capacity: team.reduce((sum, member) => sum + member.capacity_numeric, 0),
      estimated_cost: this.calculateTeamCost(team, budget),
      confidence_score: this.calculateConfidenceScore(team, projectRequirements)
    };
  }

  // Select optimal team using genetic algorithm approach
  selectOptimalTeam(scoredUsers: any[], capacityNeeded: number): any[] {
    // Generate initial population of teams
    const population: any[] = [];
    for (let i = 0; i < 20; i++) {
      const team = this.generateRandomTeam(scoredUsers.filter((user: any) => user.score > 0.3), capacityNeeded);
      if (team.length > 0) {
        population.push(team);
      }
    }

    if (population.length === 0) {
      // Fallback to top users if no valid teams generated
      return scoredUsers.slice(0, Math.min(capacityNeeded, scoredUsers.length));
    }

    // Evolve population
    for (let generation = 0; generation < 10; generation++) {
      const newPopulation: any[] = [];
      
      // Keep best teams (elitism)
      const sortedPopulation = population.sort((a: any, b: any) => 
        this.evaluateTeam(b, { capacity_needed: capacityNeeded }) - 
        this.evaluateTeam(a, { capacity_needed: capacityNeeded })
      );
      
      newPopulation.push(...sortedPopulation.slice(0, 5));
      
      // Generate new teams through crossover and mutation
      while (newPopulation.length < 20) {
        const parent1 = this.selectParent(sortedPopulation);
        const parent2 = this.selectParent(sortedPopulation);
        const child = this.crossover(parent1, parent2);
        const mutatedChild = this.mutate(child, scoredUsers);
        
        if (mutatedChild.length > 0) {
          newPopulation.push(mutatedChild);
        }
      }
      
      population.splice(0, population.length, ...newPopulation);
    }

    // Return best team
    const bestTeam = population.reduce((best: any, current: any) => 
      this.evaluateTeam(current, { capacity_needed: capacityNeeded }) > 
      this.evaluateTeam(best, { capacity_needed: capacityNeeded }) ? current : best
    );

    return bestTeam.slice(0, capacityNeeded);
  }

  // Check if user has relevant skills
  hasRelevantSkills(user: any, requiredSkills: any[]): boolean {
    return requiredSkills.some(skill => 
      user.skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  }

  // Calculate match score for a user
  calculateMatchScore(user: any, requirements: any): number {
    let score = 0;

    // Reputation weight (40%)
    score += (user.reputation_score / 10) * 40;

    // Location bonus (25%)
    if (this.isLocationMatch(user.location, requirements.location)) {
      score += 25;
    } else if (this.isNearbyLocation(user.location, requirements.location)) {
      score += 15;
    }

    // Capacity relevance (20%)
    const capacityScore = Math.min(user.capacity_numeric / requirements.capacity_needed, 1) * 20;
    score += capacityScore;

    // Experience bonus (15%)
    const experienceScore = Math.min(user.projects_completed / 10, 1) * 15;
    score += experienceScore;

    return Math.round(score * 100) / 100;
  }

  // Form optimal team based on capacity and complementary skills
  formTeam(scoredUsers, capacityNeeded) {
    const team = [];
    let remainingCapacity = capacityNeeded;
    const usedUsers = new Set();

    // First, add high-reputation specialists
    const specialists = scoredUsers.filter(user => 
      user.specialization === 'egg_supply' && !usedUsers.has(user.id)
    );

    for (const specialist of specialists) {
      if (remainingCapacity <= 0) break;
      if (specialist.capacity_numeric <= remainingCapacity || team.length === 0) {
        team.push({
          ...specialist,
          role: 'Primary Supplier',
          allocated_capacity: Math.min(specialist.capacity_numeric, remainingCapacity)
        });
        remainingCapacity -= specialist.capacity_numeric;
        usedUsers.add(specialist.id);
      }
    }

    // Add logistics coordinator if needed
    if (capacityNeeded >= 8) {
      const logisticsCoordinator = scoredUsers.find(user => 
        user.specialization === 'logistics' && !usedUsers.has(user.id)
      );
      
      if (logisticsCoordinator) {
        team.push({
          ...logisticsCoordinator,
          role: 'Logistics Coordinator',
          allocated_capacity: Math.min(logisticsCoordinator.capacity_numeric, remainingCapacity)
        });
        remainingCapacity -= logisticsCoordinator.capacity_numeric;
        usedUsers.add(logisticsCoordinator.id);
      }
    }

    // Fill remaining capacity with best available users
    while (remainingCapacity > 0 && usedUsers.size < scoredUsers.length) {
      const nextBest = scoredUsers.find(user => !usedUsers.has(user.id));
      if (!nextBest) break;

      const role = this.determineRole(nextBest, team);
      team.push({
        ...nextBest,
        role,
        allocated_capacity: Math.min(nextBest.capacity_numeric, remainingCapacity)
      });
      remainingCapacity -= nextBest.capacity_numeric;
      usedUsers.add(nextBest.id);
    }

    return team;
  }

  // Determine role for team member
  determineRole(user, existingTeam) {
    if (user.specialization === 'logistics') return 'Logistics Coordinator';
    if (user.specialization === 'quality_control') return 'Quality Assurance';
    if (user.skills.includes('Transportation')) return 'Transportation Specialist';
    
    const supplierCount = existingTeam.filter(member => 
      member.role.includes('Supplier')).length;
    
    return supplierCount === 0 ? 'Primary Supplier' : 'Secondary Supplier';
  }

  // Generate natural language explanation
  generateExplanation(team: any[], requirements: any): string {
    const teamSize = team.length;
    const totalCapacity = team.reduce((sum, member) => sum + member.allocated_capacity, 0);
    const avgReputation = team.reduce((sum, member) => sum + member.reputation_score, 0) / teamSize;
    
    const locationMatches = team.filter(member => 
      this.isLocationMatch(member.location, requirements.location)
    ).length;

    let explanation = `The AGI selected this ${teamSize}-person team because:\n\n`;
    
    // Capacity explanation
    explanation += `• **Optimal Capacity Match**: Their combined capacity (${totalCapacity} schools/day) `;
    if (totalCapacity >= requirements.capacity_needed) {
      explanation += `meets your requirement of ${requirements.capacity_needed} schools with efficient coverage.\n`;
    } else {
      explanation += `closely matches your requirement of ${requirements.capacity_needed} schools.\n`;
    }

    // Reputation explanation
    explanation += `• **High Trust Score**: Average team reputation of ${avgReputation.toFixed(1)}/10 `;
    explanation += `based on verified blockchain transactions and successful project completions.\n`;

    // Location explanation
    if (locationMatches > 0) {
      explanation += `• **Local Collaboration Bonus**: ${locationMatches} team member(s) are based in ${requirements.location}, `;
      explanation += `ensuring faster delivery times and reduced transportation costs.\n`;
    }

    // Specialization explanation
    const specialists = team.filter(member => member.specialization === 'egg_supply');
    if (specialists.length > 0) {
      explanation += `• **Domain Expertise**: ${specialists.length} specialist(s) with proven egg supply experience, `;
      explanation += `including ${specialists[0].name} who has completed ${specialists[0].projects_completed} similar projects.\n`;
    }

    // Logistics explanation
    const logisticsCoordinator = team.find(member => member.specialization === 'logistics');
    if (logisticsCoordinator) {
      explanation += `• **Logistics Optimization**: ${logisticsCoordinator.name} will coordinate deliveries, `;
      explanation += `potentially reducing costs by 20-30% through route optimization.\n`;
    }

    explanation += `\nThis team combination maximizes reliability while minimizing costs and delivery time.`;

    return explanation;
  }

  // Calculate team cost distribution
  calculateTeamCost(team: any[], budget: number): number {
    const totalCapacity = team.reduce((sum, member) => sum + member.allocated_capacity, 0);
    
    return team.map(member => ({
      user_id: member.id,
      name: member.name,
      role: member.role,
      allocated_capacity: member.allocated_capacity,
      payment_share: Math.round((member.allocated_capacity / totalCapacity) * totalBudget),
      percentage: Math.round((member.allocated_capacity / totalCapacity) * 100)
    }));
  }

  // Calculate confidence score
  calculateConfidenceScore(team: any[], requirements: any): number {
    const avgReputation = team.reduce((sum, member) => sum + member.reputation_score, 0) / team.length;
    const capacityMatch = Math.min(
      team.reduce((sum, member) => sum + member.allocated_capacity, 0) / requirements.capacity_needed,
      1
    );
    
    return Math.round((avgReputation / 10 * 0.6 + capacityMatch * 0.4) * 100);
  }

  // Location matching helpers
  isLocationMatch(userLocation, projectLocation) {
    return userLocation.toLowerCase().includes(projectLocation.toLowerCase()) ||
           projectLocation.toLowerCase().includes(userLocation.toLowerCase());
  }

  isNearbyLocation(userLocation, projectLocation) {
    const nairobiAreas = ['kibera', 'mathare', 'eastlands', 'kawangware', 'nairobi'];
    const userArea = userLocation.toLowerCase();
    const projectArea = projectLocation.toLowerCase();
    
    return nairobiAreas.some(area => userArea.includes(area) && projectArea.includes('nairobi'));
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      return await database.getUserById(userId);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Update user data
  updateUserData(updates: any): void {
    this.data = { ...this.data, ...updates };
    saveUserData(this.data);
  }

  // Check budget constraints
  checkBudgetConstraints(team: any[], totalBudget: number): boolean {
    const teamCost = team.reduce((sum: number, member: any) => sum + (member.hourly_rate || 50), 0);
    return teamCost <= totalBudget;
  }

  // Optimize for budget
  optimizeForBudget(team: any[], totalBudget: number): any[] {
    const sortedTeam = team.sort((a: any, b: any) => (b.score / (b.hourly_rate || 50)) - (a.score / (a.hourly_rate || 50)));
    const optimizedTeam = [];
    let currentCost = 0;
    
    for (const member of sortedTeam) {
      const memberCost = member.hourly_rate || 50;
      if (currentCost + memberCost <= totalBudget) {
        optimizedTeam.push(member);
        currentCost += memberCost;
      }
    }
    
    return optimizedTeam;
  }

  // Enhanced team evaluation with multiple criteria
  evaluateTeamComprehensive(team: any[], requirements: any): number {
    const skillScore = team.reduce((sum: number, member: any) => sum + this.calculateSkillMatch(member, requirements.skills_required || []), 0) / team.length;
    const locationScore = team.reduce((sum: number, member: any) => {
      return sum + (this.calculateLocationCompatibility(member.location, requirements.location) ? 1 : 0);
    }, 0) / team.length;
    
    return (skillScore * 0.6 + locationScore * 0.4);
  }

  // Calculate skill match score
  calculateSkillMatch(user: any, requiredSkills: any[]): number {
    return requiredSkills.reduce((score: number, skill: any) => {
      const userSkill = user.skills.find((s: any) => s.name === skill);
      return score + (userSkill ? userSkill.level : 0);
    }, 0) / requiredSkills.length;
  }

  // Calculate location compatibility
  calculateLocationCompatibility(userLocation: any, projectLocation: any): boolean {
    return userLocation.toLowerCase().includes(projectLocation.toLowerCase()) ||
           projectLocation.toLowerCase().includes(userLocation.toLowerCase());
  }

  // Evaluate team fitness
  evaluateTeam(team: any[], requirements: any): number {
    const capacityScore = Math.min(
      team.reduce((sum: number, member: any) => sum + member.capacity, 0) / requirements.capacity_needed,
      1
    );
    const experienceScore = team.reduce((sum: number, member: any) => sum + member.experience_years, 0) / (team.length * 10); // Normalize by expected max
    const compatibilityScore = team.reduce((sum: number, member: any) => sum + member.score, 0) / team.length;
    
    return (capacityScore * 0.4 + experienceScore * 0.3 + compatibilityScore * 0.3);
  }

  // Mutate team
  mutate(team: any[], availableUsers: any[]): any[] {
    const mutationRate = 0.1;
    const mutatedTeam = [...team];
    
    for (let i = 0; i < mutatedTeam.length; i++) {
      if (Math.random() < mutationRate) {
        const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
        if (!this.hasConflict(randomUser, mutatedTeam.filter((_, index) => index !== i))) {
          mutatedTeam[i] = randomUser;
        }
      }
    }
    
    return mutatedTeam;
  }

  // Check if user conflicts with existing team
  hasConflict(user: any, existingTeam: any[]): boolean {
    if (user.specialization === 'logistics') return 'Logistics Coordinator';
    if (user.specialization === 'quality_control') return 'Quality Assurance';
    if (user.skills.includes('Transportation')) return 'Transportation Specialist';
    // Check for direct conflicts
    return existingTeam.some((member: any) => 
      user.conflicts && user.conflicts.includes(member.id)
    );
  }

  // Generate random team
  generateRandomTeam(users: any[], capacityNeeded: number): any[] {
    const team = [];
    let remainingCapacity = capacityNeeded;
    
    while (remainingCapacity > 0 && users.length > 0) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      team.push(randomUser);
      remainingCapacity -= randomUser.capacity_numeric;
      users.splice(users.indexOf(randomUser), 1);
    }
    
    return team;
  }

  // Select parent for crossover
  selectParent(population: any[]): any[] {
    const totalFitness = population.reduce((sum: number, team: any) => sum + this.evaluateTeam(team, { capacity_needed: 10 }), 0);
    const randomFitness = Math.random() * totalFitness;
    let cumulativeFitness = 0;
    
    for (const team of population) {
      cumulativeFitness += this.evaluateTeam(team, { capacity_needed: 10 });
      if (cumulativeFitness >= randomFitness) {
        return team;
      }
    }
    
    return population[0];
  }

  // Crossover teams
  crossover(parent1: any[], parent2: any[]): any[] {
    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const child = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
    
    return child;
  }
}

export default AGIMatchmaker;
