import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MapPin, 
  Star, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Truck,
  Shield,
  Zap,
  ArrowRight,
  Phone
} from 'lucide-react';

const Demo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    title: 'Egg Supply for 10 Schools',
    location: 'Kibera, Nairobi',
    capacity_needed: 10,
    budget: 50000,
    phone: '+254712345000'
  });
  const [teamRecommendation, setTeamRecommendation] = useState(null);
  const [escrowStatus, setEscrowStatus] = useState(null);
  const [milestoneStatus, setMilestoneStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGetTeamRecommendation = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/escrow/recommend-team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      const data = await response.json();
      if (data.success) {
        setTeamRecommendation(data.recommendation);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Error getting team recommendation:', error);
    }
    setLoading(false);
  };

  const handleSecureFunds = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/escrow/secure-funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: 'demo_project_001',
          amount: projectData.budget,
          phone_number: projectData.phone,
          title: projectData.title,
          team_members: teamRecommendation?.recommended_team || []
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setEscrowStatus(data.escrow_details);
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Error securing funds:', error);
    }
    setLoading(false);
  };

  const handleConfirmMilestone = async (milestoneId: number) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/escrow/confirm-milestone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: 'demo_project_001',
          milestone_id: milestoneId,
          confirmed_by: 'School Procurement Officer'
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setMilestoneStatus(prev => [...prev, data.milestone_details]);
        if (milestoneId === 3) {
          setCurrentStep(5); // Project completed
        } else {
          setCurrentStep(4); // Milestone confirmed
        }
      }
    } catch (error) {
      console.error('Error confirming milestone:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Gige-Bid Demo: Intelligent Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience how AGI-powered team formation and M-Pesa escrow create trust in the gig economy
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center space-x-4 mb-8">
          {[
            { step: 1, title: 'Project Creation', icon: <Users className="w-4 h-4" /> },
            { step: 2, title: 'AGI Matching', icon: <Zap className="w-4 h-4" /> },
            { step: 3, title: 'Secure Funds', icon: <Shield className="w-4 h-4" /> },
            { step: 4, title: 'Execution', icon: <Truck className="w-4 h-4" /> },
            { step: 5, title: 'Completion', icon: <CheckCircle className="w-4 h-4" /> }
          ].map(({ step, title, icon }) => (
            <div key={step} className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {icon}
              <span className="text-sm font-medium">{title}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Project Creation */}
        {currentStep === 1 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Step 1: Create Project</span>
              </CardTitle>
              <CardDescription>
                A school procurement officer posts a project for egg supply to multiple schools
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
                      onChange={(e) => setProjectData(prev => ({ ...prev, capacity_needed: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget (KES)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={projectData.budget}
                      onChange={(e) => setProjectData(prev => ({ ...prev, budget: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Project Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Schools:</span>
                      <span className="font-medium">{projectData.capacity_needed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{projectData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Budget:</span>
                      <span className="font-medium">KES {projectData.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per School:</span>
                      <span className="font-medium">KES {(projectData.budget / projectData.capacity_needed).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleGetTeamRecommendation} 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Finding Optimal Team...' : 'Get AGI Team Recommendation'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: AGI Team Recommendation */}
        {currentStep === 2 && teamRecommendation && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Step 2: AGI Team Recommendation</span>
              </CardTitle>
              <CardDescription>
                Our AGI analyzed {teamRecommendation.recommended_team.length} optimal team members with {teamRecommendation.confidence_score}% confidence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Explanation */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3">AGI Reasoning</h3>
                <div className="text-blue-800 text-sm whitespace-pre-line">
                  {teamRecommendation.explanation}
                </div>
              </div>

              {/* Team Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamRecommendation.recommended_team.map((member, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{member.reputation_score}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{member.location}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Capacity:</span> {member.allocated_capacity} schools/day
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Experience:</span> {member.projects_completed} projects
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Payment Distribution</h3>
                <div className="space-y-2">
                  {teamRecommendation.estimated_cost.map((payment, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{payment.name} ({payment.percentage}%)</span>
                      <span className="font-medium">KES {payment.payment_share.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSecureFunds} className="w-full" disabled={loading}>
                {loading ? 'Securing Funds...' : 'Accept Team & Secure Funds'}
                <Shield className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Funds Secured */}
        {currentStep === 3 && escrowStatus && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Step 3: Funds Secured in Escrow</span>
              </CardTitle>
              <CardDescription>
                M-Pesa payment successful. Funds are now secured and will be released upon milestone completion.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Payment Successful</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Amount Secured:</span>
                    <p className="font-semibold text-green-900">KES {escrowStatus.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-green-700">M-Pesa Receipt:</span>
                    <p className="font-semibold text-green-900">{escrowStatus.mpesa_receipt_number}</p>
                  </div>
                  <div>
                    <span className="text-green-700">Paybill Number:</span>
                    <p className="font-semibold text-green-900">{escrowStatus.paybill_number}</p>
                  </div>
                  <div>
                    <span className="text-green-700">Account Reference:</span>
                    <p className="font-semibold text-green-900">{escrowStatus.account_reference}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Project Milestones</h3>
                <div className="space-y-3">
                  {[
                    { id: 1, title: 'First delivery batch (40%)', amount: escrowStatus.amount * 0.4 },
                    { id: 2, title: 'Second delivery batch (30%)', amount: escrowStatus.amount * 0.3 },
                    { id: 3, title: 'Final delivery batch (30%)', amount: escrowStatus.amount * 0.3 }
                  ].map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{milestone.title}</h4>
                        <p className="text-sm text-muted-foreground">KES {milestone.amount.toLocaleString()}</p>
                      </div>
                      <Button 
                        onClick={() => handleConfirmMilestone(milestone.id)}
                        disabled={loading || milestoneStatus.some(m => m.milestone_id === milestone.id)}
                        variant={milestoneStatus.some(m => m.milestone_id === milestone.id) ? "secondary" : "default"}
                      >
                        {milestoneStatus.some(m => m.milestone_id === milestone.id) ? 'Completed' : 'Confirm Delivery'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Milestone Confirmed */}
        {currentStep === 4 && milestoneStatus.length > 0 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Step 4: Milestone Confirmed</span>
              </CardTitle>
              <CardDescription>
                Delivery confirmed. Payments have been automatically sent to team members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {milestoneStatus.map((milestone, index) => (
                <div key={index} className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="font-semibold text-green-900">
                      Milestone {milestone.milestone_id} Completed
                    </h3>
                  </div>
                  <p className="text-green-800 mb-4">{milestone.description}</p>
                  <div className="text-sm text-green-700">
                    <p>✅ Payments sent to team members' M-Pesa accounts</p>
                    <p>✅ Escrow automatically released {milestone.percentage}% of funds</p>
                    <p>✅ Transaction recorded on blockchain for transparency</p>
                  </div>
                </div>
              ))}
              
              <div className="text-center">
                <Button onClick={() => handleConfirmMilestone(milestoneStatus.length + 1)} disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Next Delivery'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Project Completed */}
        {currentStep === 5 && (
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <span>Project Successfully Completed!</span>
              </CardTitle>
              <CardDescription>
                All milestones confirmed. Payments distributed. Project closed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-green-900 mb-4">🎉 Demo Complete!</h3>
                <p className="text-green-800 mb-6">
                  You've experienced the full Gige-Bid workflow: AGI team formation, 
                  secure M-Pesa escrow, and automatic milestone-based payments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Trust Built</h4>
                    <p className="text-green-700">Blockchain-verified transactions</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Payments Secured</h4>
                    <p className="text-green-700">M-Pesa escrow protection</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900">Team Optimized</h4>
                    <p className="text-green-700">AGI-powered matching</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={() => {
                  setCurrentStep(1);
                  setTeamRecommendation(null);
                  setEscrowStatus(null);
                  setMilestoneStatus([]);
                }} variant="outline">
                  Run Demo Again
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
