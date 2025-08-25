
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSui } from "@/hooks/useSui";
import { useThemeStore } from "@/store/themeStore";
import { CustomButton } from "@/components/ui/CustomButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, ChevronRight, Building2, Shield, Award, Briefcase, Users, Clock, CheckCircle2, FileSpreadsheet, MessageSquarePlus } from "lucide-react";
import { toast } from "sonner";

interface Contract {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  status: 'draft' | 'active' | 'awarded' | 'completed';
  applicants: number;
  skills: string[];
  createdAt: string;
}

interface Proposal {
  id: string;
  contractTitle: string;
  businessName: string;
  teamSize: number;
  proposedAmount: string;
  proposedTimeline: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  submittedAt: string;
}

const IssuerDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { isConnected, accountId, balance, disconnectFromHedera } = useHedera();
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState("Welcome!");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [username, setUsername] = useState("Contract Issuer");
  const [activeTab, setActiveTab] = useState("posted");
  
  // Mock data
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: "con-001",
      title: "Digital Transformation Project",
      description: "Seeking a team to modernize our digital infrastructure with focus on cloud migration.",
      budget: "$150,000 - $200,000",
      deadline: "2025-07-15",
      status: 'active',
      applicants: 12,
      skills: ["Cloud Architecture", "UX/UI Design", "API Development"],
      createdAt: "2024-04-01"
    },
    {
      id: "con-002",
      title: "Website Redesign",
      description: "Complete overhaul of government agency website with accessibility focus.",
      budget: "$50,000 - $75,000",
      deadline: "2025-06-01",
      status: 'active',
      applicants: 8,
      skills: ["Web Design", "Accessibility", "Frontend Development"],
      createdAt: "2024-04-03"
    },
    {
      id: "con-003",
      title: "Marketing Campaign",
      description: "Comprehensive marketing campaign for new public health initiative.",
      budget: "$80,000 - $100,000",
      deadline: "2025-05-15",
      status: 'draft',
      applicants: 0,
      skills: ["Marketing", "Social Media", "Content Creation"],
      createdAt: "2024-04-05"
    },
    {
      id: "con-004",
      title: "Mobile App Development",
      description: "Development of mobile application for public transportation tracking.",
      budget: "$120,000 - $150,000",
      deadline: "2025-08-01",
      status: 'awarded',
      applicants: 15,
      skills: ["iOS Development", "Android Development", "UX Design"],
      createdAt: "2024-03-15"
    }
  ]);
  
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "prop-001",
      contractTitle: "Digital Transformation Project",
      businessName: "TechSisters Collective",
      teamSize: 5,
      proposedAmount: "$175,000",
      proposedTimeline: "6 months",
      status: 'pending',
      submittedAt: "2024-04-05"
    },
    {
      id: "prop-002",
      contractTitle: "Digital Transformation Project",
      businessName: "CloudWomen Solutions",
      teamSize: 4,
      proposedAmount: "$160,000",
      proposedTimeline: "5 months",
      status: 'pending',
      submittedAt: "2024-04-06"
    },
    {
      id: "prop-003",
      contractTitle: "Website Redesign",
      businessName: "DesignHer Studio",
      teamSize: 3,
      proposedAmount: "$65,000",
      proposedTimeline: "3 months",
      status: 'accepted',
      submittedAt: "2024-04-04"
    },
    {
      id: "prop-004",
      contractTitle: "Mobile App Development",
      businessName: "AppFusion Team",
      teamSize: 6,
      proposedAmount: "$135,000",
      proposedTimeline: "4 months",
      status: 'completed',
      submittedAt: "2024-03-20"
    }
  ]);
  
  // Check auth status
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated && !isConnected) {
      toast.error("Please connect your wallet to access the dashboard");
      navigate("/auth");
      return;
    }
    
    // Load user profile if available
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        if (profile.businessName) {
          setUsername(profile.businessName);
        } else if (profile.email) {
          setUsername(profile.email.split('@')[0]);
        }
      } catch (e) {
        console.error("Error parsing user profile", e);
      }
    }
  }, [isConnected, navigate]);
  
  // Set greeting and time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    // Random greetings for a personal touch
    const greetings = [
      "Welcome back!",
      "Great to see you!",
      "Hello again!",
      "Hi there!",
    ];
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);
  
  // Handle contract posting
  const handlePostNewContract = () => {
    navigate("/create-contract");
  };
  
  // Handle contract actions
  const handlePublishContract = (contractId: string) => {
    setContracts(contracts.map(c => 
      c.id === contractId ? {...c, status: 'active' as const} : c
    ));
    toast.success("Contract published successfully!");
  };
  
  // Handle proposal approval
  const handleApproveProposal = (proposalId: string) => {
    setProposals(proposals.map(p => 
      p.id === proposalId ? {...p, status: 'accepted' as const} : p
    ));
    toast.success("Proposal accepted!");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' : 'text-gray-900'} mb-2`}>
            {greeting} <span className="italic">Good {timeOfDay}, {username}!</span>
          </h1>
          <p className={`${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'} max-w-2xl`}>
            Manage your contracts and connect with talented women-led businesses to complete your projects.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <CustomButton
            onClick={handlePostNewContract}
            className={theme === 'dark' 
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0' 
              : ''
            }
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Post New Contract
          </CustomButton>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
              Active Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {contracts.filter(c => c.status === 'draft').length} draft(s) ready to publish
            </p>
          </CardContent>
        </Card>
        
        <Card className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-500" />
              Total Applicants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proposals.filter(p => p.status === 'pending' || p.status === 'accepted').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {proposals.filter(p => p.status === 'pending').length} awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
              Awarded Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contracts.filter(c => c.status === 'awarded').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {contracts.filter(c => c.status === 'completed').length} completed
            </p>
          </CardContent>
        </Card>
        
        <Card className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileSpreadsheet className="h-4 w-4 mr-2 text-pink-500" />
              Escrow Managed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$310,000</div>
            <p className="text-xs text-muted-foreground mt-1">
              $135,000 pending release
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue={activeTab} className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className={`w-full md:w-auto ${
          theme === 'dark' 
            ? 'bg-[#0A155A]/70 border border-[#303974]' 
            : 'bg-gray-100 border border-gray-200'
        } p-1 mb-6`}>
          <TabsTrigger 
            value="posted" 
            className={`${
              theme === 'dark'
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Your Contracts
          </TabsTrigger>
          <TabsTrigger 
            value="proposals" 
            className={`${
              theme === 'dark'
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Proposals
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className={`${
              theme === 'dark'
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            Payments & Escrow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posted" className="mt-0">
          <div className="mb-6 flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
              Your Contract Listings
            </h2>
            <div className="flex gap-2">
              <select className={`px-3 py-1 text-sm rounded-md border ${
                theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : 'border-gray-200'
              }`}>
                <option>All Statuses</option>
                <option>Draft</option>
                <option>Active</option>
                <option>Awarded</option>
                <option>Completed</option>
              </select>
              <select className={`px-3 py-1 text-sm rounded-md border ${
                theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : 'border-gray-200'
              }`}>
                <option>Sort by Date</option>
                <option>Sort by Budget</option>
                <option>Sort by Applications</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                          {contract.title}
                        </h3>
                        <Badge 
                          variant={
                            contract.status === 'draft' ? 'outline' : 
                            contract.status === 'active' ? 'secondary' :
                            contract.status === 'awarded' ? 'default' : 'destructive'
                          }
                          className="capitalize"
                        >
                          {contract.status}
                        </Badge>
                      </div>
                      <p className={`${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-700'} mb-4`}>
                        {contract.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {contract.skills.map((skill, i) => (
                          <span 
                            key={i} 
                            className={`px-2 py-1 text-xs rounded-full ${
                              theme === 'dark' 
                                ? 'bg-[#182052] text-[#B2B9E1]' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end space-y-4">
                      <div className="text-right">
                        <div className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                          {contract.budget}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Deadline: {new Date(contract.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      {contract.status === 'active' && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{contract.applicants} applicants</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-dashed border-gray-200">
                    {contract.status === 'draft' && (
                      <Button 
                        onClick={() => handlePublishContract(contract.id)}
                        className={theme === 'dark' 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                          : ''
                        }
                      >
                        Publish Contract
                      </Button>
                    )}
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="proposals" className="mt-0">
          <div className="mb-6 flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
              Submitted Proposals
            </h2>
            <div className="flex gap-2">
              <select className={`px-3 py-1 text-sm rounded-md border ${
                theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : 'border-gray-200'
              }`}>
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Accepted</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id} className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                          {proposal.businessName}
                        </h3>
                        <Badge 
                          variant={
                            proposal.status === 'pending' ? 'outline' : 
                            proposal.status === 'accepted' ? 'secondary' :
                            proposal.status === 'completed' ? 'default' : 'destructive'
                          }
                          className="capitalize"
                        >
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        For: {proposal.contractTitle}
                      </p>
                      <div className="flex flex-wrap gap-6 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Team Size</p>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {proposal.teamSize} members
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Proposed Amount</p>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {proposal.proposedAmount}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {proposal.proposedTimeline}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {new Date(proposal.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-dashed border-gray-200">
                    {proposal.status === 'pending' && (
                      <Button 
                        onClick={() => handleApproveProposal(proposal.id)}
                        className={theme === 'dark' 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                          : ''
                        }
                      >
                        Accept Proposal
                      </Button>
                    )}
                    <Button variant="outline">
                      View Details
                    </Button>
                    <Button variant="ghost">
                      <MessageSquarePlus className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
                  Active Escrow Funds
                </h2>
                <Card className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
                  <CardContent className="p-6">
                    <div className="mb-6 space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Digital Transformation Project</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            $175,000
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>50%</span>
                          </div>
                          <Progress value={50} className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Website Redesign</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            $65,000
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-muted-foreground">Mobile App Development</span>
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            $135,000
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4 border-dashed">
                      <div className="flex justify-between">
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Total Funds in Escrow</span>
                        <span className="font-bold text-lg">$375,000</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Available to release</span>
                        <span>$135,000</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button>
                        Manage Escrow Payments
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
                  Upcoming Milestones
                </h2>
                <Card className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            Frontend Development
                          </h3>
                          <p className="text-sm text-muted-foreground">Digital Transformation Project</p>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            $45,000
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Due in 7 days
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            Content Migration
                          </h3>
                          <p className="text-sm text-muted-foreground">Website Redesign</p>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            $15,000
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Due in 2 days
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            Final Deployment
                          </h3>
                          <p className="text-sm text-muted-foreground">Mobile App Development</p>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            $50,000
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> Due today
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
                Payment History
              </h2>
              <Card className={`${theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''} h-[500px] overflow-auto`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Array.from({length: 8}).map((_, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-3 border-dashed last:border-0">
                        <div>
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            {["Phase Completion", "Milestone Payment", "Initial Deposit", "Final Payment"][i % 4]}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(2024, 3, 1 - i).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`font-medium ${
                          i % 3 === 0 ? 'text-green-500' : i % 3 === 1 ? 'text-amber-500' : 'text-blue-500'
                        }`}>
                          ${(25000 - i * 2000).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Button className="w-full" variant="outline">
                  View All Transactions
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper Button component to avoid importing issues
const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  onClick = () => {}, 
  ...props 
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <CustomButton
      variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </CustomButton>
  );
};

export default IssuerDashboard;
