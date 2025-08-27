import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Zap, Shield, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import AGIPartnershipFinder from '@/components/agi/AGIPartnershipFinder';

const AGIShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GigeBid AGI Engine
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary AI-powered partnership formation combining MeTTa symbolic reasoning 
            with Sui blockchain security for unprecedented business collaboration.
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <Brain className="w-4 h-4 mr-1" />
              MeTTa AGI
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Shield className="w-4 h-4 mr-1" />
              Sui Blockchain
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Users className="w-4 h-4 mr-1" />
              Smart Partnerships
            </Badge>
          </div>
        </div>

        {/* Architecture Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Three-Layer Architecture
            </CardTitle>
            <CardDescription>
              How AGI reasoning powers blockchain-secured business partnerships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Layer 1: MeTTa */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-lg">MeTTa Layer</h3>
                    <p className="text-sm text-gray-600">The Brain</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Symbolic reasoning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Knowledge graphs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Partnership logic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Skill matching</span>
                  </div>
                </div>
              </div>

              <ArrowRight className="hidden md:block h-8 w-8 text-gray-400 mx-auto self-center" />

              {/* Layer 2: Python */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-bold text-lg">Python Layer</h3>
                    <p className="text-sm text-gray-600">The Interpreter</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>API integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Business logic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Data processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Real-time queries</span>
                  </div>
                </div>
              </div>

              <ArrowRight className="hidden md:block h-8 w-8 text-gray-400 mx-auto self-center" />

              {/* Layer 3: Sui */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-lg">Sui Layer</h3>
                    <p className="text-sm text-gray-600">The Hands</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Smart contracts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Escrow payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Secure transactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Governance</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Process Flow */}
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              The complete flow from AI recommendation to blockchain execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold">Request Analysis</h4>
                <p className="text-sm text-gray-600">AGI analyzes contract requirements and business capabilities</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="font-bold text-green-600">2</span>
                </div>
                <h4 className="font-semibold">Partner Matching</h4>
                <p className="text-sm text-gray-600">Symbolic reasoning finds optimal skill complementarity</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="font-bold text-yellow-600">3</span>
                </div>
                <h4 className="font-semibold">Team Formation</h4>
                <p className="text-sm text-gray-600">AI assembles optimal multi-business teams</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="font-bold text-purple-600">4</span>
                </div>
                <h4 className="font-semibold">Blockchain Execution</h4>
                <p className="text-sm text-gray-600">Sui smart contracts secure the partnership</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Live AGI Demo
            </CardTitle>
            <CardDescription>
              Experience the power of AI-driven partnership formation in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertDescription>
                ✅ <strong>Backend Status:</strong> AGI Engine and Sui Connector are running successfully! 
                The demo below connects to the live Python backend with MeTTa reasoning and Sui integration.
                <br />
                🌐 <strong>API Health:</strong> http://localhost:5000/api/health
              </AlertDescription>
            </Alert>
            
            <AGIPartnershipFinder 
              userBusiness="Sarah's Marketing Agency"
              contractName="Government Tender #123"
              onTeamFormed={(team) => {
                console.log('Demo: Team formed successfully', team);
              }}
              onEscrowCreated={(escrowId) => {
                console.log('Demo: Escrow created', escrowId);
              }}
            />
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AGI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Symbolic Reasoning</h4>
                  <p className="text-sm text-gray-600">Uses MeTTa for formal logic and knowledge representation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Multi-Party Optimization</h4>
                  <p className="text-sm text-gray-600">Forms optimal teams with complementary skills</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Real-Time Learning</h4>
                  <p className="text-sm text-gray-600">Adapts recommendations based on success patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Sui Smart Contracts</h4>
                  <p className="text-sm text-gray-600">Move-based contracts for secure execution</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Escrow Protection</h4>
                  <p className="text-sm text-gray-600">Milestone-based payments with automatic distribution</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Governance</h4>
                  <p className="text-sm text-gray-600">On-chain voting and decision mechanisms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600">
            This represents the cutting edge of AI-powered blockchain applications, 
            combining symbolic reasoning with decentralized finance to create 
            unprecedented opportunities for business collaboration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AGIShowcase;
