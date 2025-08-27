"""
HerBid AGI Engine - MeTTa Integration
This module provides the core AGI functionality for business partnership recommendations
using MeTTa symbolic reasoning.
"""

import os
import json
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass

# Note: In a real implementation, you would install metta-py
# pip install metta-py
# For now, we'll create a mock implementation that demonstrates the structure

@dataclass
class PartnershipRecommendation:
    """Data class for partnership recommendations"""
    partner_name: str
    skills: List[str]
    compatibility_score: float
    location: str
    industry: str
    reputation_score: int
    reasoning: str

@dataclass
class TeamFormation:
    """Data class for multi-partner team formations"""
    team_members: List[str]
    total_score: float
    skill_coverage: Dict[str, str]  # skill -> business mapping
    collaborative_bonuses: List[str]

class AGI_GigeBid_Engine:
    """
    Advanced AGI engine for GigeBid platform that combines symbolic reasoning 
    with practical partnership recommendations for gig economy professionals.
    """
    
    def __init__(self):
        """Initialize the MeTTa runtime and load knowledge graph"""
        try:
            # In real implementation:
            # from metta import MeTTa
            # self.metta = MeTTa()
            # self.metta.load_file(os.path.join(os.path.dirname(__file__), 'herbid_agi/knowledge_graph.metta'))
            
            # Mock implementation for demonstration
            self.knowledge_base = self._load_mock_knowledge_base()
            self.initialized = True
            print("AGI Engine initialized successfully")
        except Exception as e:
            print(f"Error initializing AGI Engine: {e}")
            self.initialized = False
    
    def _load_mock_knowledge_base(self) -> Dict[str, Any]:
        """Load mock knowledge base for demonstration"""
        return {
            "businesses": {
                "Sarah's Marketing Agency": {
                    "skills": ["Digital Marketing", "Content Creation", "Social Media Management"],
                    "location": "Nairobi",
                    "industry": "Marketing",
                    "reputation": 85
                },
                "Jane's Dev House": {
                    "skills": ["Web Development", "Sui Smart Contracts", "Frontend Development"],
                    "location": "Nairobi", 
                    "industry": "Technology",
                    "reputation": 92
                },
                "Tech Solutions Kenya": {
                    "skills": ["Mobile App Development", "Backend Development", "DevOps"],
                    "location": "Mombasa",
                    "industry": "Technology", 
                    "reputation": 78
                },
                "Creative Minds Studio": {
                    "skills": ["Graphic Design", "UI/UX Design", "Branding"],
                    "location": "Nairobi",
                    "industry": "Design",
                    "reputation": 88
                },
                "Financial Consultants Ltd": {
                    "skills": ["Financial Analysis", "Business Strategy", "Risk Management"],
                    "location": "Nairobi",
                    "industry": "Finance",
                    "reputation": 91
                }
            },
            "contracts": {
                "Government Tender #123": {
                    "required_skills": ["Digital Marketing", "Web Development"],
                    "budget": 500000,
                    "deadline": "2025-12-31"
                },
                "Mobile Banking App": {
                    "required_skills": ["Mobile App Development", "UI/UX Design", "Financial Analysis"],
                    "budget": 1000000,
                    "deadline": "2025-10-15"
                },
                "E-commerce Platform": {
                    "required_skills": ["Web Development", "Digital Marketing", "Graphic Design"],
                    "budget": 750000,
                    "deadline": "2025-11-30"
                }
            },
            "complementary_industries": [
                ("Marketing", "Technology"),
                ("Technology", "Design"),
                ("Design", "Marketing"),
                ("Finance", "Technology"),
                ("Finance", "Marketing")
            ]
        }

    def find_partners(self, user_business_name: str, contract_name: str) -> List[PartnershipRecommendation]:
        """
        Queries the MeTTa knowledge graph to find viable partners for a given contract.
        
        Args:
            user_business_name: Name of the user's business
            contract_name: Name of the contract/project
            
        Returns:
            List of partnership recommendations
        """
        if not self.initialized:
            return []
        
        try:
            # In real implementation, this would be a MeTTa query:
            # query_pattern = f"(Viable-Team '{user_business_name}' $partner '{contract_name}')"
            # results = self.metta.query(query_pattern)
            
            # Mock implementation
            recommendations = self._mock_find_partners(user_business_name, contract_name)
            return recommendations
            
        except Exception as e:
            print(f"Error finding partners: {e}")
            return []

    def _mock_find_partners(self, user_business: str, contract: str) -> List[PartnershipRecommendation]:
        """Mock implementation of partner finding logic"""
        recommendations = []
        
        if contract not in self.knowledge_base["contracts"]:
            return recommendations
        
        contract_info = self.knowledge_base["contracts"][contract]
        required_skills = contract_info["required_skills"]
        
        user_business_info = self.knowledge_base["businesses"].get(user_business)
        if not user_business_info:
            return recommendations
        
        user_skills = set(user_business_info["skills"])
        missing_skills = set(required_skills) - user_skills
        
        # Find businesses that can provide missing skills
        for business_name, business_info in self.knowledge_base["businesses"].items():
            if business_name == user_business:
                continue
                
            business_skills = set(business_info["skills"])
            skill_overlap = missing_skills.intersection(business_skills)
            
            if skill_overlap:
                score = self._calculate_partnership_score(user_business_info, business_info)
                
                recommendation = PartnershipRecommendation(
                    partner_name=business_name,
                    skills=list(skill_overlap),
                    compatibility_score=score,
                    location=business_info["location"],
                    industry=business_info["industry"],
                    reputation_score=business_info["reputation"],
                    reasoning=f"Provides {', '.join(skill_overlap)} skills needed for the project"
                )
                recommendations.append(recommendation)
        
        # Sort by compatibility score
        recommendations.sort(key=lambda x: x.compatibility_score, reverse=True)
        return recommendations

    def _calculate_partnership_score(self, business_a: Dict, business_b: Dict) -> float:
        """Calculate compatibility score between two businesses"""
        score = 50.0  # Base score
        
        # Location bonus
        if business_a["location"] == business_b["location"]:
            score += 15.0
        
        # Industry synergy bonus
        industry_a = business_a["industry"]
        industry_b = business_b["industry"]
        if (industry_a, industry_b) in self.knowledge_base["complementary_industries"] or \
           (industry_b, industry_a) in self.knowledge_base["complementary_industries"]:
            score += 10.0
        
        # Reputation bonus
        avg_reputation = (business_a["reputation"] + business_b["reputation"]) / 2
        if avg_reputation >= 85:
            score += 15.0
        elif avg_reputation >= 75:
            score += 10.0
        
        return min(score, 100.0)

    def form_optimal_team(self, contract_name: str, available_businesses: List[str] = None) -> Optional[TeamFormation]:
        """
        Forms the optimal team for a given contract using multi-partner logic.
        
        Args:
            contract_name: Name of the contract
            available_businesses: List of available business names (optional)
            
        Returns:
            TeamFormation object with optimal team configuration
        """
        if not self.initialized or contract_name not in self.knowledge_base["contracts"]:
            return None
        
        contract_info = self.knowledge_base["contracts"][contract_name]
        required_skills = set(contract_info["required_skills"])
        
        if available_businesses is None:
            available_businesses = list(self.knowledge_base["businesses"].keys())
        
        # Find minimal team that covers all required skills
        best_team = self._find_minimal_skill_coverage(required_skills, available_businesses)
        
        if not best_team:
            return None
        
        # Calculate team metrics
        total_score = self._calculate_team_score(best_team)
        skill_coverage = self._map_skills_to_businesses(best_team, required_skills)
        bonuses = self._identify_team_bonuses(best_team)
        
        return TeamFormation(
            team_members=best_team,
            total_score=total_score,
            skill_coverage=skill_coverage,
            collaborative_bonuses=bonuses
        )

    def _find_minimal_skill_coverage(self, required_skills: set, available_businesses: List[str]) -> List[str]:
        """Find minimal set of businesses that cover all required skills"""
        from itertools import combinations
        
        # Try different team sizes, starting from 1
        for team_size in range(1, len(available_businesses) + 1):
            for team_combo in combinations(available_businesses, team_size):
                team_skills = set()
                for business in team_combo:
                    if business in self.knowledge_base["businesses"]:
                        team_skills.update(self.knowledge_base["businesses"][business]["skills"])
                
                if required_skills.issubset(team_skills):
                    return list(team_combo)
        
        return []

    def _calculate_team_score(self, team: List[str]) -> float:
        """Calculate overall team compatibility score"""
        if len(team) < 2:
            return 50.0
        
        total_score = 0.0
        pair_count = 0
        
        # Calculate pairwise compatibility scores
        for i in range(len(team)):
            for j in range(i + 1, len(team)):
                business_a = self.knowledge_base["businesses"][team[i]]
                business_b = self.knowledge_base["businesses"][team[j]]
                score = self._calculate_partnership_score(business_a, business_b)
                total_score += score
                pair_count += 1
        
        return total_score / pair_count if pair_count > 0 else 50.0

    def _map_skills_to_businesses(self, team: List[str], required_skills: set) -> Dict[str, str]:
        """Map each required skill to the business that provides it"""
        skill_mapping = {}
        
        for skill in required_skills:
            for business in team:
                if skill in self.knowledge_base["businesses"][business]["skills"]:
                    skill_mapping[skill] = business
                    break
        
        return skill_mapping

    def _identify_team_bonuses(self, team: List[str]) -> List[str]:
        """Identify collaborative bonuses for the team"""
        bonuses = []
        
        # Check for location clustering
        locations = [self.knowledge_base["businesses"][b]["location"] for b in team]
        location_counts = {}
        for loc in locations:
            location_counts[loc] = location_counts.get(loc, 0) + 1
        
        for loc, count in location_counts.items():
            if count >= 2:
                bonuses.append(f"Local cluster bonus in {loc}")
        
        # Check for industry synergies
        industries = [self.knowledge_base["businesses"][b]["industry"] for b in team]
        for i in range(len(industries)):
            for j in range(i + 1, len(industries)):
                if (industries[i], industries[j]) in self.knowledge_base["complementary_industries"]:
                    bonuses.append(f"Industry synergy: {industries[i]} + {industries[j]}")
        
        return bonuses

    def get_partnership_score(self, business_a: str, business_b: str) -> float:
        """
        Get detailed partnership score between two specific businesses.
        
        Args:
            business_a: Name of first business
            business_b: Name of second business
            
        Returns:
            Compatibility score (0-100)
        """
        if not self.initialized:
            return 0.0
        
        try:
            # In real implementation:
            # local_bonus_query = f"(local-collaboration-bonus '{business_a}' '{business_b}')"
            # is_local = self.metta.query(local_bonus_query)
            
            business_a_info = self.knowledge_base["businesses"].get(business_a)
            business_b_info = self.knowledge_base["businesses"].get(business_b)
            
            if not business_a_info or not business_b_info:
                return 0.0
            
            return self._calculate_partnership_score(business_a_info, business_b_info)
            
        except Exception as e:
            print(f"Error calculating partnership score: {e}")
            return 0.0

    def get_business_profile(self, business_name: str) -> Optional[Dict[str, Any]]:
        """Get detailed profile of a business"""
        return self.knowledge_base["businesses"].get(business_name)

    def get_contract_requirements(self, contract_name: str) -> Optional[Dict[str, Any]]:
        """Get requirements for a specific contract"""
        return self.knowledge_base["contracts"].get(contract_name)

    def add_business_to_knowledge_base(self, business_name: str, business_data: Dict[str, Any]):
        """Add a new business to the knowledge base"""
        # In real implementation, this would update the MeTTa knowledge graph
        self.knowledge_base["businesses"][business_name] = business_data

    def add_contract_to_knowledge_base(self, contract_name: str, contract_data: Dict[str, Any]):
        """Add a new contract to the knowledge base"""
        # In real implementation, this would update the MeTTa knowledge graph
        self.knowledge_base["contracts"][contract_name] = contract_data

# Example usage
if __name__ == "__main__":
    # Initialize the AGI engine
    agi_engine = AGI_HerBid_Engine()
    
    # Example: Find partners for Sarah's Marketing Agency for Government Tender #123
    recommendations = agi_engine.find_partners("Sarah's Marketing Agency", "Government Tender #123")
    
    print("Partnership Recommendations:")
    for rec in recommendations:
        print(f"Partner: {rec.partner_name}")
        print(f"Skills: {', '.join(rec.skills)}")
        print(f"Score: {rec.compatibility_score:.1f}")
        print(f"Location: {rec.location}")
        print(f"Reasoning: {rec.reasoning}")
        print("-" * 50)
    
    # Example: Form optimal team for Mobile Banking App
    team = agi_engine.form_optimal_team("Mobile Banking App")
    if team:
        print(f"\nOptimal Team for Mobile Banking App:")
        print(f"Members: {', '.join(team.team_members)}")
        print(f"Team Score: {team.total_score:.1f}")
        print(f"Skill Coverage: {team.skill_coverage}")
        print(f"Bonuses: {team.collaborative_bonuses}")
