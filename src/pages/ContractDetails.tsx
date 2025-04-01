
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { useHedera } from '@/contexts/HederaContext';
import { CustomButton } from '@/components/ui/CustomButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Briefcase, Calendar, Clock, Users, Building2, 
  DollarSign, Star, Heart, CheckCheck, ChevronLeft,
  Video, FileText, FileCheck, Info, AlertCircle, CheckCircle, User, MessagesSquare
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Sample contract data - in a real app this would come from an API
const CONTRACT_DATA = {
  id: "opp-123456",
  title: "Government Digital Transformation Project",
  client: "Department of Technology",
  description: "This comprehensive project involves modernizing the digital infrastructure of a government agency. The selected team will develop new user interfaces, create API integrations, and implement a secure data management system. The project requires expertise in UX/UI design, full-stack development, project management, and change management.",
  budget: "$150,000 - $200,000",
  deadline: "September 30, 2023",
  postedDate: "July 15, 2023",
  duration: "12 months",
  skills: ["UX/UI Design", "Full-stack Development", "Project Management", "Change Management", "API Integration", "Government Experience"],
  status: "open",
  matchScore: 87,
  interestedBusinesses: 12,
  views: 45,
  location: "Remote with occasional on-site meetings",
  milestones: [
    { id: 1, title: "Requirements Gathering & Initial Design", amount: 30000, status: "pending", deadline: "November 30, 2023" },
    { id: 2, title: "UI/UX Development", amount: 45000, status: "pending", deadline: "January 30, 2024" },
    { id: 3, title: "Backend Integration", amount: 65000, status: "pending", deadline: "April 30, 2024" },
    { id: 4, title: "Testing & Deployment", amount: 35000, status: "pending", deadline: "July 31, 2024" },
    { id: 5, title: "Training & Handover", amount: 25000, status: "pending", deadline: "August 31, 2024" }
  ],
  suggestedPartners: [
    { id: 1, name: "Sarah Johnson", business: "Johnson Design Studios", skills: ["UX/UI Design", "User Research"], matchScore: 94 },
    { id: 2, name: "Maria Rodriguez", business: "Rodriguez Tech Solutions", skills: ["Full-stack Development", "API Integration"], matchScore: 91 },
    { id: 3, name: "Latisha Williams", business: "Williams Project Management", skills: ["Project Management", "Change Management"], matchScore: 88 }
  ]
};

