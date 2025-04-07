
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/CustomCard";
import { CustomButton } from '@/components/ui/CustomButton';
import { Badge } from '@/components/ui/badge';
import { Award, ChevronRight, Calendar, DollarSign, Building, Users } from 'lucide-react';

interface ContractProps {
  id: string;
  title: string;
  client: string;
  description: string;
  budget: string;
  deadline: string;
  tags: string[];
  matchScore: number;
  requiredTeamSize: number;
}

const RecommendedContracts = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [contracts] = useState<ContractProps[]>([
    {
      id: '1',
      title: 'Government Digital Transformation Project',
      client: 'Department of Technology',
      description: 'Seeking a diverse team of experts to lead a 12-month digital transformation initiative. This project requires expertise in UX/UI design, full-stack development, project management, and change management.',
      budget: '$150K-200K',
      deadline: 'Due in 30 days',
      tags: ['UX/UI Design', 'Development', 'Project Management'],
      matchScore: 92,
      requiredTeamSize: 4
    },
    {
      id: '2',
      title: 'Corporate Website Redesign',
      client: 'Fortune 500 Retail Company',
      description: 'Complete overhaul of our corporate website with focus on accessibility, mobile responsiveness, and integration with our e-commerce platform.',
      budget: '$80K-100K',
      deadline: 'Due in 15 days',
      tags: ['Web Design', 'Development', 'SEO'],
      matchScore: 88,
      requiredTeamSize: 3
    },
    {
      id: '3',
      title: 'Social Media Marketing Campaign',
      client: 'Emerging Tech Startup',
      description: 'Develop and execute a comprehensive social media strategy to increase brand awareness and user acquisition for our new mobile app.',
      budget: '$30K-45K',
      deadline: 'Due in 7 days',
      tags: ['Social Media', 'Content Creation', 'Analytics'],
      matchScore: 96,
      requiredTeamSize: 2
    },
    {
      id: '4',
      title: 'Product Launch Event Planning',
      client: 'Healthcare Innovation Company',
      description: 'Organize a high-profile product launch event for our new medical device, including venue selection, guest management, PR coordination, and day-of logistics.',
      budget: '$50K-75K',
      deadline: 'Due in 45 days',
      tags: ['Event Planning', 'PR', 'Logistics'],
      matchScore: 85,
      requiredTeamSize: 3
    },
    {
      id: '5',
      title: 'HR Training Program Development',
      client: 'National Retail Chain',
      description: 'Create a comprehensive diversity and inclusion training program for our 5,000+ employees, including content development, delivery methods, and success metrics.',
      budget: '$60K-80K',
      deadline: 'Due in 60 days',
      tags: ['Training Development', 'HR', 'Diversity & Inclusion'],
      matchScore: 90,
      requiredTeamSize: 2
    }
  ]);

  const getMeterColor = (score: number): string => {
    if (score >= 90) {
      return isDark ? 'bg-green-500' : 'bg-green-600';
    } else if (score >= 80) {
      return isDark ? 'bg-blue-500' : 'bg-blue-600';
    } else {
      return isDark ? 'bg-purple-500' : 'bg-purple-600';
    }
  };

  const getMatchScoreBadge = (score: number): string => {
    if (score >= 90) {
      return isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700';
    } else if (score >= 80) {
      return isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-700';
    } else {
      return isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-700';
    }
  };

  const handleViewContract = (id: string) => {
    navigate(`/contracts/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Award className="inline mr-2 h-5 w-5 text-yellow-400" />
          Recommended Contracts for You
        </h2>
        <CustomButton
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard?tab=opportunities')}
          className={isDark ? 'text-[#B2B9E1] border-[#303974]' : ''}
        >
          View All Contracts <ChevronRight className="ml-1 h-4 w-4" />
        </CustomButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map((contract) => (
          <CustomCard 
            key={contract.id}
            className={`h-full ${
              isDark 
                ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] hover:border-purple-500/50' 
                : 'bg-white border-gray-200 hover:border-primary/50'
            } transition-all duration-300`}
          >
            <CustomCardHeader className="pb-3">
              <div className="flex justify-between">
                <Badge className={getMatchScoreBadge(contract.matchScore)}>
                  <Award className="mr-1 h-3 w-3" />
                  {contract.matchScore}% Match
                </Badge>
                <span className={`font-semibold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  {contract.budget}
                </span>
              </div>
              <CustomCardTitle className="mt-2 text-lg">
                {contract.title}
              </CustomCardTitle>
              <div className={`flex items-center text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                <Building className="mr-1 h-3 w-3" />
                {contract.client}
              </div>
            </CustomCardHeader>
            <CustomCardContent>
              <p className={`text-sm mb-3 line-clamp-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                {contract.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {contract.tags.map((tag, i) => (
                  <Badge 
                    key={i} 
                    variant="outline" 
                    className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : 'border-gray-200'}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <div className={`flex items-center text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                  <Calendar className="mr-1 h-3 w-3" /> 
                  {contract.deadline}
                </div>
                <div className={`flex items-center text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                  <Users className="mr-1 h-3 w-3" /> 
                  Team of {contract.requiredTeamSize}
                </div>
              </div>
              
              <div className="mt-2 flex space-x-2">
                <CustomButton 
                  className="flex-1"
                  size="sm" 
                  onClick={() => handleViewContract(contract.id)}
                >
                  View Details
                </CustomButton>
                <CustomButton 
                  className="flex-1"
                  variant={isDark ? "outline" : "secondary"}
                  size="sm"
                  onClick={() => handleViewContract(`${contract.id}/apply`)}
                >
                  Quick Apply
                </CustomButton>
              </div>
            </CustomCardContent>
          </CustomCard>
        ))}
      </div>
    </div>
  );
};

export default RecommendedContracts;
