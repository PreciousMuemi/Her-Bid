import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  skills: string[];
  location: string;
  capacity: string;
  reputation_score: number;
  profile_image: string;
  completed_projects: string[];
  mpesa_number: string;
}

interface MatchResult {
  team: User[];
  explanation: string;
  confidence_score: number;
  total_capacity: number;
  average_reputation: number;
  local_members: number;
}

const EndToEndDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [escrowResult, setEscrowResult] = useState<any>(null);
  const [paymentResults, setPaymentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PROJECT_ID = 'project-1';
  const PROJECT_AMOUNT = 150000;
  const API_BASE = 'http://localhost:4001/api/matchmaker';

  const handleMatchTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Calling AGI Matchmaker...');
      const response = await fetch(`${API_BASE}/match-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: PROJECT_ID })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Match result:', data);
      
      if (data.success) {
        setMatchResult(data.match_result);
        setCurrentStep(2);
      } else {
        throw new Error(data.error || 'Failed to match team');
      }
    } catch (error) {
      console.error('❌ Error matching team:', error);
      setError(`Failed to connect to backend: ${error.message}. Make sure your server is running on port 4001.`);
    }
    setLoading(false);
  };

  const handleSecureFunds = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Securing funds in escrow...');
      const response = await fetch(`${API_BASE}/secure-funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: PROJECT_ID, 
          amount: PROJECT_AMOUNT,
          phoneNumber: '+254700000000'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Escrow result:', data);
      
      if (data.success) {
        setEscrowResult(data);
        setCurrentStep(3);
        
        // Assign team to project
        if (matchResult) {
          await fetch(`${API_BASE}/assign-team`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              projectId: PROJECT_ID, 
              teamIds: matchResult.team.map(user => user.id)
            })
          });
        }
      } else {
        throw new Error(data.error || 'Failed to secure funds');
      }
    } catch (error) {
      console.error('❌ Error securing funds:', error);
      setError(`Failed to secure funds: ${error.message}`);
    }
    setLoading(false);
  };

  const handleConfirmMilestone = async (teamMemberId: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Confirming milestone for:', teamMemberId);
      const response = await fetch(`${API_BASE}/confirm-milestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: PROJECT_ID, 
          teamMemberId 
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Payment result:', data);
      
      if (data.success) {
        setPaymentResults(prev => [...prev, { teamMemberId, ...data }]);
        
        if (matchResult && paymentResults.length + 1 === matchResult.team.length) {
          setCurrentStep(4);
        }
      } else {
        throw new Error(data.error || 'Failed to confirm milestone');
      }
    } catch (error) {
      console.error('❌ Error confirming milestone:', error);
      setError(`Failed to confirm milestone: ${error.message}`);
    }
    setLoading(false);
  };

  const resetDemo = () => {
    setCurrentStep(1);
    setMatchResult(null);
    setEscrowResult(null);
    setPaymentResults([]);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GigeBid End-to-End Demo</h1>
        <p className="text-gray-600">Experience the full power of AGI-driven team formation and secure M-Pesa payments</p>
        <div className="mt-2 text-sm text-gray-500">
          Backend API: {API_BASE}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            ❌ <strong>Error:</strong> {error}
            <div className="mt-2">
              <Button onClick={resetDemo} size="sm" variant="outline">
                🔄 Reset Demo
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && <div className={`w-16 h-1 ${step < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Project Setup */}
      <Card className={currentStep === 1 ? 'ring-2 ring-blue-500' : ''}>
        <CardHeader>
          <CardTitle>📋 Step 1: Post a Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-lg">Egg Supply for 10 Schools</h3>
            <p className="text-gray-600 mt-1">Weekly egg supply for 10 primary schools in Nairobi area</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span><strong>Budget:</strong> KES 150,000</span>
              <span><strong>Location:</strong> Nairobi</span>
              <span><strong>Capacity Needed:</strong> 10 schools/day</span>
            </div>
          </div>
          
          {currentStep === 1 && (
            <Button onClick={handleMatchTeam} disabled={loading} className="w-full">
              {loading ? 'Finding Optimal Team...' : '🎯 Find Optimal Team with AGI'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Step 2: AGI Matchmaking Results */}
      {currentStep >= 2 && matchResult && (
        <Card className={currentStep === 2 ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <CardTitle>🤖 Step 2: AGI Matchmaking Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                <strong>AGI Explanation:</strong> {matchResult.explanation}
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{matchResult.confidence_score}%</div>
                <div className="text-sm text-gray-600">Confidence Score</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{matchResult.total_capacity}</div>
                <div className="text-sm text-gray-600">Total Capacity</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{matchResult.average_reputation}</div>
                <div className="text-sm text-gray-600">Avg Reputation</div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <h4 className="font-semibold">Recommended Team:</h4>
              {matchResult.team.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={member.profile_image} 
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-gray-600">{member.location} • {member.capacity}</div>
                    <div className="flex gap-1 mt-1">
                      {member.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">⭐ {member.reputation_score}</div>
                    <div className="text-xs text-gray-600">reputation</div>
                  </div>
                </div>
              ))}
            </div>

            {currentStep === 2 && (
              <Button onClick={handleSecureFunds} disabled={loading} className="w-full">
                {loading ? 'Processing...' : '🔒 Secure Funds (KES 150,000)'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: M-Pesa Escrow */}
      {currentStep >= 3 && escrowResult && (
        <Card className={currentStep === 3 ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <CardTitle>💰 Step 3: M-Pesa Escrow Secured</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                ✅ {escrowResult.message}
              </AlertDescription>
            </Alert>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>Amount Secured:</strong> KES {PROJECT_AMOUNT.toLocaleString()}</div>
                <div><strong>M-Pesa Reference:</strong> {escrowResult.mpesa_reference}</div>
                <div><strong>Status:</strong> <Badge className="bg-green-100 text-green-800">Funds in Escrow</Badge></div>
                <div><strong>Paybill:</strong> 522522</div>
              </div>
            </div>

            {currentStep === 3 && matchResult && (
              <div className="space-y-3">
                <h4 className="font-semibold">Confirm Project Milestones:</h4>
                {matchResult.team.map((member) => {
                  const alreadyPaid = paymentResults.find(p => p.teamMemberId === member.id);
                  return (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={member.profile_image} 
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-600">
                            Amount: KES {Math.floor(PROJECT_AMOUNT / matchResult.team.length).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {alreadyPaid ? (
                        <Badge className="bg-green-100 text-green-800">✅ Paid</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleConfirmMilestone(member.id)}
                          disabled={loading}
                        >
                          Confirm Delivery
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Payment Complete */}
      {currentStep >= 4 && (
        <Card>
          <CardHeader>
            <CardTitle>🎉 Step 4: Project Completed Successfully!</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                All team members have been paid successfully! The project has been completed and all funds have been released from escrow.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <h4 className="font-semibold">Payment Summary:</h4>
              {paymentResults.map((payment, index) => {
                const member = matchResult?.team.find(m => m.id === payment.teamMemberId);
                return (
                  <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span>{member?.name}</span>
                    <span className="font-medium">
                      KES {payment.payment_amount.toLocaleString()} • {payment.mpesa_transaction_id}
                    </span>
                  </div>
                );
              })}
            </div>

            <Button onClick={resetDemo} className="w-full mt-4">
              🔄 Start New Demo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EndToEndDemo;