const ContractDetails = () => {
  const { theme } = useThemeStore();
  const { isConnected, accountId } = useHedera();
  const navigate = useNavigate();
  const { id } = useParams();
  const isDark = theme === 'dark';
  const [isApplying, setIsApplying] = useState(false);
  const [showPartners, setShowPartners] = useState(false);
  const [contractData, setContractData] = useState(CONTRACT_DATA);
  const [selectedPartners, setSelectedPartners] = useState<number[]>([]);
  const [applicationData, setApplicationData] = useState({
    proposal: '',
    price: '',
    timeline: '',
    approach: 'solo' // solo or team
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!isConnected) {
      toast.error("Please connect your wallet to view contract details");
      navigate("/auth");
    }
    
    // In a real app, we would fetch the contract data based on the ID
    console.log(`Fetching contract with ID: ${id}`);
  }, [isConnected, navigate, id]);

  const handleApply = () => {
    setIsApplying(true);
  };

  const handlePartnerToggle = (partnerId: number) => {
    if (selectedPartners.includes(partnerId)) {
      setSelectedPartners(selectedPartners.filter(id => id !== partnerId));
    } else {
      setSelectedPartners([...selectedPartners, partnerId]);
    }
  };

  const handleApproachChange = (approach: string) => {
    setApplicationData({
      ...applicationData,
      approach
    });
    
    if (approach === 'team') {
      setShowPartners(true);
    }
  };

  const handleSubmitApplication = () => {
    // In a real app, we would submit the application to an API
    toast.success("Your application has been submitted!");
    setIsApplying(false);
    
    // For demo purposes, show a "contract awarded" message after a delay
    setTimeout(() => {
      toast.success("Congratulations! Your team has been awarded the contract!", {
        duration: 5000
      });
      
      // Update the contract status
      setContractData({
        ...contractData,
        status: "awarded"
      });
    }, 3000);
  };

  const renderMatchScore = (score: number) => {
    let color = "text-green-500";
    if (score < 70) color = "text-yellow-500";
    if (score < 50) color = "text-red-500";
    
    return (
      <div className="flex items-center">
        <Star className={`h-5 w-5 ${color}`} />
        <span className="ml-1 font-semibold">{score}%</span>
        <span className="ml-1 text-sm">match</span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <button 
        onClick={() => navigate(-1)}
        className={`inline-flex items-center mb-6 ${
          isDark ? 'text-[#B2B9E1] hover:text-white' : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Opportunities
      </button>
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'}>
              Open
            </Badge>
            {renderMatchScore(contractData.matchScore)}
          </div>
          
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            {contractData.title}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Building2 className={`h-4 w-4 mr-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}>
                {contractData.client}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className={`h-4 w-4 mr-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}>
                Posted: {contractData.postedDate}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <CustomButton 
                variant="outline" 
                className={isDark ? 'border-[#303974]' : ''}
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </CustomButton>
            </DialogTrigger>
            <DialogContent className={isDark ? 'bg-[#0A155A] border-[#303974] text-white' : ''}>
              <DialogHeader>
                <DialogTitle>Save This Opportunity</DialogTitle>
                <DialogDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
                  This opportunity has been saved to your favorites. You can access it anytime from your dashboard.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end">
                <CustomButton size="sm">View Saved Opportunities</CustomButton>
              </div>
            </DialogContent>
          </Dialog>
          
          {contractData.status === 'open' ? (
            <CustomButton 
              onClick={handleApply}
              className={`${
                isDark
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none'
                  : ''
              }`}
            >
              Apply for this Contract
            </CustomButton>
          ) : (
            <CustomButton 
              className={`${
                isDark
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Contract Awarded
            </CustomButton>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className={`h-5 w-5 mr-2 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{contractData.budget}</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
              Total contract value
            </p>
          </CardContent>
        </Card>
        
        <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{contractData.duration}</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
              Deadline: {contractData.deadline}
            </p>
          </CardContent>
        </Card>
        
        <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className={`h-5 w-5 mr-2 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              Team Size Needed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">3-5 People</p>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
              Perfect for a small team
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className={`w-full md:w-auto ${
          isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-gray-100 border border-gray-200'
        } p-1 mb-6`}>
          <TabsTrigger 
            value="details" 
            className={`${
              isDark
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="milestones" 
            className={`${
              isDark
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Payment Milestones
          </TabsTrigger>
          <TabsTrigger 
            value="partners" 
            className={`${
              isDark
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Suggested Partners
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                  {contractData.description}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {contractData.skills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`${
                        isDark 
                          ? 'bg-[#4A5BC2]/20 border-[#4A5BC2]' 
                          : 'bg-primary/10 border-primary/30'
                      }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Location</h3>
                <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                  {contractData.location}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Contract Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-[#181F6A]' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <Users className={`h-5 w-5 mr-2 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Interested Businesses
                      </span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{contractData.interestedBusinesses}</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-[#181F6A]' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <Info className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Profile Views
                      </span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{contractData.views}</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-[#181F6A]' : 'bg-gray-50'}`}>
                    <div className="flex items-center">
                      <Star className={`h-5 w-5 mr-2 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} />
                      <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Match Score
                      </span>
                    </div>
                    <p className="text-xl font-semibold mt-1">{contractData.matchScore}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
            <CardHeader>
              <CardTitle>Payment Protection Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`mb-6 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                This contract is broken down into milestone payments. Each payment is held safely in a secure account until you complete the work and the client approves it.
              </p>
              
              <div className="space-y-8">
                {contractData.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative">
                    {/* Vertical timeline connector */}
                    {index < contractData.milestones.length - 1 && (
                      <div className={`absolute left-4 top-10 bottom-0 w-0.5 ${
                        isDark ? 'bg-[#303974]' : 'bg-gray-200'
                      }`}></div>
                    )}
                    
                    <div className="flex">
                      <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                        milestone.status === 'complete' 
                          ? isDark 
                            ? 'bg-green-500 text-white' 
                            : 'bg-green-100 text-green-600'
                          : isDark 
                            ? 'bg-[#303974] text-[#B2B9E1]' 
                            : 'bg-gray-100 text-gray-500'
                      }`}>
                        {milestone.status === 'complete' 
                          ? <CheckCircle className="h-5 w-5" /> 
                          : index + 1
                        }
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <h3 className="text-lg font-medium">{milestone.title}</h3>
                          <div className={`md:text-right font-semibold ${
                            isDark ? 'text-green-300' : 'text-green-600'
                          }`}>
                            ${milestone.amount.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-2">
                          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                            <Calendar className="inline h-4 w-4 mr-1" />
                            Due: {milestone.deadline}
                          </p>
                          <Badge className={`mt-2 md:mt-0 w-fit ${
                            milestone.status === 'complete'
                              ? isDark 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-green-100 text-green-700'
                              : isDark 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            {milestone.status === 'complete' ? 'Completed' : 'Pending'}
                          </Badge>
                        </div>
                        
                        {contractData.status === 'awarded' && milestone.status !== 'complete' && (
                          <CustomButton 
                            size="sm" 
                            variant="outline"
                            className="mt-3"
                          >
                            <FileCheck className="h-4 w-4 mr-1" />
                            Mark as Complete
                          </CustomButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-8 p-4 rounded-lg ${
                isDark ? 'bg-[#181F6A]' : 'bg-gray-50'
              }`}>
                <div className="flex items-center mb-2">
                  <AlertCircle className={`h-5 w-5 mr-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                  <h3 className="text-lg font-medium">How Secure Payments Work</h3>
                </div>
                <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  When you're awarded this contract, the client deposits the full payment into a secure account on the Hedera blockchain. As you complete each milestone, you request payment, and once the client approves, the funds are released directly to your account. This ensures you always get paid for your work.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="partners">
          <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
            <CardHeader>
              <CardTitle>Suggested Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`mb-6 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Based on the skills needed for this contract, we've found these potential partners who complement your expertise. Team up to increase your chances of winning!
              </p>
              
              <div className="space-y-4">
                {contractData.suggestedPartners.map((partner) => (
                  <div 
                    key={partner.id} 
                    className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center ${
                      isDark 
                        ? 'border-[#303974] bg-[#181F6A]' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center flex-grow">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`${
                          isDark ? 'bg-[#4A5BC2]/20 text-[#B2B9E1]' : 'bg-primary/10 text-primary'
                        }`}>
                          {partner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="ml-3 flex-grow">
                        <h3 className="font-medium">{partner.name}</h3>
                        <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                          {partner.business}
                        </p>
                      </div>
                      
                      <div className="hidden md:block">
                        <div className="flex items-center">
                          <Star className={`h-4 w-4 ${
                            partner.matchScore > 90 
                              ? 'text-yellow-400' 
                              : partner.matchScore > 80 
                                ? 'text-green-400' 
                                : 'text-blue-400'
                          }`} />
                          <span className="ml-1 font-medium">{partner.matchScore}%</span>
                          <span className="ml-1 text-xs">match</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:mt-0 md:ml-4 flex flex-wrap gap-2">
                      {partner.skills.map((skill, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline" 
                          className={`${
                            isDark 
                              ? 'bg-[#4A5BC2]/20 border-[#4A5BC2]' 
                              : 'bg-primary/10 border-primary/30'
                          }`}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 flex gap-2">
                      <CustomButton 
                        size="sm" 
                        variant="outline"
                        className={`flex-1 md:flex-none ${
                          isDark ? 'border-[#303974]' : ''
                        }`}
                      >
                        <User className="h-4 w-4 mr-1" />
                        Profile
                      </CustomButton>
                      <CustomButton 
                        size="sm"
                        className="flex-1 md:flex-none"
                      >
                        <MessagesSquare className="h-4 w-4 mr-1" />
                        Connect
                      </CustomButton>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isApplying && (
        <Dialog open={isApplying} onOpenChange={setIsApplying}>
          <DialogContent className={`max-w-3xl ${isDark ? 'bg-[#0A155A] border-[#303974] text-white' : ''}`}>
            <DialogHeader>
              <DialogTitle className="text-xl">Apply for Contract</DialogTitle>
              <DialogDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
                Tell us about your approach to this project and how you'll deliver success.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div>
                <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  How would you like to apply?
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => handleApproachChange('solo')}
                    className={`p-4 rounded-lg border flex-1 text-left ${
                      applicationData.approach === 'solo'
                        ? isDark 
                          ? 'border-purple-500 bg-purple-500/20' 
                          : 'border-primary bg-primary/10'
                        : isDark 
                          ? 'border-[#303974] bg-[#181F6A]' 
                          : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <User className={`h-5 w-5 mr-2 ${
                        applicationData.approach === 'solo'
                          ? isDark ? 'text-purple-300' : 'text-primary' 
                          : isDark ? 'text-[#B2B9E1]' : 'text-gray-500'
                      }`} />
                      <h3 className="font-medium">Apply Solo</h3>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      Submit an application as an individual business
                    </p>
                  </button>
                  
                  <button
                    onClick={() => handleApproachChange('team')}
                    className={`p-4 rounded-lg border flex-1 text-left ${
                      applicationData.approach === 'team'
                        ? isDark 
                          ? 'border-purple-500 bg-purple-500/20' 
                          : 'border-primary bg-primary/10'
                        : isDark 
                          ? 'border-[#303974] bg-[#181F6A]' 
                          : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <Users className={`h-5 w-5 mr-2 ${
                        applicationData.approach === 'team'
                          ? isDark ? 'text-purple-300' : 'text-primary' 
                          : isDark ? 'text-[#B2B9E1]' : 'text-gray-500'
                      }`} />
                      <h3 className="font-medium">Team Up (Recommended)</h3>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      Apply with partners who have complementary skills
                    </p>
                  </button>
                </div>
              </div>
              
              {showPartners && (
                <div>
                  <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Select Partners to Team Up With
                  </label>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {contractData.suggestedPartners.map((partner) => (
                      <div 
                        key={partner.id} 
                        className={`p-3 rounded-lg border flex items-center ${
                          selectedPartners.includes(partner.id)
                            ? isDark 
                              ? 'border-purple-500 bg-purple-500/20' 
                              : 'border-primary bg-primary/10'
                            : isDark 
                              ? 'border-[#303974] bg-[#181F6A]' 
                              : 'border-gray-200 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPartners.includes(partner.id)}
                          onChange={() => handlePartnerToggle(partner.id)}
                          className="mr-3"
                        />
                        
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${
                            isDark ? 'bg-[#4A5BC2]/20 text-[#B2B9E1]' : 'bg-primary/10 text-primary'
                          }`}>
                            {partner.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="ml-3 flex-grow">
                          <h3 className="font-medium">{partner.name}</h3>
                          <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                            {partner.business}
                          </p>
                        </div>
                        
                        <div className="flex items-center">
                          <Star className={`h-4 w-4 ${
                            partner.matchScore > 90 
                              ? 'text-yellow-400' 
                              : partner.matchScore > 80 
                                ? 'text-green-400' 
                                : 'text-blue-400'
                          }`} />
                          <span className="ml-1 font-medium">{partner.matchScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Project Approach
                </label>
                <textarea
                  placeholder="Describe how you'll approach this project and what makes you the right team for the job..."
                  value={applicationData.proposal}
                  onChange={(e) => setApplicationData({...applicationData, proposal: e.target.value})}
                  className={`w-full min-h-[120px] p-3 rounded-lg border ${
                    isDark ? 'bg-[#181F6A] border-[#303974] text-white' : 'border-gray-300'
                  }`}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Your Proposed Budget
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $175,000"
                    value={applicationData.price}
                    onChange={(e) => setApplicationData({...applicationData, price: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${
                      isDark ? 'bg-[#181F6A] border-[#303974] text-white' : 'border-gray-300'
                    }`}
                  />
                </div>
                
                <div>
                  <label className={`block font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Estimated Timeline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 months"
                    value={applicationData.timeline}
                    onChange={(e) => setApplicationData({...applicationData, timeline: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${
                      isDark ? 'bg-[#181F6A] border-[#303974] text-white' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                <CustomButton 
                  variant="outline" 
                  onClick={() => setIsApplying(false)}
                  className={isDark ? 'border-[#303974]' : ''}
                >
                  Cancel
                </CustomButton>
                <CustomButton 
                  onClick={handleSubmitApplication}
                  className={`${
                    isDark
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none'
                      : ''
                  }`}
                >
                  Submit Application
                </CustomButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ContractDetails;
