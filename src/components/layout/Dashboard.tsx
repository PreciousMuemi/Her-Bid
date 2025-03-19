
import { useEffect, useState } from "react";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/ui/CustomCard";
import { CustomButton } from "@/components/ui/CustomButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Users, Award, TrendingUp, MessageCircleHeart, Star } from "lucide-react";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("Hey girl!");
  const [username, setUsername] = useState("Bestie");
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    // Random greetings for a personal touch
    const greetings = [
      "Hey girl!",
      "Welcome back queen!",
      "Hi gorgeous!",
      "Heyyy bestie!",
      "Yasss, you're here!",
    ];
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);

    // Animation for cards
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-fade-in');
      }, 100 * index);
    });
  }, []);

  return (
    <section className="py-10 bg-[#050A30] min-h-screen text-white">
      <div className="container px-4 md:px-6">
        {/* Greeting Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent mb-2">
            {greeting} <span className="italic">It's {timeOfDay}, {username}!</span> ✨
          </h1>
          <p className="text-[#B2B9E1] max-w-2xl">
            Ready to connect with other girlies and take over the contracting world? Let's make some magic happen! 💫
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
            <CustomCardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Your Bids</CustomCardTitle>
                <TrendingUp className="h-5 w-5 text-pink-300" />
              </div>
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-3xl font-bold text-white">12</div>
              <p className="text-[#8891C5] text-sm mt-1">3 pending approvals</p>
            </CustomCardContent>
          </CustomCard>

          <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
            <CustomCardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Your Squad</CustomCardTitle>
                <Users className="h-5 w-5 text-purple-300" />
              </div>
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-3xl font-bold text-white">8</div>
              <p className="text-[#8891C5] text-sm mt-1">2 collaboration requests</p>
            </CustomCardContent>
          </CustomCard>

          <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
            <CustomCardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Matches</CustomCardTitle>
                <Heart className="h-5 w-5 text-pink-400" />
              </div>
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-3xl font-bold text-white">15</div>
              <p className="text-[#8891C5] text-sm mt-1">5 new this week</p>
            </CustomCardContent>
          </CustomCard>

          <CustomCard className="dashboard-card bg-[#0A155A]/70 border-[#303974] backdrop-blur-sm text-white hover:border-[#4A5BC2] transition-all duration-300 opacity-0">
            <CustomCardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CustomCardTitle className="text-lg font-medium text-[#B2B9E1]">Rep Score</CustomCardTitle>
                <Star className="h-5 w-5 text-yellow-300" />
              </div>
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-3xl font-bold text-white">92%</div>
              <p className="text-[#8891C5] text-sm mt-1">You're killing it!</p>
            </CustomCardContent>
          </CustomCard>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 animate-fade-in animate-delay-300">
          <Tabs defaultValue="opportunities" className="w-full">
            <TabsList className="w-full md:w-auto bg-[#0A155A]/70 border border-[#303974] p-1 mb-6">
              <TabsTrigger 
                value="opportunities" 
                className="data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]"
              >
                Opportunities
              </TabsTrigger>
              <TabsTrigger 
                value="matches" 
                className="data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]"
              >
                Girl Squad
              </TabsTrigger>
              <TabsTrigger 
                value="bids" 
                className="data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]"
              >
                Your Bids
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opportunities" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Opportunity Cards */}
                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-pink-400/20 text-pink-300 hover:bg-pink-400/30 border-none">Perfect Match</Badge>
                      <div className="text-pink-300">$32K-45K</div>
                    </div>
                    <CustomCardTitle className="mt-3 text-xl">Digital Marketing Campaign</CustomCardTitle>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <p className="text-[#B2B9E1] mb-4">Looking for a collaborative team to launch our summer product campaign. Need skills in social media, content creation, and analytics.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Marketing</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Social Media</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Analytics</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-purple-400/20 text-purple-300">JM</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-pink-400/20 text-pink-300">KL</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-indigo-400/20 text-indigo-300">+2</AvatarFallback>
                        </Avatar>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="default" 
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Join Bid
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>

                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-purple-400/20 text-purple-300 hover:bg-purple-400/30 border-none">High Value</Badge>
                      <div className="text-purple-300">$78K-92K</div>
                    </div>
                    <CustomCardTitle className="mt-3 text-xl">Software Development Project</CustomCardTitle>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <p className="text-[#B2B9E1] mb-4">Government agency seeking a diverse team for new internal system. Needs frontend, backend, and project management expertise.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Development</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">UX/UI</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Project Management</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-purple-400/20 text-purple-300">TS</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-pink-400/20 text-pink-300">AW</AvatarFallback>
                        </Avatar>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="default" 
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Join Bid
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>

                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-indigo-400/20 text-indigo-300 hover:bg-indigo-400/30 border-none">New</Badge>
                      <div className="text-indigo-300">$25K-30K</div>
                    </div>
                    <CustomCardTitle className="mt-3 text-xl">Event Planning & Coordination</CustomCardTitle>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <p className="text-[#B2B9E1] mb-4">Corporate client looking for an all-female team to plan their annual conference. Seeking event planners, designers and logistics experts.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Events</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Design</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Logistics</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-indigo-400/20 text-indigo-300">MP</AvatarFallback>
                        </Avatar>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="default" 
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none text-white"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        Join Bid
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>
              </div>
              
              <div className="flex justify-center mt-8">
                <CustomButton 
                  variant="outline" 
                  className="border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A]/50 hover:text-white"
                >
                  Browse More Opportunities
                </CustomButton>
              </div>
            </TabsContent>
            
            <TabsContent value="matches" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Girl Squad Cards */}
                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-pink-400/30">
                        <AvatarFallback className="bg-pink-400/20 text-pink-300">JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <CustomCardTitle className="text-xl">Jamie Davis</CustomCardTitle>
                        <p className="text-[#B2B9E1] text-sm">UI/UX Designer</p>
                      </div>
                    </div>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <p className="text-[#B2B9E1] mb-4">8 years of experience in designing intuitive interfaces for government and corporate clients.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-pink-400/30 text-pink-300">UI/UX</Badge>
                      <Badge variant="outline" className="border-pink-400/30 text-pink-300">Figma</Badge>
                      <Badge variant="outline" className="border-pink-400/30 text-pink-300">Prototyping</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-300" />
                        <span className="text-sm text-[#B2B9E1]">95% match</span>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="outline" 
                        className="border-pink-400/30 text-pink-300 hover:bg-pink-400/10"
                      >
                        <MessageCircleHeart className="h-4 w-4 mr-1" />
                        Connect
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>

                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-purple-400/30">
                        <AvatarFallback className="bg-purple-400/20 text-purple-300">SP</AvatarFallback>
                      </Avatar>
                      <div>
                        <CustomCardTitle className="text-xl">Sarah Patel</CustomCardTitle>
                        <p className="text-[#B2B9E1] text-sm">Project Manager</p>
                      </div>
                    </div>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <p className="text-[#B2B9E1] mb-4">PMP certified with 6 years experience managing tech and marketing projects for Fortune 500 companies.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-purple-400/30 text-purple-300">PM</Badge>
                      <Badge variant="outline" className="border-purple-400/30 text-purple-300">Agile</Badge>
                      <Badge variant="outline" className="border-purple-400/30 text-purple-300">Marketing</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-300" />
                        <span className="text-sm text-[#B2B9E1]">88% match</span>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="outline" 
                        className="border-purple-400/30 text-purple-300 hover:bg-purple-400/10"
                      >
                        <MessageCircleHeart className="h-4 w-4 mr-1" />
                        Connect
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>

                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-2 border-indigo-400/30">
                        <AvatarFallback className="bg-indigo-400/20 text-indigo-300">MT</AvatarFallback>
                      </Avatar>
                      <div>
                        <CustomCardTitle className="text-xl">Maya Thompson</CustomCardTitle>
                        <p className="text-[#B2B9E1] text-sm">Software Developer</p>
                      </div>
                    </div>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <p className="text-[#B2B9E1] mb-4">Full-stack developer specializing in React, Node.js and cloud infrastructure. 5 years of experience.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-indigo-400/30 text-indigo-300">React</Badge>
                      <Badge variant="outline" className="border-indigo-400/30 text-indigo-300">Node.js</Badge>
                      <Badge variant="outline" className="border-indigo-400/30 text-indigo-300">AWS</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-300" />
                        <span className="text-sm text-[#B2B9E1]">92% match</span>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="outline" 
                        className="border-indigo-400/30 text-indigo-300 hover:bg-indigo-400/10"
                      >
                        <MessageCircleHeart className="h-4 w-4 mr-1" />
                        Connect
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>
              </div>
              
              <div className="flex justify-center mt-8">
                <CustomButton 
                  variant="outline" 
                  className="border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A]/50 hover:text-white"
                >
                  Find More Collaborators
                </CustomButton>
              </div>
            </TabsContent>
            
            <TabsContent value="bids" className="mt-0">
              <div className="space-y-6">
                {/* Bids */}
                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-green-400/20 text-green-300 hover:bg-green-400/30 border-none mb-2">Active</Badge>
                        <CustomCardTitle className="text-xl">Government Outreach Program</CustomCardTitle>
                        <p className="text-[#B2B9E1] text-sm mt-1">Submitted on May 3, 2023</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">$67,500</div>
                        <p className="text-[#B2B9E1] text-sm">Your share: $15,000</p>
                      </div>
                    </div>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">UI/UX</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Development</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Marketing</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-purple-400/20 text-purple-300">You</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-pink-400/20 text-pink-300">JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-indigo-400/20 text-indigo-300">SP</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-green-400/20 text-green-300">MT</AvatarFallback>
                        </Avatar>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="outline" 
                        className="border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A] hover:text-white"
                      >
                        View Details
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>

                <CustomCard className="dashboard-card bg-gradient-to-br from-[#0A155A]/90 to-[#16216e]/90 backdrop-blur-sm border-[#303974] text-white hover:shadow-[0_0_15px_rgba(74,91,194,0.3)] transition-all duration-300 opacity-0">
                  <CustomCardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 border-none mb-2">Under Review</Badge>
                        <CustomCardTitle className="text-xl">Corporate Rebranding Project</CustomCardTitle>
                        <p className="text-[#B2B9E1] text-sm mt-1">Submitted on June 12, 2023</p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">$42,000</div>
                        <p className="text-[#B2B9E1] text-sm">Your share: $12,000</p>
                      </div>
                    </div>
                  </CustomCardHeader>
                  <CustomCardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Branding</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Design</Badge>
                      <Badge variant="outline" className="border-[#4A5BC2] text-[#B2B9E1]">Marketing</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex -space-x-2">
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-purple-400/20 text-purple-300">You</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-pink-400/20 text-pink-300">JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="border-2 border-[#050A30] h-8 w-8">
                          <AvatarFallback className="bg-indigo-400/20 text-indigo-300">SP</AvatarFallback>
                        </Avatar>
                      </div>
                      <CustomButton 
                        size="sm" 
                        variant="outline" 
                        className="border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A] hover:text-white"
                      >
                        View Details
                      </CustomButton>
                    </div>
                  </CustomCardContent>
                </CustomCard>
              </div>
              
              <div className="flex justify-center mt-8">
                <CustomButton 
                  variant="outline" 
                  className="border-[#4A5BC2] text-[#B2B9E1] hover:bg-[#0A155A]/50 hover:text-white"
                >
                  View All Your Bids
                </CustomButton>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
