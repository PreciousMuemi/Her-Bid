
import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { BadgeCheck, Eye, Award, User, Upload, Shield } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/ui/CustomCard';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const SkillVerification = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('verification');
  
  const handleUploadSample = () => {
    toast.success("Sample work uploaded successfully for review.");
  };
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Blind Skill Verification
        </h1>
        <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
          Build credibility with anonymous work samples evaluated by industry experts
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
                <Upload className={`h-8 w-8 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Submit Work
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Anonymously submit your work samples or portfolio pieces for review
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-pink-400/20' : 'bg-pink-100'
              }`}>
                <Eye className={`h-8 w-8 ${isDark ? 'text-pink-300' : 'text-pink-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Expert Evaluation
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Industry experts review your work based on quality and skills, not who you are
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-green-400/20' : 'bg-green-100'
              }`}>
                <Award className={`h-8 w-8 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Build Reputation
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Earn verified credentials that prove your expertise to clients and partners
              </p>
            </div>
          </div>
        </CustomCardContent>
      </CustomCard>
      
      {/* Tabs */}
      <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className={`w-full md:w-auto mb-6 ${
          isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-gray-100 border border-gray-200'
        }`}>
          <TabsTrigger 
            value="verification" 
            className={`${
              isDark 
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-primary'
            }`}
          >
            Skill Verification
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio" 
            className={`${
              isDark 
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-primary'
            }`}
          >
            Your Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="reputation" 
            className={`${
              isDark 
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-primary'
            }`}
          >
            Reputation Score
          </TabsTrigger>
        </TabsList>

        {/* Skill Verification Content */}
        <TabsContent value="verification" className="mt-0">
          <div className="space-y-6">
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
              <CustomCardHeader>
                <CustomCardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                  Submit Work for Verification
                </CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-md ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-[#0A155A]' : 'bg-gray-100'
                      }`}>
                        <Upload className={`h-8 w-8 ${isDark ? 'text-pink-300' : 'text-primary'}`} />
                      </div>
                    </div>
                    <h3 className={`text-center text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Upload Work Sample
                    </h3>
                    <p className={`text-center text-sm mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Submit your work sample for blind review by industry experts
                    </p>
                    <div className="flex justify-center">
                      <CustomButton onClick={handleUploadSample}
                        className={isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' : ''}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Work Sample
                      </CustomButton>
                    </div>
                  </div>
                  
                  <div className={`p-6 rounded-md ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isDark ? 'bg-[#0A155A]' : 'bg-gray-100'
                      }`}>
                        <Shield className={`h-8 w-8 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
                      </div>
                    </div>
                    <h3 className={`text-center text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      How We Protect You
                    </h3>
                    <ul className={`space-y-2 text-sm mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      <li className="flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>All submissions are anonymous - no personal info is shared</span>
                      </li>
                      <li className="flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Evaluators are matched to your skill category</span>
                      </li>
                      <li className="flex items-center">
                        <BadgeCheck className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Your work cannot be saved or downloaded by reviewers</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Your Pending Verifications
                  </h3>
                  
                  <div className={`p-4 rounded-md mb-4 ${isDark ? 'bg-[#0A155A]/50' : 'bg-white border border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row justify-between mb-2">
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Website Prototype Design
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                            UI/UX
                          </Badge>
                          <Badge className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                            Design
                          </Badge>
                        </div>
                      </div>
                      <Badge className={isDark ? 'bg-blue-400/20 text-blue-300 h-fit' : 'bg-blue-100 text-blue-800 h-fit'}>
                        In Review
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Review Progress</span>
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>2 of 3 Reviews Complete</span>
                      </div>
                      <Progress value={66} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${isDark ? 'bg-[#0A155A]/50' : 'bg-white border border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row justify-between mb-2">
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Database Architecture Document
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                            Database
                          </Badge>
                          <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-800'}>
                            Architecture
                          </Badge>
                        </div>
                      </div>
                      <Badge className={isDark ? 'bg-blue-400/20 text-blue-300 h-fit' : 'bg-blue-100 text-blue-800 h-fit'}>
                        In Review
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Review Progress</span>
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>1 of 3 Reviews Complete</span>
                      </div>
                      <Progress value={33} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
        </TabsContent>

        {/* Portfolio Content */}
        <TabsContent value="portfolio" className="mt-0">
          <div className="space-y-6">
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
              <CustomCardHeader>
                <CustomCardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                  Your Verified Portfolio
                </CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-md ${isDark ? 'bg-[#0A155A]/50' : 'bg-white border border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          E-commerce Website Redesign
                        </h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          Complete redesign of an e-commerce platform with improved user flow and conversion rate.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                            UI/UX
                          </Badge>
                          <Badge className={isDark ? 'bg-pink-400/20 text-pink-300' : 'bg-pink-100 text-pink-800'}>
                            Web Design
                          </Badge>
                        </div>
                      </div>
                      <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-800'}>
                        Verified
                      </Badge>
                    </div>
                    <div className={`mt-4 p-3 rounded-md text-sm ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className={`h-4 w-4 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Expert Rating: 4.9/5.0
                        </span>
                      </div>
                      <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        "Exceptional design work with clear understanding of user behavior and conversion principles."
                      </p>
                    </div>
                  </div>
                  
                  <div className={`p-6 rounded-md ${isDark ? 'bg-[#0A155A]/50' : 'bg-white border border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Government Portal Development
                        </h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          Development of a secure, accessible government services portal with user authentication.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-800'}>
                            React
                          </Badge>
                          <Badge className={isDark ? 'bg-indigo-400/20 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}>
                            Node.js
                          </Badge>
                          <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-800'}>
                            Security
                          </Badge>
                        </div>
                      </div>
                      <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-800'}>
                        Verified
                      </Badge>
                    </div>
                    <div className={`mt-4 p-3 rounded-md text-sm ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className={`h-4 w-4 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Expert Rating: 4.8/5.0
                        </span>
                      </div>
                      <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
                        "Well-structured codebase with excellent security practices and accessibility considerations."
                      </p>
                    </div>
                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
        </TabsContent>

        {/* Reputation Content */}
        <TabsContent value="reputation" className="mt-0">
          <div className="space-y-6">
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
              <CustomCardContent className="p-6">
                <div className="flex flex-col items-center mb-8">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-4 ${
                    isDark ? 'bg-[#182052]' : 'bg-gray-50'
                  }`}>
                    <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      92
                    </div>
                  </div>
                  <h3 className={`text-xl font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Your Reputation Score
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    Based on verified skills, project completions, and expert reviews
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className={`p-4 rounded-md text-center ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      12
                    </div>
                    <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Completed Projects
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md text-center ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      8
                    </div>
                    <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Verified Skills
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md text-center ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      4.9
                    </div>
                    <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Average Rating
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className={`font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Reputation Breakdown
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Technical Skills</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>95%</span>
                      </div>
                      <Progress value={95} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Project Management</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>88%</span>
                      </div>
                      <Progress value={88} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Client Satisfaction</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>97%</span>
                      </div>
                      <Progress value={97} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>Communication</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>92%</span>
                      </div>
                      <Progress value={92} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillVerification;
