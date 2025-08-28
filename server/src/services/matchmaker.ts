import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface User {
  id: string;
  name: string;
  skills: string[];
  location: string;
  capacity: string;
  capacity_numeric: number;
  reputation_score: number;
  phone: string;
  profile_image: string;
  completed_projects: string[];
  verification_status: string;
  mpesa_number: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  required_capacity: number;
  location: string;
  budget: number;
  status: string;
  client_name: string;
}

interface MatchResult {
  team: User[];
  explanation: string;
  confidence_score: number;
  total_capacity: number;
  average_reputation: number;
  local_members: number;
}

export class AGIMatchmaker {
  private usersData: any;

  constructor() {
    this.loadUsersData();
  }

  private loadUsersData() {
    try {
      const dataPath = path.resolve(__dirname, '../../data/users.json');
      const data = fs.readFileSync(dataPath, 'utf8');
      this.usersData = JSON.parse(data);
    } catch (error) {
      console.error('Error loading users data:', error);
      this.usersData = { users: [], projects: [] };
    }
  }

  private saveUsersData() {
    try {
      const dataPath = path.resolve(__dirname, '../../data/users.json');
      fs.writeFileSync(dataPath, JSON.stringify(this.usersData, null, 2));
    } catch (error) {
      console.error('Error saving users data:', error);
    }
  }

  public findOptimalTeam(projectId: string): MatchResult {
    const project = this.usersData.projects.find((p: Project) => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const users = this.usersData.users;
    
    // Filter relevant users based on skills
    const relevantUsers = users.filter((user: User) => {
      return user.skills.some(skill => 
        skill.toLowerCase().includes('egg') || 
        skill.toLowerCase().includes('supply') ||
        skill.toLowerCase().includes('logistics')
      );
    });

    // Score users based on multiple criteria
    const scoredUsers = relevantUsers.map((user: User) => {
      let score = 0;
      
      // Reputation weight (40%)
      score += (user.reputation_score / 10) * 40;
      
      // Location bonus (30%) - prefer same location
      if (user.location.toLowerCase() === project.location.toLowerCase()) {
        score += 30;
      } else if (this.isNearbyLocation(user.location, project.location)) {
        score += 15; // Partial bonus for nearby locations
      }
      
      // Capacity relevance (20%)
      score += Math.min(user.capacity_numeric / project.required_capacity, 1) * 20;
      
      // Verification bonus (10%)
      if (user.verification_status === 'verified') {
        score += 10;
      }

      return { ...user, match_score: score };
    });

    // Sort by score and select optimal team
    scoredUsers.sort((a, b) => b.match_score - a.match_score);

    // Build team to meet capacity requirements
    const team: User[] = [];
    let totalCapacity = 0;
    let remainingNeeded = project.required_capacity;

    for (const user of scoredUsers) {
      if (totalCapacity >= project.required_capacity) break;
      
      if (user.capacity_numeric <= remainingNeeded || team.length < 2) {
        team.push(user);
        totalCapacity += user.capacity_numeric;
        remainingNeeded -= user.capacity_numeric;
      }
    }

    // Calculate metrics
    const averageReputation = team.reduce((sum, user) => sum + user.reputation_score, 0) / team.length;
    const localMembers = team.filter(user => 
      user.location.toLowerCase() === project.location.toLowerCase()
    ).length;

    // Generate explanation
    const explanation = this.generateExplanation(team, project, totalCapacity, averageReputation, localMembers);

    return {
      team,
      explanation,
      confidence_score: this.calculateConfidence(team, project, totalCapacity),
      total_capacity: totalCapacity,
      average_reputation: Math.round(averageReputation * 10) / 10,
      local_members: localMembers
    };
  }

  private isNearbyLocation(userLocation: string, projectLocation: string): boolean {
    const nearby = {
      'nairobi': ['kiambu', 'machakos', 'kajiado'],
      'kiambu': ['nairobi', 'muranga'],
      'mombasa': ['kilifi', 'kwale']
    };
    
    const userLoc = userLocation.toLowerCase();
    const projLoc = projectLocation.toLowerCase();
    
    return nearby[projLoc]?.includes(userLoc) || nearby[userLoc]?.includes(projLoc) || false;
  }

  private generateExplanation(team: User[], project: Project, totalCapacity: number, avgReputation: number, localMembers: number): string {
    const explanations = [];
    
    // Capacity explanation
    if (totalCapacity >= project.required_capacity) {
      explanations.push(`The team's combined capacity (${totalCapacity} schools/day) meets your requirement of ${project.required_capacity} schools`);
    } else {
      explanations.push(`The team's capacity (${totalCapacity} schools/day) covers ${Math.round((totalCapacity/project.required_capacity)*100)}% of your needs`);
    }

    // Reputation explanation
    if (avgReputation >= 8.5) {
      explanations.push(`all team members have excellent reputation scores (average ${avgReputation}/10)`);
    } else if (avgReputation >= 7.5) {
      explanations.push(`the team has strong reputation scores (average ${avgReputation}/10)`);
    }

    // Location explanation
    if (localMembers === team.length) {
      explanations.push(`all team members are based in ${project.location} for efficient coordination`);
    } else if (localMembers > 0) {
      explanations.push(`${localMembers} of ${team.length} team members are local to ${project.location}`);
    }

    // Skills explanation
    const uniqueSkills = [...new Set(team.flatMap(user => user.skills))];
    explanations.push(`they bring complementary skills: ${uniqueSkills.slice(0, 3).join(', ')}`);

    return `The AGI selected this team because ${explanations.join(', ')}.`;
  }

  private calculateConfidence(team: User[], project: Project, totalCapacity: number): number {
    let confidence = 0;
    
    // Capacity coverage (40%)
    confidence += Math.min(totalCapacity / project.required_capacity, 1.2) * 40;
    
    // Team reputation (30%)
    const avgReputation = team.reduce((sum, user) => sum + user.reputation_score, 0) / team.length;
    confidence += (avgReputation / 10) * 30;
    
    // Team size appropriateness (20%)
    const idealTeamSize = Math.ceil(project.required_capacity / 3);
    const teamSizeScore = 1 - Math.abs(team.length - idealTeamSize) / idealTeamSize;
    confidence += teamSizeScore * 20;
    
    // Verification status (10%)
    const verifiedMembers = team.filter(user => user.verification_status === 'verified').length;
    confidence += (verifiedMembers / team.length) * 10;

    return Math.min(Math.round(confidence), 95); // Cap at 95%
  }

  public assignTeamToProject(projectId: string, team: User[]): void {
    const projectIndex = this.usersData.projects.findIndex((p: Project) => p.id === projectId);
    if (projectIndex !== -1) {
      this.usersData.projects[projectIndex].team_assigned = team.map(user => user.id);
      this.usersData.projects[projectIndex].status = 'team_assigned';
      this.saveUsersData();
    }
  }

  public getUsers(): User[] {
    return this.usersData.users;
  }

  public getProjects(): Project[] {
    return this.usersData.projects;
  }

  public getUserById(userId: string): User | null {
    return this.usersData.users.find((user: User) => user.id === userId) || null;
  }

  public getProjectById(projectId: string): Project | null {
    return this.usersData.projects.find((project: Project) => project.id === projectId) || null;
  }
}

export default new AGIMatchmaker();
