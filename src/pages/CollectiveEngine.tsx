
import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { Users, UserPlus, FileSearch, CheckCircle } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/ui/CustomCard';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const CollectiveEngine = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('collectives');
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Collective Bidding Engine
        </h1>
        <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
          Form verified legal consortiums with women entrepreneurs to bid on large contracts together.
        </p>
      </div>
      
      {/* How It Works */}
      <CustomCard className={`mb-8 ${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
        <CustomCardHeader>
          <CustomCardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
            How It Works
          </CustomCardTitle>
        </CustomCardHeader>
        <CustomCardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-purple-400/20' : 'bg-purple-100'
              }`}>
                <Users className={`h-8 w-8 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Find Partners
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Connect with other women entrepreneurs with skills that complement yours
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-pink-400/20' : 'bg-pink-100'
              }`}>
                <UserPlus className={`h-8 w-8 ${isDark ? 'text-pink-300' : 'text-pink-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create Consortium
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Form a legal team with clear roles, responsibilities and payment terms
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-blue-400/20' : 'bg-blue-100'
              }`}>
                <FileSearch className={`h-8 w-8 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Bid Together
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Apply for contracts together with automated proposal generation
              </p>
            </div>
          </div>
        </CustomCardContent>
      </CustomCard>
      
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <CustomButton 
          variant={activeTab === 'collectives' ? 'default' : 'outline'}
          className={
            activeTab !== 'collectives' && isDark 
              ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#182052]' 
              : ''
          }
          onClick={() => setActiveTab('collectives')}
        >
          Your Collectives
        </CustomButton>
        
        <CustomButton 
          variant={activeTab === 'partners' ? 'default' : 'outline'}
          className={
            activeTab !== 'partners' && isDark 
              ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#182052]' 
              : ''
          }
          onClick={() => setActiveTab('partners')}
        >
          Find Partners
        </CustomButton>
        
        <CustomButton 
          variant={activeTab === 'invitations' ? 'default' : 'outline'}
          className={
            activeTab !== 'invitations' && isDark 
              ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#182052]' 
              : ''
          }
          onClick={() => setActiveTab('invitations')}
        >
          Invitations
        </CustomButton>
      </div>
      
      {/* Your Collectives Tab Content */}
      {activeTab === 'collectives' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Active Collectives
            </h2>
            <CustomButton 
              className={isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' : ''}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create New Collective
            </CustomButton>
          </div>
          
          {/* Collective Cards */}
          <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974] hover:border-purple-500/30' : 'bg-white border-gray-200 hover:border-purple-300/50'} transition-all duration-300`}>
            <CustomCardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                        You
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-indigo-400/20 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}>
                        SP
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                        MT
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Digital Innovators Collective
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Web Development
                      </Badge>
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        UI/UX Design
                      </Badge>
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Marketing
                      </Badge>
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Project Management
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={isDark ? 'bg-green-400/20 text-green-300 hover:bg-green-400/30' : 'bg-green-100 text-green-700'}>
                    Active
                  </Badge>
                  <CustomButton size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    View Details
                  </CustomButton>
                </div>
              </div>
              
              <div className={`mt-4 p-3 rounded-md text-sm ${isDark ? 'bg-[#182052] text-[#B2B9E1]' : 'bg-gray-50 text-gray-600'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Bid:</span>
                  <span className="font-medium">Health Department Web Portal Redesign</span>
                  <span className={isDark ? 'text-green-300' : 'text-green-600'}>$86,000</span>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>
          
          <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974] hover:border-purple-500/30' : 'bg-white border-gray-200 hover:border-purple-300/50'} transition-all duration-300`}>
            <CustomCardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                        You
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                        EC
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-indigo-400/20 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}>
                        BL
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="border-2 border-background h-10 w-10">
                      <AvatarFallback className={isDark ? 'bg-gray-400/20 text-gray-300' : 'bg-gray-100 text-gray-800'}>
                        +2
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Green Infrastructure Solutions
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Project Management
                      </Badge>
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Civil Engineering
                      </Badge>
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Environmental Science
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={isDark ? 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30' : 'bg-yellow-100 text-yellow-700'}>
                    Pending Review
                  </Badge>
                  <CustomButton size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    View Details
                  </CustomButton>
                </div>
              </div>
              
              <div className={`mt-4 p-3 rounded-md text-sm ${isDark ? 'bg-[#182052] text-[#B2B9E1]' : 'bg-gray-50 text-gray-600'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Bid:</span>
                  <span className="font-medium">Municipal Water Conservation System</span>
                  <span className={isDark ? 'text-yellow-300' : 'text-yellow-600'}>$175,000</span>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>
      )}
      
      {/* Find Partners Tab Content */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Find Partners Based on Your Skills
            </h2>
            <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
              We'll suggest partners with complementary skills to help you form a strong collective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974] hover:border-purple-500/30' : 'bg-white border-gray-200 hover:border-purple-300/50'} transition-all duration-300`}>
              <CustomCardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarFallback className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Jamie Davis
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      UI/UX Designer with 8 years experience
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Skills Match</span>
                    <span className={isDark ? 'text-green-300' : 'text-green-600'}>95% Compatible</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#182052]' : 'bg-gray-200'}`}>
                    <div className={`h-full ${isDark ? 'bg-green-400' : 'bg-green-500'}`} style={{width: '95%'}}></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                    UI/UX
                  </Badge>
                  <Badge className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                    Figma
                  </Badge>
                  <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                    Design Systems
                  </Badge>
                </div>
                
                <div className="flex justify-end">
                  <CustomButton size="sm">
                    Invite to Collaborate
                  </CustomButton>
                </div>
              </CustomCardContent>
            </CustomCard>
            
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974] hover:border-purple-500/30' : 'bg-white border-gray-200 hover:border-purple-300/50'} transition-all duration-300`}>
              <CustomCardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarFallback className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                      SP
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Sarah Patel
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      Project Manager with 6 years experience
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Skills Match</span>
                    <span className={isDark ? 'text-green-300' : 'text-green-600'}>87% Compatible</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#182052]' : 'bg-gray-200'}`}>
                    <div className={`h-full ${isDark ? 'bg-green-400' : 'bg-green-500'}`} style={{width: '87%'}}></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                    Project Management
                  </Badge>
                  <Badge className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                    Agile
                  </Badge>
                  <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                    SCRUM
                  </Badge>
                </div>
                
                <div className="flex justify-end">
                  <CustomButton size="sm">
                    Invite to Collaborate
                  </CustomButton>
                </div>
              </CustomCardContent>
            </CustomCard>
            
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974] hover:border-purple-500/30' : 'bg-white border-gray-200 hover:border-purple-300/50'} transition-all duration-300`}>
              <CustomCardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarFallback className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                      MT
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Maya Thompson
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      Developer with 5 years experience
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Skills Match</span>
                    <span className={isDark ? 'text-green-300' : 'text-green-600'}>92% Compatible</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-[#182052]' : 'bg-gray-200'}`}>
                    <div className={`h-full ${isDark ? 'bg-green-400' : 'bg-green-500'}`} style={{width: '92%'}}></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                    React
                  </Badge>
                  <Badge className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                    Node.js
                  </Badge>
                  <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                    Cloud Services
                  </Badge>
                </div>
                
                <div className="flex justify-end">
                  <CustomButton size="sm">
                    Invite to Collaborate
                  </CustomButton>
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
        </div>
      )}
      
      {/* Invitations Tab Content */}
      {activeTab === 'invitations' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Your Invitations
            </h2>
            <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
              Review and respond to invitations from other entrepreneurs.
            </p>
          </div>
          
          <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
            <CustomCardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background">
                    <AvatarFallback className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                      LK
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Lisa Khan invites you to join <span className="font-bold">Tech Solutions Hub</span>
                    </h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                      For proposal: National Healthcare IT Upgrade tender
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Healthcare
                      </Badge>
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        IT Infrastructure
                      </Badge>
                      <Badge variant="outline" className={isDark ? 'border-[#303974] text-[#B2B9E1]' : ''}>
                        Database Design
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <CustomButton size="sm" variant="outline" 
                    className={isDark ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#182052]' : ''}>
                    Decline
                  </CustomButton>
                  <CustomButton size="sm" 
                    className={isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' : ''}>
                    Accept
                  </CustomButton>
                </div>
              </div>
            </CustomCardContent>
          </CustomCard>
        </div>
      )}
    </div>
  );
};

export default CollectiveEngine;
