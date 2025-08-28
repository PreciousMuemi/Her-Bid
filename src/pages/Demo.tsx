import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Star, CheckCircle, Clock, Shield, Zap, ArrowRight, Phone, AlertCircle } from 'lucide-react';

const Demo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [teamRecommendation, setTeamRecommendation] = useState(null);
  const [escrowStatus, setEscrowStatus] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  
  const [projectData, setProjectData] = useState({
    title: 'Egg Supply for 10 Schools',
    location: 'Kibera, Nairobi',
    capacity_needed: 10,
    budget: 50000,
    phone: '+254712345000'
  });

  // Check backend connection and load users
  useEffect(() => {
    const checkBackendAndLoadUsers = async () => {
      try {
        console.log('🔍 Checking backend connection...');
        
        // Test backend health
        const healthResponse = await fetch('http://localhost:4000/health');
        
        if (!healthResponse.ok) {
          throw new Error('Backend health check failed');
        }
        
        setBackendConnected(true);
        console.log('✅ Backend connected successfully');
        
        // Load users
        const usersResponse = await fetch('http://localhost:4000/api/users');
        const userData = await usersResponse.json();
        
        if (userData.success && Array.isArray(userData.users)) {
          setAvailableUsers(userData.users);
          console.log(`✅ Loaded ${userData.users.length} users from database`);
        } else {
          throw new Error('Invalid user data format');
        }
        
      } catch (error) {
        console.error('❌ Backend connection failed:', error);
        setBackendConnected(false);
        
        // Set fallback mock users
        const mockUsers = [
          { 
            id: '1', 
            name: 'Grace Wanjiku', 
            location: 'Nairobi', 
            skills: ['Egg Supply', 'Poultry Farming'], 
            capacity_numeric: 3, 
            reputation_score: 9.2 
          },
          { 
            id: '2', 
            name: 'Mary Njeri', 
            location: 'Nairobi', 
            skills: ['Logistics', 'Distribution'], 
            capacity_numeric: 4, 
            reputation_score: 8.7 
          },
          { 
            id: '3', 
            name: 'Jane Muthoni', 
            location: 'Kiambu', 
            skills: ['Quality Control', 'Inspection'], 
            capacity_numeric: 2, 
            reputation_score: 8.9 
          }
        ];
        
        setAvailableUsers(mockUsers);
        console.log('🔄 Using fallback mock users');
      }
    };
    
    checkBackendAndLoadUsers();
  }, []);

  const handleGetTeamRecommendation = async () => {
    setLoading(true);
    try {
      if (!backendConnected) {
        // Use mock recommendation if backend is down
        const mockRecommendation = {
          recommended_team: availableUsers.slice(0, 3),
          explanation: `Mock AGI Analysis: Selected team of ${availableUsers.slice(0, 3).length} members with combined capacity of ${availableUsers.slice(0, 3).reduce((sum, user) => sum + (user.capacity_numeric || 0), 0)} schools/day. High reputation scores and complementary skills.`,
          total_capacity: availableUsers.slice(0, 3).reduce((sum, user) => sum + (user.capacity_numeric || 0), 0),
          confidence_score: 87,
          estimated_cost: []
        };
        
        setTeamRecommendation(mockRecommendation);
        setCurrentStep(2);
        console.log('✅ Mock recommendation generated');
        return;
      }
      
      console.log('🧠 Requesting AGI team recommendation...');
      
      const response = await fetch('http://localhost:4000/api/escrow/recommend-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: projectData.title,
          location: projectData.location,
          capacity_needed: projectData.capacity_needed,
          budget: projectData.budget,
          skills_required: ['Egg Supply', 'Logistics', 'Quality Control']
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setTeamRecommendation(data.recommendation);
        setCurrentStep(2);
        console.log('✅ AGI recommendation received');
      } else {
        throw new Error(data.message || 'Failed to get recommendation');
      }
    } catch (error) {
      console.error('❌ Error getting team recommendation:', error);
      alert(`AGI Error: ${error.message}\n\nUsing mock data for demo purposes.`);
      
      // Fallback to mock recommendation
      const mockRecommendation = {
        recommended_team: availableUsers.slice(0, 3),
        explanation: `Fallback AGI Analysis: Selected team with total capacity of ${availableUsers.slice(0, 3).reduce((sum, user) => sum + (user.capacity_numeric || 0), 0)} schools/day.`,
        total_capacity: availableUsers.slice(0, 3).reduce((sum, user) => sum + (user.capacity_numeric || 0), 0),
        confidence_score: 75,
        estimated_cost: []
      };
      
      setTeamRecommendation(mockRecommendation);
      setCurrentStep(2);
    }
    setLoading(false);
  };

  const handleSecureFunds = async () => {
    setLoading(true);
    try {
      if (!backendConnected) {
        // Mock escrow for demo
        const mockEscrow = {
          project_id: `mock_project_${Date.now()}`,
          amount: projectData.budget,
          status: 'secured',
          checkout_request_id: `CHK_MOCK_${Date.now()}`,
          created_at: new Date().toISOString()
        };
        
        setEscrowStatus(mockEscrow);
        setCurrentStep(3);
        console.log('✅ Mock escrow created');
        return;
      }
      
      console.log('💰 Securing funds with M-Pesa...');
      
      const projectId = `project_${Date.now()}`;
      
      const response = await fetch('http://localhost:4000/api/escrow/secure-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          amount: projectData.budget,
          phone_number: projectData.phone,
          title: projectData.title,
          team_members: teamRecommendation?.recommended_team || []
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setEscrowStatus(data.escrow_details);
        setCurrentStep(3);
        console.log('✅ Funds secured with M-Pesa');
      } else {
        throw new Error(data.message || 'Failed to secure funds');
      }
    } catch (error) {
      console.error('❌ Error securing funds:', error);
      alert(`M-Pesa Error: ${error.message}\n\nUsing mock escrow for demo.`);
      
      // Mock escrow for demo
      const mockEscrow = {
        project_id: `fallback_project_${Date.now()}`,
        amount: projectData.budget,
        status: 'secured',
        checkout_request_id: `CHK_FALLBACK_${Date.now()}`,
        created_at: new Date().toISOString()
      };
      
      setEscrowStatus(mockEscrow);
      setCurrentStep(3);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            🚀 Gige-Bid Real Demo: Live AGI + M-Pesa
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real AGI team formation • Live database • Simulated M-Pesa integration
          </p>
          
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className={`px-3 py-1 ${
              backendConnected ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
            }`}>
              <Users className="w-3 h-3 mr-1" />
              {availableUsers.length} Users {backendConnected ? '(Live)' : '(Mock)'}
            </Badge>
            <Badge variant="outline" className={`px-3 py-1 ${
              backendConnected ? 'border-blue-500 text-blue-700' : 'border-orange-500 text-orange-700'
            }`}>
              <Zap className="w-3 h-3 mr-1" />
              AGI Engine {backendConnected ? '(Live)' : '(Mock)'}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 border-purple-500 text-purple-700">
              <Phone className="w-3 h-3 mr-1" />
              M-Pesa Integration
            </Badge>
          </div>

          {/* Backend Status Warning */}
          {!backendConnected && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center space-x-2 text-orange-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Backend Offline - Using Mock Data</span>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Start your backend server on localhost:4000 for full functionality
              </p>
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center space-x-4 mb-8">
          {[
            { step: 1, title: 'Project Setup', icon: <Users className="w-4 h-4" /> },
            { step: 2, title: 'AGI Matching', icon: <Zap className="w-4 h-4" /> },
            { step: 3, title: 'M-Pesa Escrow', icon: <Shield className="w-4 h-4" /> }
          ].map(({ step, title, icon }) => (
            <div key={step} className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {icon}
              <span className="text-sm font-medium">{title}</span>
            </div>
          ))}
        </div>

        {/* Available Users Preview */}
        {availableUsers.length > 0 && currentStep === 1 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>💾 Available Team Members {backendConnected ? '(Live Data)' : '(Mock Data)'}</CardTitle>
              <CardDescription>
                {availableUsers.length} verified professionals {backendConnected ? 'loaded from database' : 'using fallback data'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableUsers.slice(0, 6).map((user) => (
                  <div key={user.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        ⭐ {user.reputation_score}/10
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">📍 {user.location}</p>
                    <p className="text-sm">🎯 {user.capacity_numeric} schools/day</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(user.skills || []).slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Project Creation */}
        {currentStep === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Step 1: Configure Project Requirements</span>
              </CardTitle>
              <CardDescription>
                Set up your project for AGI team formation and M-Pesa escrow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={projectData.title}
                      onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={projectData.location}
                      onChange={(e) => setProjectData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Schools to Supply</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={projectData.capacity_needed}
                      onChange={(e) => setProjectData(prev => ({ ...prev, capacity_needed: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (KES)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => setProjectData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">M-Pesa Phone Number</Label>
                    <Input
                      id="phone"
                      value={projectData.phone}
                      onChange={(e) => setProjectData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254712345000"
                    />
                  </div>
                </div>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">📊 Project Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>🏫 Schools:</span>
                      <span className="font-medium">{projectData.capacity_needed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>📍 Location:</span>
                      <span className="font-medium">{projectData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💰 Total Budget:</span>
                      <span className="font-medium">KES {projectData.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💵 Per School:</span>
                      <span className="font-medium">
                        KES {projectData.capacity_needed > 0 ? (projectData.budget / projectData.capacity_needed).toLocaleString() : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleGetTeamRecommendation} 
                className="w-full"
                disabled={loading}
              >
                {loading ? '🧠 AGI Engine Processing...' : `🚀 Get ${backendConnected ? 'Live' : 'Mock'} AGI Team Recommendation`}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: AGI Team Recommendation */}
        {currentStep === 2 && teamRecommendation && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Zap className="w-5 h-5" />
                <span>Step 2: AGI Team Recommendation {!backendConnected && '(Mock)'}</span>
              </CardTitle>
              <CardDescription>
                AI-powered optimal team formation based on your requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">🧠 AGI Analysis:</h3>
                <p className="text-blue-800 text-sm">{teamRecommendation.explanation}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-blue-700">
                    🎯 Confidence: {teamRecommendation.confidence_score}%
                  </span>
                  <span className="text-blue-700">
                    📈 Total Capacity: {teamRecommendation.total_capacity} schools/day
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(teamRecommendation.recommended_team || []).map((member, index) => (
                  <div key={member.id || index} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      <Badge variant="outline">⭐ {member.reputation_score}/10</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">📍 {member.location}</p>
                    <p className="text-sm mb-2">🎯 {member.capacity_numeric} schools/day</p>
                    <div className="flex flex-wrap gap-1">
                      {(member.skills || []).slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleSecureFunds} 
                className="w-full"
                disabled={loading}
              >
                {loading ? '💰 Processing M-Pesa...' : `🔒 Secure Funds with ${backendConnected ? 'Live' : 'Mock'} M-Pesa`}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: M-Pesa Escrow */}
        {currentStep === 3 && escrowStatus && (
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Shield className="w-5 h-5" />
                <span>Step 3: M-Pesa Escrow Secured {!backendConnected && '(Mock)'}</span>
              </CardTitle>
              <CardDescription>
                Funds secured in escrow. Project ready to begin!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-green-900 mb-4">✅ Demo Successfully Completed!</h3>
                <p className="text-green-800 mb-4">
                  Your funds are secured in M-Pesa escrow. The AGI-selected team is ready to begin delivery.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">💰 Escrow Details</h4>
                    <p className="text-green-700">Amount: KES {escrowStatus.amount?.toLocaleString()}</p>
                    <p className="text-green-700">Status: {escrowStatus.status}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">📱 M-Pesa Reference</h4>
                    <p className="text-green-700">ID: {escrowStatus.checkout_request_id?.slice(-8)}</p>
                    <p className="text-green-700">Project: {escrowStatus.project_id?.slice(-8)}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={() => {
                  setCurrentStep(1);
                  setTeamRecommendation(null);
                  setEscrowStatus(null);
                }} variant="outline">
                  🔄 Run Demo Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Demo;