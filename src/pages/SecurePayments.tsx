
import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { ShieldCheck, BadgeCheck, Clock, Calendar, DollarSign, LockKeyhole } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/ui/CustomCard';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SecurePayments = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('milestones');
  
  const handleReleasePayment = () => {
    toast.success("Payment request submitted! The client will be notified.");
  };
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Secure Payment Protection
        </h1>
        <p className={isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}>
          Get paid securely with milestone-based payments held in escrow until work is complete
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
                <ShieldCheck className={`h-8 w-8 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Secure Funds
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Client funds are securely stored before work begins so you know payment is guaranteed
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-pink-400/20' : 'bg-pink-100'
              }`}>
                <BadgeCheck className={`h-8 w-8 ${isDark ? 'text-pink-300' : 'text-pink-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Complete Milestones
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Each project is broken into clear milestones that you complete one at a time
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-green-400/20' : 'bg-green-100'
              }`}>
                <DollarSign className={`h-8 w-8 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Get Paid Automatically
              </h3>
              <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                Once work is verified, payment is released directly to your account without delays
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
            value="milestones" 
            className={`${
              isDark 
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-primary'
            }`}
          >
            Current Milestones
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className={`${
              isDark 
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-primary'
            }`}
          >
            Payment History
          </TabsTrigger>
          <TabsTrigger 
            value="escrow" 
            className={`${
              isDark 
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-primary'
            }`}
          >
            Create New Escrow
          </TabsTrigger>
        </TabsList>

        {/* Current Milestones Content */}
        <TabsContent value="milestones" className="mt-0">
          <div className="space-y-6">
            {/* Project 1 */}
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
              <CustomCardHeader>
                <div className="flex justify-between">
                  <CustomCardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                    Health Department Web Portal Redesign
                  </CustomCardTitle>
                  <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'}>
                    Active
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-2 text-sm">
                  <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Due: May 15, 2025
                  </div>
                  <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Total Value: $86,000
                  </div>
                </div>
              </CustomCardHeader>
              <CustomCardContent>
                <div className="space-y-6">
                  {/* Milestone 1 */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`md:w-8 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'
                    }`}>
                      1
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            UX Research & Wireframes
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            Completed on April 15, 2025
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            $22,000
                          </p>
                          <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                            Paid
                          </p>
                        </div>
                      </div>
                      <Progress value={100} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                  </div>
                  
                  {/* Milestone 2 */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`md:w-8 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      2
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Visual Design & Prototype
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            In Progress - Due April 30, 2025
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            $25,000
                          </p>
                          <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                            In Escrow
                          </p>
                        </div>
                      </div>
                      <Progress value={65} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                      <div className="flex justify-end mt-2">
                        <CustomButton size="sm" onClick={handleReleasePayment}>
                          <BadgeCheck className="h-4 w-4 mr-1" />
                          Mark Complete
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                  
                  {/* Milestone 3 */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`md:w-8 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-gray-400/20 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      3
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Development & Testing
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            Not Started - Due May 15, 2025
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            $39,000
                          </p>
                          <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                            Pending
                          </p>
                        </div>
                      </div>
                      <Progress value={0} className={isDark ? 'bg-[#182052]' : 'bg-gray-200'} />
                    </div>
                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>
            
            {/* Project 2 */}
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
              <CustomCardHeader>
                <div className="flex justify-between">
                  <CustomCardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                    Smart City Infrastructure Project
                  </CustomCardTitle>
                  <Badge className={isDark ? 'bg-yellow-400/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}>
                    Pending Review
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-2 text-sm">
                  <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Due: April 30, 2025
                  </div>
                  <div className={`flex items-center ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Total Value: $235,000
                  </div>
                </div>
              </CustomCardHeader>
              <CustomCardContent>
                <div className={`p-4 rounded-md ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <Clock className={`h-5 w-5 mr-2 ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`} />
                    <span className={`${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Awaiting client approval. Escrow creation pending.
                    </span>
                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
        </TabsContent>

        {/* Payment History Content */}
        <TabsContent value="payments" className="mt-0">
          <div className="space-y-6">
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
              <CustomCardHeader>
                <CustomCardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                  Your Payment History
                </CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-md ${isDark ? 'bg-[#0A155A]/50' : 'bg-white border border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          UX Research & Wireframes
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          Health Department Web Portal Redesign
                        </p>
                      </div>
                      <div className="md:text-right mt-2 md:mt-0">
                        <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                          $22,000
                        </p>
                        <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          Received April 15, 2025
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${isDark ? 'bg-[#0A155A]/50' : 'bg-white border border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Database Architecture
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          County Records Management System
                        </p>
                      </div>
                      <div className="md:text-right mt-2 md:mt-0">
                        <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                          $18,500
                        </p>
                        <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          Received March 22, 2025
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${isDark ? 'bg-[#0A155A]/50' : 'bg-white border border-gray-200'}`}>
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Final Development
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          Municipal Library Management System 
                        </p>
                      </div>
                      <div className="md:text-right mt-2 md:mt-0">
                        <p className={`font-medium ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                          $45,000
                        </p>
                        <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                          Received February 28, 2025
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
        </TabsContent>

        {/* Create Escrow Content */}
        <TabsContent value="escrow" className="mt-0">
          <div className="space-y-6">
            <CustomCard className={`${isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white'}`}>
              <CustomCardHeader>
                <CustomCardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                  Create New Escrow Payment
                </CustomCardTitle>
              </CustomCardHeader>
              <CustomCardContent>
                <div className={`p-6 rounded-md ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-center mb-6">
                    <LockKeyhole className={`h-12 w-12 ${isDark ? 'text-pink-300' : 'text-primary'}`} />
                  </div>
                  <p className={`text-center mb-6 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                    With HerBid's secure escrow system, your payment is safely held until work is complete. 
                    Create a new escrow payment for a project by providing details below.
                  </p>
                  <div className="flex justify-center">
                    <CustomButton 
                      className={isDark ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' : ''}
                      onClick={() => navigate('/manage-escrow')}
                    >
                      <ShieldCheck className="h-5 w-5 mr-2" />
                      Set Up Escrow Payment
                    </CustomButton>
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

export default SecurePayments;
