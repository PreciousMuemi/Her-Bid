"""
GigeBid Backend API
Main backend service that integrates AGI reasoning with Sui blockchain operations.
This serves as the bridge between the React frontend and the backend services.
"""

import json
import time
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import our custom modules
from metta_integration import AGI_HerBid_Engine, PartnershipRecommendation, TeamFormation
from sui_api import SuiConnector, TeamMember, EscrowDetails, create_project_escrow_from_agi_recommendation

@dataclass
class APIResponse:
    """Standard API response format"""
    success: bool
    data: Any = None
    message: str = ""
    error: str = ""

class GigeBidBackendAPI:
    """Main backend API service for GigeBid platform"""
    
    def __init__(self):
        """Initialize the backend services"""
        self.app = Flask(__name__)
        CORS(self.app)  # Enable CORS for frontend communication
        
        # Initialize core services
        self.agi_engine = AGI_GigeBid_Engine()
        self.sui_connector = SuiConnector("devnet")
        
        # Setup API routes
        self._setup_routes()
        
        print("GigeBid Backend API initialized successfully")
    
    def _setup_routes(self):
        """Setup all API routes"""
        
        @self.app.route('/api/health', methods=['GET'])
        def health_check():
            """Health check endpoint"""
            return jsonify(asdict(APIResponse(
                success=True,
                data={"status": "healthy", "timestamp": time.time()},
                message="GigeBid Backend API is running"
            )))
        
        @self.app.route('/api/partnerships/find', methods=['POST'])
        def find_partnerships():
            """Find partnership recommendations"""
            try:
                data = request.json
                business_name = data.get('business_name')
                contract_name = data.get('contract_name')
                
                if not business_name or not contract_name:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error="Missing required fields: business_name, contract_name"
                    ))), 400
                
                recommendations = self.agi_engine.find_partners(business_name, contract_name)
                
                return jsonify(asdict(APIResponse(
                    success=True,
                    data=[asdict(rec) for rec in recommendations],
                    message=f"Found {len(recommendations)} partnership recommendations"
                )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/teams/optimal', methods=['POST'])
        def form_optimal_team():
            """Form optimal team for a contract"""
            try:
                data = request.json
                contract_name = data.get('contract_name')
                available_businesses = data.get('available_businesses', None)
                
                if not contract_name:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error="Missing required field: contract_name"
                    ))), 400
                
                team_formation = self.agi_engine.form_optimal_team(
                    contract_name, 
                    available_businesses
                )
                
                if team_formation:
                    return jsonify(asdict(APIResponse(
                        success=True,
                        data=asdict(team_formation),
                        message="Optimal team formed successfully"
                    )))
                else:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        message="No viable team found for the specified contract"
                    )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/partnerships/score', methods=['POST'])
        def get_partnership_score():
            """Get partnership compatibility score"""
            try:
                data = request.json
                business_a = data.get('business_a')
                business_b = data.get('business_b')
                
                if not business_a or not business_b:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error="Missing required fields: business_a, business_b"
                    ))), 400
                
                score = self.agi_engine.get_partnership_score(business_a, business_b)
                
                return jsonify(asdict(APIResponse(
                    success=True,
                    data={"score": score},
                    message="Partnership score calculated"
                )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/escrow/create', methods=['POST'])
        def create_escrow():
            """Create escrow contract on Sui blockchain"""
            try:
                data = request.json
                project_id = data.get('project_id')
                contract_name = data.get('contract_name')
                total_budget = data.get('total_budget')
                client_address = data.get('client_address')
                
                required_fields = ['project_id', 'contract_name', 'total_budget', 'client_address']
                missing_fields = [field for field in required_fields if not data.get(field)]
                
                if missing_fields:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error=f"Missing required fields: {', '.join(missing_fields)}"
                    ))), 400
                
                # Create escrow using AGI recommendations
                escrow_details = create_project_escrow_from_agi_recommendation(
                    self.agi_engine,
                    self.sui_connector,
                    project_id,
                    contract_name,
                    client_address,
                    total_budget
                )
                
                if escrow_details:
                    return jsonify(asdict(APIResponse(
                        success=True,
                        data=asdict(escrow_details),
                        message="Escrow contract created successfully"
                    )))
                else:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        message="Failed to create escrow contract"
                    )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/escrow/status/<escrow_id>', methods=['GET'])
        def get_escrow_status(escrow_id):
            """Get escrow contract status"""
            try:
                status = self.sui_connector.get_escrow_status(escrow_id)
                
                if status:
                    return jsonify(asdict(APIResponse(
                        success=True,
                        data=status,
                        message="Escrow status retrieved"
                    )))
                else:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        message="Escrow not found"
                    ))), 404
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/escrow/release-milestone', methods=['POST'])
        def release_milestone():
            """Release milestone payment"""
            try:
                data = request.json
                escrow_id = data.get('escrow_id')
                milestone_number = data.get('milestone_number')
                approver_address = data.get('approver_address')
                
                if not all([escrow_id, milestone_number, approver_address]):
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error="Missing required fields: escrow_id, milestone_number, approver_address"
                    ))), 400
                
                result = self.sui_connector.release_milestone_payment(
                    escrow_id,
                    milestone_number,
                    approver_address
                )
                
                return jsonify(asdict(APIResponse(
                    success=result.status.value == "success",
                    data=asdict(result),
                    message="Milestone payment processed"
                )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/consortium/create', methods=['POST'])
        def create_consortium():
            """Create consortium contract"""
            try:
                data = request.json
                consortium_name = data.get('consortium_name')
                founding_members = data.get('founding_members', [])
                governance_rules = data.get('governance_rules', {})
                
                if not consortium_name or not founding_members:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error="Missing required fields: consortium_name, founding_members"
                    ))), 400
                
                consortium_id = self.sui_connector.create_consortium_contract(
                    consortium_name,
                    founding_members,
                    governance_rules
                )
                
                if consortium_id:
                    return jsonify(asdict(APIResponse(
                        success=True,
                        data={"consortium_id": consortium_id},
                        message="Consortium created successfully"
                    )))
                else:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        message="Failed to create consortium"
                    )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/businesses/<business_name>', methods=['GET'])
        def get_business_profile(business_name):
            """Get business profile information"""
            try:
                profile = self.agi_engine.get_business_profile(business_name)
                
                if profile:
                    return jsonify(asdict(APIResponse(
                        success=True,
                        data=profile,
                        message="Business profile retrieved"
                    )))
                else:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        message="Business not found"
                    ))), 404
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/contracts/<contract_name>', methods=['GET'])
        def get_contract_requirements(contract_name):
            """Get contract requirements"""
            try:
                requirements = self.agi_engine.get_contract_requirements(contract_name)
                
                if requirements:
                    return jsonify(asdict(APIResponse(
                        success=True,
                        data=requirements,
                        message="Contract requirements retrieved"
                    )))
                else:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        message="Contract not found"
                    ))), 404
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/wallet/balance/<wallet_address>', methods=['GET'])
        def get_wallet_balance(wallet_address):
            """Get wallet balance"""
            try:
                balance = self.sui_connector.get_wallet_balance(wallet_address)
                
                if balance:
                    return jsonify(asdict(APIResponse(
                        success=True,
                        data=balance,
                        message="Wallet balance retrieved"
                    )))
                else:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        message="Unable to retrieve wallet balance"
                    )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/businesses', methods=['POST'])
        def add_business():
            """Add new business to knowledge base"""
            try:
                data = request.json
                business_name = data.get('business_name')
                business_data = data.get('business_data')
                
                if not business_name or not business_data:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error="Missing required fields: business_name, business_data"
                    ))), 400
                
                self.agi_engine.add_business_to_knowledge_base(business_name, business_data)
                
                return jsonify(asdict(APIResponse(
                    success=True,
                    message="Business added to knowledge base"
                )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
        
        @self.app.route('/api/contracts', methods=['POST'])
        def add_contract():
            """Add new contract to knowledge base"""
            try:
                data = request.json
                contract_name = data.get('contract_name')
                contract_data = data.get('contract_data')
                
                if not contract_name or not contract_data:
                    return jsonify(asdict(APIResponse(
                        success=False,
                        error="Missing required fields: contract_name, contract_data"
                    ))), 400
                
                self.agi_engine.add_contract_to_knowledge_base(contract_name, contract_data)
                
                return jsonify(asdict(APIResponse(
                    success=True,
                    message="Contract added to knowledge base"
                )))
                
            except Exception as e:
                return jsonify(asdict(APIResponse(
                    success=False,
                    error=str(e)
                ))), 500
    
    def run(self, host='localhost', port=5000, debug=True):
        """Run the Flask application"""
        print(f"Starting GigeBid Backend API on {host}:{port}")
        self.app.run(host=host, port=port, debug=debug)

# Factory function for creating the API instance
def create_gigebid_api():
    """Factory function to create GigeBid API instance"""
    return GigeBidBackendAPI()

# Example usage and testing
if __name__ == "__main__":
    # Create and run the API
    api = create_gigebid_api()
    
    # Run the development server
    api.run(host='0.0.0.0', port=5000, debug=True)
