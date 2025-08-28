interface TeamMember {
  id: string
  name: string
  location: string
  skills: string[]
  capacity_numeric: number
  reputation_score: number
  projects_completed: number
  specialization: string
  allocated_capacity?: number
  match_score?: number
}

interface TeamRecommendation {
  recommended_team: TeamMember[]
  explanation: string
  total_capacity: number
  estimated_cost: any[]
  confidence_score: number
}

class RealAGIService {
  private baseURL: string

  constructor(baseURL: string = 'http://localhost:4000/api') {
    this.baseURL = baseURL
  }

  /**
   * Get real team recommendation from AGI matchmaker
   */
  async getTeamRecommendation(projectRequirements: {
    title: string
    location: string
    capacity_needed: number
    budget: number
    skills_required?: string[]
  }): Promise<TeamRecommendation> {
    try {
      const response = await fetch(`${this.baseURL}/escrow/recommend-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectRequirements),
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get team recommendation')
      }

      return data.recommendation
    } catch (error) {
      console.error('Error getting team recommendation:', error)
      throw error
    }
  }

  /**
   * Secure funds using real M-Pesa integration
   */
  async secureFunds(projectData: {
    project_id: string
    amount: number
    phone_number: string
    title: string
    team_members: TeamMember[]
  }) {
    try {
      // First, call the Supabase edge function for M-Pesa STK Push
      const mpesaResponse = await fetch('/functions/v1/mpesa-stk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          phone: projectData.phone_number,
          amount: projectData.amount,
          account_reference: projectData.project_id,
          transaction_desc: `Escrow for ${projectData.title}`
        })
      })

      const mpesaResult = await mpesaResponse.json()

      if (!mpesaResult.success) {
        throw new Error(mpesaResult.error || 'M-Pesa STK Push failed')
      }

      // Create project and milestones in database
      const escrowResponse = await fetch(`${this.baseURL}/escrow/secure-funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...projectData,
          checkout_request_id: mpesaResult.data.checkout_request_id
        }),
      })

      const escrowData = await escrowResponse.json()
      
      return {
        success: true,
        escrow_details: escrowData.escrow_details,
        mpesa_details: mpesaResult.data
      }

    } catch (error) {
      console.error('Error securing funds:', error)
      throw error
    }
  }

  /**
   * Get real users from database
   */
  async getUsers(): Promise<TeamMember[]> {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      return data.users || []
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  /**
   * Get project status with real data
   */
  async getProjectStatus(projectId: string) {
    try {
      const response = await fetch(`${this.baseURL}/escrow/project-status/${projectId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error getting project status:', error)
      throw error
    }
  }
}

export const realAgiService = new RealAGIService()
export default RealAGIService