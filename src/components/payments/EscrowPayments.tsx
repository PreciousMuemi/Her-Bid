
import { useState } from 'react';
import { useThemeStore } from "@/store/themeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/CustomButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, DollarSign, CheckSquare, Clock, Calendar, AlertCircle, 
  ChevronDown, ChevronUp, Lock 
} from "lucide-react";
import { toast } from "sonner";

const EscrowPayments = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isDeploying, setIsDeploying] = useState(false);
  const [escrowDeployed, setEscrowDeployed] = useState(false);
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  
  // Mock milestone data
  const milestones = [
    {
      id: 1,
      title: 'Project Setup and Requirements Analysis',
      description: 'Initial setup, user research, and requirements documentation',
      amount: 5000,
      status: 'completed',
      deadline: '2025-04-15',
      completedDate: '2025-04-12'
    },
    {
      id: 2,
      title: 'Design Phase',
      description: 'UI/UX design, wireframes, and prototypes',
      amount: 7500,
      status: 'active',
      deadline: '2025-05-01',
      completedDate: null
    },
    {
      id: 3,
      title: 'Development Phase 1',
      description: 'Core functionality implementation',
      amount: 12000,
      status: 'pending',
      deadline: '2025-05-20',
      completedDate: null
    },
    {
      id: 4,
      title: 'Final Delivery and Testing',
      description: 'QA testing, bug fixes, and project handover',
      amount: 5500,
      status: 'pending',
      deadline: '2025-06-05',
      completedDate: null
    }
  ];
  
  const toggleMilestone = (id: number) => {
    if (expandedMilestone === id) {
      setExpandedMilestone(null);
    } else {
      setExpandedMilestone(id);
    }
  };
  
  const deployEscrowContract = () => {
    setIsDeploying(true);
    // Simulate contract deployment
    toast.info('Deploying escrow smart contract...');
    setTimeout(() => {
      setIsDeploying(false);
      setEscrowDeployed(true);
      toast.success('Escrow contract deployed successfully!');
    }, 3000);
  };
  
  const markMilestoneComplete = (id: number) => {
    toast.info('Marking milestone as complete...');
    setTimeout(() => {
      toast.success('Milestone marked as complete! Awaiting client approval.');
    }, 1500);
  };
  
  const releaseFunds = (id: number) => {
    toast.info('Releasing funds for milestone...');
    setTimeout(() => {
      toast.success('Funds successfully released to your account!');
    }, 1500);
  };
  
  const getStatusBadge = (status: string) => {
    let badgeClasses = '';
    let icon = null;
    
    switch(status) {
      case 'completed':
        badgeClasses = isDark 
          ? 'bg-green-400/20 text-green-300' 
          : 'bg-green-100 text-green-700';
        icon = <CheckSquare className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'active':
        badgeClasses = isDark 
          ? 'bg-blue-400/20 text-blue-300' 
          : 'bg-blue-100 text-blue-700';
        icon = <Clock className="h-3.5 w-3.5 mr-1" />;
        break;
      case 'pending':
        badgeClasses = isDark 
          ? 'bg-gray-400/20 text-gray-300' 
          : 'bg-gray-100 text-gray-700';
        icon = <Calendar className="h-3.5 w-3.5 mr-1" />;
        break;
      default:
        badgeClasses = isDark 
          ? 'bg-yellow-400/20 text-yellow-300' 
          : 'bg-yellow-100 text-yellow-700';
        icon = <AlertCircle className="h-3.5 w-3.5 mr-1" />;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses}`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-500" />
            Payment Protection
          </CardTitle>
          <CardDescription>
            Secure milestone-based payments with escrow smart contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!escrowDeployed ? (
            <div className="space-y-4">
              <Alert variant={isDark ? "default" : "default"} className={isDark ? 'bg-[#182052] border-[#303974]' : ''}>
                <Lock className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Set up an escrow contract to protect both parties and ensure secure payments for milestones.
                </AlertDescription>
              </Alert>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-100'}`}>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : ''}`}>How escrow payments work:</h4>
                <ul className={`space-y-2 text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 mt-0.5">1.</div>
                    <div>Client deposits funds into a secure smart contract</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 mt-0.5">2.</div>
                    <div>Funds are locked until milestone completion</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 mt-0.5">3.</div>
                    <div>You mark milestones as complete when work is done</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 mt-0.5">4.</div>
                    <div>Client reviews and approves the work</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="min-w-4 mt-0.5">5.</div>
                    <div>Funds are automatically released to your account</div>
                  </li>
                </ul>
              </div>
              
              <CustomButton 
                onClick={deployEscrowContract} 
                disabled={isDeploying}
                className={`w-full ${isDark 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                  : ''}`}
              >
                {isDeploying ? 'Deploying...' : 'Deploy Escrow Contract'}
              </CustomButton>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : ''}`}>
                    Contract Total
                  </h3>
                  <div className="flex items-center">
                    <DollarSign className={`h-4 w-4 mr-1 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
                    <span className={`text-2xl font-bold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                      {milestones.reduce((sum, milestone) => sum + milestone.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-green-400/10 border border-green-400/30' : 'bg-green-50 border border-green-100'}`}>
                  <div className={`text-sm font-medium mb-1 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                    Escrow Contract
                  </div>
                  <div className={`text-xs ${isDark ? 'text-green-300/70' : 'text-green-600'}`}>
                    0x72F...38B9 • Active
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                <h4 className={`font-medium ${isDark ? 'text-white' : ''}`}>Project Milestones</h4>
                
                {milestones.map((milestone) => (
                  <div 
                    key={milestone.id} 
                    className={`border rounded-lg overflow-hidden ${
                      isDark ? 'border-[#303974]' : 'border-gray-200'
                    }`}
                  >
                    <div 
                      className={`flex justify-between items-center p-4 cursor-pointer ${
                        expandedMilestone === milestone.id && isDark
                          ? 'bg-[#182052]'
                          : expandedMilestone === milestone.id
                            ? 'bg-gray-50'
                            : ''
                      }`}
                      onClick={() => toggleMilestone(milestone.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === 'completed'
                              ? isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'
                              : isDark ? 'bg-[#303974] text-[#B2B9E1]' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {milestone.id}
                        </div>
                        <div>
                          <div className={`font-medium ${isDark ? 'text-white' : ''}`}>
                            {milestone.title}
                          </div>
                          <div className="flex items-center mt-1 space-x-2">
                            {getStatusBadge(milestone.status)}
                            <span className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                              Due: {milestone.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`font-semibold ${isDark ? 'text-white' : ''}`}>
                            ${milestone.amount.toLocaleString()}
                          </div>
                        </div>
                        {expandedMilestone === milestone.id ? (
                          <ChevronUp className={`h-5 w-5 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
                        ) : (
                          <ChevronDown className={`h-5 w-5 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
                        )}
                      </div>
                    </div>
                    
                    {expandedMilestone === milestone.id && (
                      <div className={`p-4 border-t ${isDark ? 'border-[#303974] bg-[#0A155A]/30' : 'border-gray-200'}`}>
                        <div className={`mb-3 text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          {milestone.description}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {milestone.status === 'active' && (
                            <CustomButton 
                              size="sm" 
                              onClick={() => markMilestoneComplete(milestone.id)}
                            >
                              Mark as Complete
                            </CustomButton>
                          )}
                          
                          {milestone.status === 'completed' && (
                            <CustomButton 
                              size="sm" 
                              onClick={() => releaseFunds(milestone.id)}
                              variant="outline"
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Release Funds
                            </CustomButton>
                          )}
                          
                          <CustomButton 
                            size="sm"
                            variant={isDark ? "outline" : "outline"}
                            className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}
                          >
                            View Details
                          </CustomButton>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EscrowPayments;
