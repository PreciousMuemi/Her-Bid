
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/ui/CustomCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Building, Calendar, DollarSign, Users, Award, FileText, 
  CheckCircle, Clock, Shield, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: string;
  dueDate: string;
  status: 'pending' | 'inProgress' | 'completed' | 'verified';
}

interface Partner {
  id: string;
  name: string;
  role: string;
  avatar: string;
  match: number;
}

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [contract, setContract] = useState({
    id: id || '1',
    title: 'Government Digital Transformation Project',
    client: 'Department of Technology',
    description: 'Seeking a diverse team of experts to lead a 12-month digital transformation initiative. This project requires expertise in UX/UI design, full-stack development, project management, and change management. Perfect for a consortium of women-led businesses.',
    detailedDescription: 'This comprehensive project aims to modernize our department\'s digital infrastructure and services. The selected team will be responsible for redesigning our public-facing web portal, creating a mobile application for citizens, integrating various backend systems, and providing thorough training to staff members. We\'re looking for a team with proven experience in government digital transformation and a strong track record of successful project delivery.',
    budget: '$150K-200K',
    deadline: 'August 15, 2023',
    postedDate: 'June 7, 2023',
    location: 'Remote with occasional on-site meetings in Washington, DC',
    duration: '12 months',
    tags: ['UX/UI Design', 'Development', 'Project Management', 'Change Management'],
    matchScore: 92,
    requiredTeamSize: 4,
    status: 'open',
  });
  
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 1,
      title: 'Project Planning & Requirements Gathering',
      description: 'Conduct stakeholder interviews, document requirements, and create project roadmap.',
      amount: '$40,000',
      dueDate: 'Month 1',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Design Phase',
      description: 'Create wireframes, user flows, UI designs, and get client approval.',
      amount: '$35,000',
      dueDate: 'Month 3',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Development: Phase 1',
      description: 'Develop core functionality and backend integrations.',
      amount: '$50,000',
      dueDate: 'Month 6',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Development: Phase 2',
      description: 'Implement remaining features and conduct internal testing.',
      amount: '$35,000',
      dueDate: 'Month 9',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Testing, Training & Launch',
      description: 'User acceptance testing, staff training, and official launch.',
      amount: '$40,000',
      dueDate: 'Month 12',
      status: 'pending',
    },
  ]);
  
  const [recommendedPartners, setRecommendedPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Jamie Davis',
      role: 'UI/UX Designer',
      avatar: 'JD',
      match: 95,
    },
    {
      id: '2',
      name: 'Sarah Patel',
      role: 'Project Manager',
      avatar: 'SP',
      match: 92,
    },
    {
      id: '3',
      name: 'Maya Thompson',
      role: 'Software Developer',
      avatar: 'MT',
      match: 89,
    },
  ]);
  
  const [formData, setFormData] = useState({
    approach: '',
    price: '',
    timeframe: '',
    applyAsTeam: false,
    selectedPartners: [] as string[],
  });
  
  useEffect(() => {
    // Simulate loading contract data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  const handleApplyClick = () => {
    setShowApplyForm(true);
  };
  
  const handlePartnerSelection = (partnerId: string) => {
    setFormData(prev => {
      const isAlreadySelected = prev.selectedPartners.includes(partnerId);
      
      if (isAlreadySelected) {
        return {
          ...prev,
          selectedPartners: prev.selectedPartners.filter(id => id !== partnerId)
        };
      } else {
        return {
          ...prev,
          selectedPartners: [...prev.selectedPartners, partnerId]
        };
      }
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success("Application submitted successfully!");
    
    // Simulate application processing
    setTimeout(() => {
      navigate('/dashboard?tab=bids');
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Loading contract details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Contract Header */}
      <div className={`p-6 mb-6 rounded-lg ${
        isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <div className="flex items-center mb-2">
              {contract.matchScore >= 90 && (
                <Badge className={isDark ? 'bg-green-400/20 text-green-300 mr-2' : 'bg-green-100 text-green-700 mr-2'}>
                  <Award className="mr-1 h-3 w-3" />
                  Perfect Match
                </Badge>
              )}
              <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                Posted on {contract.postedDate}
              </span>
            </div>
            <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {contract.title}
            </h1>
            <div className="flex items-center text-sm">
              <Building className={`mr-1 h-4 w-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                {contract.client}
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className={`text-xl font-semibold mb-1 ${isDark ? 'text-green-300' : 'text-green-600'}`}>
              {contract.budget}
            </div>
            <div className="flex items-center">
              <Clock className={`mr-1 h-4 w-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
              <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                Due {contract.deadline}
              </span>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {contract.tags.map((tag, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : 'border-gray-200 text-gray-700'}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Contract Details & Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className={`mr-2 h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Duration</div>
              <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>{contract.duration}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className={`mr-2 h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <div>
              <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Team Size</div>
              <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>{contract.requiredTeamSize} people needed</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <DollarSign className={`mr-2 h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <div>
              <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Secured Payment</div>
              <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>5 milestone payments</div>
            </div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        {!showApplyForm && (
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <CustomButton 
              size="lg" 
              onClick={handleApplyClick}
              className={isDark 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0' 
                : ''}
            >
              Apply for this Contract
            </CustomButton>
            <CustomButton 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className={isDark ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#182052]' : ''}
            >
              Go Back
            </CustomButton>
          </div>
        )}
      </div>
      
      {showApplyForm ? (
        <div className={`p-6 rounded-lg mb-6 ${
          isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Apply for Contract
          </h2>
          
          <form onSubmit={handleSubmitApplication}>
            <div className="space-y-4 mb-6">
              <div>
                <label 
                  className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}
                  htmlFor="approach"
                >
                  Your Approach
                </label>
                <textarea
                  id="approach"
                  name="approach"
                  rows={4}
                  required
                  value={formData.approach}
                  onChange={handleInputChange}
                  placeholder="Describe how you would approach this project..."
                  className={`w-full p-3 rounded-md ${
                    isDark 
                      ? 'bg-[#182052] border-[#303974] text-white placeholder-[#8891C5]' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-purple-500`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                  Be specific about your methodology and experience with similar projects
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label 
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}
                    htmlFor="price"
                  >
                    Your Proposed Budget
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., $175,000"
                    className={`w-full p-3 rounded-md ${
                      isDark 
                        ? 'bg-[#182052] border-[#303974] text-white placeholder-[#8891C5]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
                
                <div>
                  <label 
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}
                    htmlFor="timeframe"
                  >
                    Your Proposed Timeline
                  </label>
                  <input
                    type="text"
                    id="timeframe"
                    name="timeframe"
                    required
                    value={formData.timeframe}
                    onChange={handleInputChange}
                    placeholder="e.g., 10 months"
                    className={`w-full p-3 rounded-md ${
                      isDark 
                        ? 'bg-[#182052] border-[#303974] text-white placeholder-[#8891C5]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-purple-500`}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="applyAsTeam"
                    name="applyAsTeam"
                    checked={formData.applyAsTeam}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label 
                    htmlFor="applyAsTeam" 
                    className={`ml-2 block text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}
                  >
                    Apply with partners (recommended for this contract)
                  </label>
                </div>
                
                {formData.applyAsTeam && (
                  <div className="mt-3">
                    <div className={`mb-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Recommended Partners for You:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {recommendedPartners.map((partner) => (
                        <div 
                          key={partner.id}
                          onClick={() => handlePartnerSelection(partner.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.selectedPartners.includes(partner.id)
                              ? isDark
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-purple-500 bg-purple-50'
                              : isDark
                                ? 'border-[#303974] hover:border-[#4A5BC2]'
                                : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className={`${
                                isDark ? 'bg-[#182052] text-[#B2B9E1]' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {partner.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {partner.name}
                              </div>
                              <div className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                                {partner.role}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge className={
                              isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'
                            }>
                              {partner.match}% Match
                            </Badge>
                            {formData.selectedPartners.includes(partner.id) && (
                              <CheckCircle className="h-4 w-4 text-purple-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <CustomButton
                variant="outline"
                type="button"
                onClick={() => setShowApplyForm(false)}
                className={isDark ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#182052]' : ''}
              >
                Back
              </CustomButton>
              <CustomButton type="submit">
                Submit Application
              </CustomButton>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Contract Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className={`w-full md:w-auto ${
              isDark 
                ? 'bg-[#0A155A]/70 border border-[#303974]' 
                : 'bg-gray-100 border border-gray-200'
            } p-1 mb-6`}>
              <TabsTrigger 
                value="details" 
                className={`${
                  isDark
                    ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                    : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
                }`}
              >
                <FileText className="h-4 w-4 mr-2" />
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
                <CheckCircle className="h-4 w-4 mr-2" />
                Milestones
              </TabsTrigger>
              <TabsTrigger 
                value="partners" 
                className={`${
                  isDark
                    ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                    : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
                }`}
              >
                <Users className="h-4 w-4 mr-2" />
                Suggested Partners
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <CustomCard className={isDark 
                ? 'bg-[#0A155A]/70 border border-[#303974]' 
                : 'bg-white border border-gray-200'
              }>
                <CustomCardHeader>
                  <CustomCardTitle className={isDark ? 'text-white' : ''}>
                    Project Details
                  </CustomCardTitle>
                </CustomCardHeader>
                <CustomCardContent>
                  <p className={`mb-6 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    {contract.detailedDescription}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Project Location
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                        {contract.location}
                      </p>
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {contract.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Project Budget
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                        {contract.budget}
                      </p>
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Team Size Needed
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                        {contract.requiredTeamSize} team members with complementary skills
                      </p>
                    </div>
                  </div>
                </CustomCardContent>
              </CustomCard>
            </TabsContent>
            
            <TabsContent value="milestones" className="mt-0">
              <CustomCard className={isDark 
                ? 'bg-[#0A155A]/70 border border-[#303974]' 
                : 'bg-white border border-gray-200'
              }>
                <CustomCardHeader>
                  <CustomCardTitle className={isDark ? 'text-white' : ''}>
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-500" />
                      Payment Protection Milestones
                    </div>
                  </CustomCardTitle>
                  <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    This contract uses secure milestone payments. Payment for each phase is held safely in escrow until work is completed.
                  </p>
                </CustomCardHeader>
                <CustomCardContent>
                  <div className="space-y-6 relative">
                    {/* Vertical line connecting milestones */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
                    
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex">
                        <div className="relative">
                          <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center 
                            ${isDark ? 'bg-[#182052] text-[#B2B9E1]' : 'bg-gray-100 text-gray-600'}
                            border-2 ${index === 0 ? 'border-purple-500' : 'border-gray-300'}
                          `}>
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <CustomCard className={`
                            transition-all duration-200
                            ${isDark 
                              ? 'bg-[#182052]/80 border-[#303974] hover:border-purple-500/40' 
                              : 'bg-white border-gray-200 hover:border-purple-300/60'
                            }
                          `}>
                            <CustomCardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                  <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {milestone.title}
                                  </h3>
                                  <p className={`text-sm mb-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                                    {milestone.description}
                                  </p>
                                </div>
                                <div className="mt-2 md:mt-0 md:ml-4 md:text-right">
                                  <div className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                                    {milestone.amount}
                                  </div>
                                  <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                                    Due: {milestone.dueDate}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center">
                                <Shield className={`h-4 w-4 mr-1 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
                                <span className={`text-xs ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                                  Payment protected in escrow
                                </span>
                              </div>
                            </CustomCardContent>
                          </CustomCard>
                        </div>
                      </div>
                    ))}
                  </div>
                </CustomCardContent>
              </CustomCard>
            </TabsContent>
            
            <TabsContent value="partners" className="mt-0">
              <CustomCard className={isDark 
                ? 'bg-[#0A155A]/70 border border-[#303974]' 
                : 'bg-white border border-gray-200'
              }>
                <CustomCardHeader>
                  <CustomCardTitle className={isDark ? 'text-white' : ''}>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-purple-500" />
                      Suggested Partners
                    </div>
                  </CustomCardTitle>
                  <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    Based on the contract requirements, here are women entrepreneurs who would complement your skills.
                  </p>
                </CustomCardHeader>
                <CustomCardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedPartners.map((partner) => (
                      <div 
                        key={partner.id}
                        className={`p-4 rounded-lg border ${
                          isDark
                            ? 'border-[#303974] hover:border-purple-500/50'
                            : 'border-gray-200 hover:border-purple-300'
                        } transition-all duration-200`}
                      >
                        <div className="flex items-center mb-3">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className={`${
                              isDark ? 'bg-[#182052] text-[#B2B9E1]' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {partner.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {partner.name}
                            </div>
                            <div className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                              {partner.role}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-3">
                          <Badge className={
                            isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'
                          }>
                            <Award className="mr-1 h-3 w-3" />
                            {partner.match}% Match
                          </Badge>
                        </div>
                        
                        <CustomButton 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => toast.success(`Invitation sent to ${partner.name}!`)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Connect
                        </CustomButton>
                      </div>
                    ))}
                  </div>
                </CustomCardContent>
              </CustomCard>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ContractDetails;
