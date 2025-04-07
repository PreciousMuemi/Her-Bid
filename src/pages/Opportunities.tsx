
import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { Search, Filter, Calendar, DollarSign, ChevronRight, Heart, Star, Clock, Sparkles } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/ui/CustomCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

const Opportunities = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleViewContract = (id: number) => {
    navigate(`/contracts/${id}`);
  };
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Find Opportunities
        </h1>
        <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
          Browse contracts that match your skills and business capacity
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className={`p-6 mb-8 rounded-lg ${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white border border-gray-200'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search for contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white placeholder:text-[#8891C5]' 
                  : 'bg-white border-gray-200'
              }`}
            />
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-[#8891C5]' : 'text-gray-400'}`} />
          </div>
          <CustomButton 
            variant="outline"
            className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}
          >
            <Filter className="h-4 w-4 mr-2" /> Filter
          </CustomButton>
        </div>
      </div>
      
      {/* Recommended Opportunities Section */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Sparkles className="inline mr-2 h-5 w-5 text-pink-500" />
          Recommended For You
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Opportunity Card 1 */}
          <CustomCard className={`${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 border-[#303974] hover:shadow-[0_0_15px_rgba(74,91,194,0.3)]' 
              : 'bg-white border-gray-200 hover:shadow-md'
          } transition-all duration-300`}>
            <CustomCardHeader>
              <div className="flex justify-between">
                <Badge className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                  Perfect Match
                </Badge>
                <div className={isDark ? 'text-pink-300' : 'text-pink-600 font-medium'}>
                  $120K - $150K
                </div>
              </div>
              <CustomCardTitle className={`mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Smart Traffic Management System
              </CustomCardTitle>
            </CustomCardHeader>
            <CustomCardContent>
              <p className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Government agency seeking a diverse team to implement a city-wide smart traffic management solution. Includes IoT sensors, data analysis, and dashboard development.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                  IoT Development
                </Badge>
                <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                  Data Analytics
                </Badge>
                <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                  UI Development
                </Badge>
              </div>
              
              <div className="flex flex-wrap justify-between text-sm mb-2">
                <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Deadline: May 30, 2025
                </div>
                <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <Clock className="h-4 w-4 mr-1" />
                  8-month project
                </div>
                <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <Heart className="h-4 w-4 mr-1" />
                  15 interested
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Skills Match</span>
                  <span className={isDark ? 'text-green-300' : 'text-green-600'}>
                    <Star className="h-4 w-4 inline mb-1" /> 93% Compatible
                  </span>
                </div>
                <Progress value={93} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
              </div>
              
              <div className="flex justify-between items-center">
                <CustomButton 
                  variant="outline" 
                  size="sm"
                  className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}
                  onClick={() => handleViewContract(1)}
                >
                  View Details <ChevronRight className="h-4 w-4 ml-1" />
                </CustomButton>
                
                <CustomButton 
                  size="sm"
                  className={isDark 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                    : ''}
                >
                  Apply Now
                </CustomButton>
              </div>
            </CustomCardContent>
          </CustomCard>
          
          {/* Opportunity Card 2 */}
          <CustomCard className={`${
            isDark 
              ? 'bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 border-[#303974] hover:shadow-[0_0_15px_rgba(74,91,194,0.3)]' 
              : 'bg-white border-gray-200 hover:shadow-md'
          } transition-all duration-300`}>
            <CustomCardHeader>
              <div className="flex justify-between">
                <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                  High Match
                </Badge>
                <div className={isDark ? 'text-purple-300' : 'text-purple-600 font-medium'}>
                  $90K - $110K
                </div>
              </div>
              <CustomCardTitle className={`mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Enterprise Content Management System
              </CustomCardTitle>
            </CustomCardHeader>
            <CustomCardContent>
              <p className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Corporate client looking for team to build a custom content management system with advanced permissions, workflows and multilingual support.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                  Backend Development
                </Badge>
                <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                  Frontend
                </Badge>
                <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                  UI/UX Design
                </Badge>
              </div>
              
              <div className="flex flex-wrap justify-between text-sm mb-2">
                <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Deadline: June 15, 2025
                </div>
                <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <Clock className="h-4 w-4 mr-1" />
                  6-month project
                </div>
                <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  <Heart className="h-4 w-4 mr-1" />
                  8 interested
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Skills Match</span>
                  <span className={isDark ? 'text-green-300' : 'text-green-600'}>
                    <Star className="h-4 w-4 inline mb-1" /> 87% Compatible
                  </span>
                </div>
                <Progress value={87} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
              </div>
              
              <div className="flex justify-between items-center">
                <CustomButton 
                  variant="outline" 
                  size="sm"
                  className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}
                  onClick={() => handleViewContract(2)}
                >
                  View Details <ChevronRight className="h-4 w-4 ml-1" />
                </CustomButton>
                
                <CustomButton 
                  size="sm"
                  className={isDark 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                    : ''}
                >
                  Apply Now
                </CustomButton>
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>
      </div>
      
      {/* All Opportunities Section */}
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          All Available Contracts
        </h2>
        
        <div className="space-y-6">
          {/* Contract Card 1 */}
          <CustomCard className={`${
            isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'
          }`}>
            <CustomCardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Digital Marketing Campaign
                    </h3>
                    <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'}>
                      New
                    </Badge>
                  </div>
                  
                  <p className={`mb-3 text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    Looking for a collaborative team to launch our summer product campaign with social media, content creation and analytics.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      Marketing
                    </Badge>
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      Content Creation
                    </Badge>
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      Analytics
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      $32K - $45K
                    </div>
                    <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: July 1, 2025
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-end">
                    <span className={`text-xs mr-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Match:
                    </span>
                    <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                      75% Compatible
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <CustomButton 
                      variant="outline" 
                      size="sm"
                      className={`text-xs ${isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}`}
                    >
                      Details
                    </CustomButton>
                    <CustomButton 
                      size="sm"
                      className={`text-xs ${isDark 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                        : ''}`}
                    >
                      Apply
                    </CustomButton>
                  </div>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>
          
          {/* Contract Card 2 */}
          <CustomCard className={`${
            isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'
          }`}>
            <CustomCardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Healthcare Mobile Application
                    </h3>
                    <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'}>
                      New
                    </Badge>
                  </div>
                  
                  <p className={`mb-3 text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    Development of a mobile application for healthcare providers to track patient appointments and medical records.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      Mobile Development
                    </Badge>
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      Healthcare
                    </Badge>
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      UI/UX
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      $75K - $95K
                    </div>
                    <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: August 15, 2025
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-end">
                    <span className={`text-xs mr-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Match:
                    </span>
                    <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                      82% Compatible
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <CustomButton 
                      variant="outline" 
                      size="sm"
                      className={`text-xs ${isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}`}
                    >
                      Details
                    </CustomButton>
                    <CustomButton 
                      size="sm"
                      className={`text-xs ${isDark 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                        : ''}`}
                    >
                      Apply
                    </CustomButton>
                  </div>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>
          
          {/* Contract Card 3 */}
          <CustomCard className={`${
            isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'
          }`}>
            <CustomCardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Educational Platform Redesign
                    </h3>
                  </div>
                  
                  <p className={`mb-3 text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    Redesign of an educational platform to improve user experience, accessibility and engagement for K-12 students.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      Education
                    </Badge>
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      UI/UX
                    </Badge>
                    <Badge variant="outline" className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                      Web Development
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      $55K - $70K
                    </div>
                    <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      Due: July 30, 2025
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-end">
                    <span className={`text-xs mr-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Match:
                    </span>
                    <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                      79% Compatible
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <CustomButton 
                      variant="outline" 
                      size="sm"
                      className={`text-xs ${isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}`}
                    >
                      Details
                    </CustomButton>
                    <CustomButton 
                      size="sm"
                      className={`text-xs ${isDark 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                        : ''}`}
                    >
                      Apply
                    </CustomButton>
                  </div>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>
        
        <div className="flex justify-center mt-8">
          <CustomButton 
            variant="outline"
            className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}
          >
            Load More
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
