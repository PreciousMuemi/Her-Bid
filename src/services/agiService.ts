/**
 * HerBid AGI Service
 * Frontend service that connects to the AGI backend API
 */

export interface PartnershipRecommendation {
  partner_name: string;
  skills: string[];
  compatibility_score: number;
  location: string;
  industry: string;
  reputation_score: number;
  reasoning: string;
}

export interface TeamFormation {
  team_members: string[];
  total_score: number;
  skill_coverage: Record<string, string>;
  collaborative_bonuses: string[];
}

export interface EscrowDetails {
  escrow_id: string;
  project_id: string;
  total_amount: number;
  member_addresses: string[];
  milestone_count: number;
  created_at: string;
  status: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BusinessProfile {
  skills: string[];
  location: string;
  industry: string;
  reputation: number;
}

export interface ContractRequirements {
  required_skills: string[];
  budget: number;
  deadline: string;
}

class HerBidAGIService {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data as APIResponse<T>;
    } catch (error) {
      console.error('API Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check if the backend API is healthy
   */
  async healthCheck(): Promise<APIResponse> {
    return this.makeRequest('/health');
  }

  /**
   * Find partnership recommendations for a business and contract
   */
  async findPartnerships(
    businessName: string,
    contractName: string
  ): Promise<APIResponse<PartnershipRecommendation[]>> {
    return this.makeRequest('/partnerships/find', {
      method: 'POST',
      body: JSON.stringify({
        business_name: businessName,
        contract_name: contractName,
      }),
    });
  }

  /**
   * Form optimal team for a contract
   */
  async formOptimalTeam(
    contractName: string,
    availableBusinesses?: string[]
  ): Promise<APIResponse<TeamFormation>> {
    return this.makeRequest('/teams/optimal', {
      method: 'POST',
      body: JSON.stringify({
        contract_name: contractName,
        available_businesses: availableBusinesses,
      }),
    });
  }

  /**
   * Get partnership compatibility score between two businesses
   */
  async getPartnershipScore(
    businessA: string,
    businessB: string
  ): Promise<APIResponse<{ score: number }>> {
    return this.makeRequest('/partnerships/score', {
      method: 'POST',
      body: JSON.stringify({
        business_a: businessA,
        business_b: businessB,
      }),
    });
  }

  /**
   * Create escrow contract on Sui blockchain
   */
  async createEscrow(
    projectId: string,
    contractName: string,
    totalBudget: number,
    clientAddress: string
  ): Promise<APIResponse<EscrowDetails>> {
    return this.makeRequest('/escrow/create', {
      method: 'POST',
      body: JSON.stringify({
        project_id: projectId,
        contract_name: contractName,
        total_budget: totalBudget,
        client_address: clientAddress,
      }),
    });
  }

  /**
   * Get escrow contract status
   */
  async getEscrowStatus(escrowId: string): Promise<APIResponse<any>> {
    return this.makeRequest(`/escrow/status/${escrowId}`);
  }

  /**
   * Release milestone payment
   */
  async releaseMilestone(
    escrowId: string,
    milestoneNumber: number,
    approverAddress: string
  ): Promise<APIResponse<any>> {
    return this.makeRequest('/escrow/release-milestone', {
      method: 'POST',
      body: JSON.stringify({
        escrow_id: escrowId,
        milestone_number: milestoneNumber,
        approver_address: approverAddress,
      }),
    });
  }

  /**
   * Create consortium contract
   */
  async createConsortium(
    consortiumName: string,
    foundingMembers: string[],
    governanceRules: Record<string, any>
  ): Promise<APIResponse<{ consortium_id: string }>> {
    return this.makeRequest('/consortium/create', {
      method: 'POST',
      body: JSON.stringify({
        consortium_name: consortiumName,
        founding_members: foundingMembers,
        governance_rules: governanceRules,
      }),
    });
  }

  /**
   * Get business profile
   */
  async getBusinessProfile(businessName: string): Promise<APIResponse<BusinessProfile>> {
    return this.makeRequest(`/businesses/${encodeURIComponent(businessName)}`);
  }

  /**
   * Get contract requirements
   */
  async getContractRequirements(contractName: string): Promise<APIResponse<ContractRequirements>> {
    return this.makeRequest(`/contracts/${encodeURIComponent(contractName)}`);
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(walletAddress: string): Promise<APIResponse<Record<string, number>>> {
    return this.makeRequest(`/wallet/balance/${walletAddress}`);
  }

  /**
   * Add new business to knowledge base
   */
  async addBusiness(
    businessName: string,
    businessData: BusinessProfile
  ): Promise<APIResponse> {
    return this.makeRequest('/businesses', {
      method: 'POST',
      body: JSON.stringify({
        business_name: businessName,
        business_data: businessData,
      }),
    });
  }

  /**
   * Add new contract to knowledge base
   */
  async addContract(
    contractName: string,
    contractData: ContractRequirements
  ): Promise<APIResponse> {
    return this.makeRequest('/contracts', {
      method: 'POST',
      body: JSON.stringify({
        contract_name: contractName,
        contract_data: contractData,
      }),
    });
  }
}

// Create singleton instance
export const herBidAGIService = new HerBidAGIService();

// React hook for using the AGI service
export const useHerBidAGI = () => {
  return herBidAGIService;
};

export default HerBidAGIService;
