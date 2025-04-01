
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { useHedera } from '@/contexts/HederaContext';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomButton } from '@/components/ui/CustomButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, User, Award, Briefcase, Star, Plus, UploadCloud, Trash2, CheckCircle2, Edit, FileText, Users, BarChart3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// Sample industries and skills for dropdowns
const INDUSTRIES = [
  'Technology', 'Marketing', 'Finance', 'Healthcare', 'Education', 
  'Real Estate', 'Retail', 'Manufacturing', 'Consulting', 'Design'
];

const SKILLS = [
  'Project Management', 'Web Development', 'UI/UX Design', 'Digital Marketing',
  'Content Creation', 'Social Media', 'Financial Analysis', 'Event Planning',
  'Data Analysis', 'Graphic Design', 'Sales', 'Customer Service',
  'Software Development', 'Logistics', 'Product Management'
];

const ProfilePage = () => {
  const { theme } = useThemeStore();
  const { isConnected, accountId } = useHedera();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [profileCompletion, setProfileCompletion] = useState(30);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('profile');
  
  const form = useForm({
    defaultValues: {
      businessName: '',
      ownerName: '',
      email: '',
      phone: '',
      industry: '',
      description: '',
      website: '',
      certifications: '',
      yearFounded: '',
      teamSize: '',
    }
  });
  
  // Load user profile if available
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        form.reset(profile);
        if (profile.skills) {
          setSelectedSkills(profile.skills.split(','));
        }
        calculateProfileCompletion(profile);
      } catch (e) {
        console.error("Error parsing stored profile", e);
      }
    }
    
    // Check auth status
    if (!isConnected) {
      toast.error("Please connect your wallet to access your profile");
      navigate("/auth");
    }
  }, [form, navigate, isConnected]);
  
  const calculateProfileCompletion = (profile: any) => {
    const totalFields = 10;
    let filledFields = 0;
    
    Object.keys(profile).forEach(key => {
      if (profile[key] && profile[key].trim() !== '') {
        filledFields++;
      }
    });
    
    if (selectedSkills.length > 0) filledFields++;
    
    const completion = Math.floor((filledFields / totalFields) * 100);
    setProfileCompletion(completion);
  };
  
  const handleSkillAdd = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  const handleSkillRemove = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };
  
  const onSubmit = (data: any) => {
    // Add skills to the data
    const updatedData = {
      ...data,
      skills: selectedSkills.join(',')
    };
    
    // Save to localStorage for demo purposes
    localStorage.setItem('userProfile', JSON.stringify(updatedData));
    calculateProfileCompletion(updatedData);
    
    toast.success("Profile updated successfully");
  };
  
  // Sample portfolio projects
  const portfolioProjects = [
    {
      id: 1,
      title: "Website Redesign",
      client: "Local Retail Store",
      description: "Complete website redesign with focus on mobile responsiveness and customer engagement.",
      skills: ["Web Development", "UI/UX Design", "Content Creation"],
      year: 2023
    },
    {
      id: 2,
      title: "Marketing Campaign",
      client: "Healthcare Provider",
      description: "Developed and executed a comprehensive marketing strategy that increased patient inquiries by 35%.",
      skills: ["Digital Marketing", "Social Media", "Content Creation"],
      year: 2022
    }
  ];
  
  // Sample connections/partners
  const connections = [
    {
      id: 1,
      name: "Sarah Johnson",
      business: "Johnson Design Studios",
      industry: "Design",
      matchScore: 92
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      business: "Rodriguez Marketing Group",
      industry: "Marketing",
      matchScore: 88
    },
    {
      id: 3,
      name: "Latisha Williams",
      business: "Williams Tech Solutions",
      industry: "Technology",
      matchScore: 85
    }
  ];
  
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent' : 'text-gray-900'} mb-2`}>
            Your Profile
          </h1>
          <p className={`${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'} max-w-2xl`}>
            Complete your profile to increase your visibility and match with the right opportunities.
          </p>
        </div>
        
        <div className={`flex flex-col p-4 rounded-lg ${
          isDark ? 'bg-[#0A155A]/70 border-[#303974]' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>Profile Completion</span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{profileCompletion}%</span>
          </div>
          <Progress value={profileCompletion} className={isDark ? 'bg-[#303974]' : 'bg-gray-200'} />
        </div>
      </div>
      
      <Tabs defaultValue="profile" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className={`w-full md:w-auto ${
          isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-gray-100 border border-gray-200'
        } p-1 mb-6`}>
          <TabsTrigger 
            value="profile" 
            className={`${
              isDark
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Business Profile
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio" 
            className={`${
              isDark
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="connections" 
            className={`${
              isDark
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Partners
          </TabsTrigger>
          <TabsTrigger 
            value="reputation" 
            className={`${
              isDark
                ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]'
                : 'data-[state=active]:bg-white data-[state=active]:text-purple-700 text-gray-600 data-[state=active]:shadow-sm'
            }`}
          >
            <Star className="h-4 w-4 mr-2" />
            Business Reputation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
                Fill in your business details to help us match you with the right opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Business Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your business name" 
                              {...field} 
                              className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}
                            />
                          </FormControl>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            Your official registered business name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Owner/Founder Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your name" 
                              {...field} 
                              className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}
                            />
                          </FormControl>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            Your name as the business owner
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Business Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="yourname@business.com" 
                              type="email"
                              {...field} 
                              className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}
                            />
                          </FormControl>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            Your business contact email
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Business Phone</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(123) 456-7890" 
                              {...field} 
                              className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}
                            />
                          </FormControl>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            Your business contact phone number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Primary Industry</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}>
                                <SelectValue placeholder="Select your primary industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {INDUSTRIES.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            The main industry your business operates in
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Website (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://yourbusiness.com" 
                              {...field} 
                              className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}
                            />
                          </FormControl>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            Your business website URL
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="yearFounded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Year Founded</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="2020" 
                              {...field} 
                              className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}
                            />
                          </FormControl>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            The year your business was established
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={isDark ? 'text-white' : ''}>Team Size</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}>
                                <SelectValue placeholder="Select team size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Just me</SelectItem>
                              <SelectItem value="2-5">2-5 employees</SelectItem>
                              <SelectItem value="6-10">6-10 employees</SelectItem>
                              <SelectItem value="11-20">11-20 employees</SelectItem>
                              <SelectItem value="21+">21+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                            How many people work at your business
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDark ? 'text-white' : ''}>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your business, your mission, and what makes you special..." 
                            {...field} 
                            className={`min-h-[120px] ${isDark ? 'bg-[#181F6A] border-[#303974]' : ''}`}
                          />
                        </FormControl>
                        <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                          A brief description of your business, what you do, and what makes you unique
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="certifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isDark ? 'text-white' : ''}>Certifications (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List any business certifications you have (e.g., WBE, WOSB, etc.)" 
                            {...field} 
                            className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}
                          />
                        </FormControl>
                        <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                          Any official certifications or accreditations your business has received
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <Label className={isDark ? 'text-white' : ''}>Business Skills</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <Select onValueChange={handleSkillAdd}>
                          <SelectTrigger className={isDark ? 'bg-[#181F6A] border-[#303974]' : ''}>
                            <SelectValue placeholder="Add skills" />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILLS.filter(skill => !selectedSkills.includes(skill)).map((skill) => (
                              <SelectItem key={skill} value={skill}>
                                {skill}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className={isDark ? 'text-[#8891C5]' : ''}>
                          Add skills that represent your business capabilities
                        </FormDescription>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className={`${
                              isDark 
                                ? 'bg-[#4A5BC2]/20 hover:bg-[#4A5BC2]/30 border-[#4A5BC2]' 
                                : 'bg-primary/10 hover:bg-primary/20 border-primary/30'
                            }`}
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleSkillRemove(skill)}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        {selectedSkills.length === 0 && (
                          <span className={`text-sm ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                            No skills added yet
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <CustomButton type="submit">
                      Save Profile
                    </CustomButton>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Portfolio</CardTitle>
                  <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
                    Showcase your past projects and work experience
                  </CardDescription>
                </div>
                <CustomButton size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </CustomButton>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolioProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`p-4 rounded-lg border ${
                      isDark 
                        ? 'border-[#303974] bg-[#181F6A]' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{project.title}</h3>
                      <div className="flex space-x-2">
                        <button className={`p-1 rounded-full ${isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-100'}`}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className={`p-1 rounded-full ${isDark ? 'hover:bg-[#303974]' : 'hover:bg-gray-100'}`}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'} mb-1`}>
                      Client: {project.client} • {project.year}
                    </p>
                    <p className="text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <Badge 
                          key={skill} 
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
                ))}
                
                <div 
                  className={`p-4 rounded-lg border border-dashed flex flex-col items-center justify-center text-center ${
                    isDark 
                      ? 'border-[#303974] hover:border-[#4A5BC2] bg-[#181F6A]/50' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <UploadCloud className={`h-8 w-8 mb-2 ${isDark ? 'text-[#4A5BC2]' : 'text-primary'}`} />
                  <h3 className="text-lg font-medium mb-1">Add Another Project</h3>
                  <p className={`text-sm mb-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Showcase more of your work to increase your chances of winning contracts
                  </p>
                  <CustomButton size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </CustomButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Business Partners</CardTitle>
                  <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
                    Connect with other women-owned businesses to team up for contracts
                  </CardDescription>
                </div>
                <CustomButton size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Find Partners
                </CustomButton>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div 
                    key={connection.id} 
                    className={`p-4 rounded-lg border flex items-center ${
                      isDark 
                        ? 'border-[#303974] bg-[#181F6A]' 
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark 
                        ? 'bg-[#4A5BC2]/20 text-[#B2B9E1]' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <User className="h-6 w-6" />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <h3 className="text-base font-medium">{connection.name}</h3>
                      <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        {connection.business} • {connection.industry}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <Star className={`h-4 w-4 ${
                          connection.matchScore > 90 
                            ? 'text-yellow-400' 
                            : connection.matchScore > 80 
                              ? 'text-green-400' 
                              : 'text-blue-400'
                        }`} />
                        <span className="ml-1 font-medium">{connection.matchScore}%</span>
                      </div>
                      <span className="text-xs mt-1">match</span>
                    </div>
                  </div>
                ))}
                
                <div 
                  className={`p-4 rounded-lg border border-dashed flex flex-col items-center justify-center text-center ${
                    isDark 
                      ? 'border-[#303974] hover:border-[#4A5BC2] bg-[#181F6A]/50' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <Users className={`h-8 w-8 mb-2 ${isDark ? 'text-[#4A5BC2]' : 'text-primary'}`} />
                  <h3 className="text-lg font-medium mb-1">Find More Partners</h3>
                  <p className={`text-sm mb-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Connect with other women entrepreneurs to team up for larger contracts
                  </p>
                  <CustomButton size="sm" variant="outline">
                    Explore Partner Network
                  </CustomButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reputation">
          <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974] text-white' : ''}>
            <CardHeader>
              <CardTitle>Business Reputation</CardTitle>
              <CardDescription className={isDark ? 'text-[#B2B9E1]' : ''}>
                Track your business reputation and growth on HerBid
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#181F6A]' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Overall Score</h3>
                    <Star className={`h-5 w-5 ${isDark ? 'text-yellow-300' : 'text-yellow-500'}`} />
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">85</span>
                    <span className="text-sm ml-1">/ 100</span>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Based on project completion, client feedback, and collaboration metrics
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#181F6A]' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Contracts Won</h3>
                    <Award className={`h-5 w-5 ${isDark ? 'text-purple-300' : 'text-purple-500'}`} />
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">8</span>
                    <span className={`text-sm ml-3 ${
                      isDark ? 'text-green-300' : 'text-green-500'
                    }`}>+2 this quarter</span>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Contracts successfully completed through HerBid
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-[#181F6A]' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Visibility</h3>
                    <BarChart3 className={`h-5 w-5 ${isDark ? 'text-pink-300' : 'text-pink-500'}`} />
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">65%</span>
                    <span className={`text-sm ml-3 ${
                      isDark ? 'text-green-300' : 'text-green-500'
                    }`}>+25% growth</span>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Your business visibility across opportunities
                  </p>
                </div>
              </div>
              
              <div className={`p-6 rounded-lg mb-6 ${
                isDark ? 'bg-[#181F6A]' : 'bg-gray-50'
              }`}>
                <h3 className="text-lg font-medium mb-4">Reputation Growth</h3>
                <div className="h-40 flex items-end justify-between">
                  {[40, 55, 45, 65, 60, 75, 85].map((height, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className={`w-8 ${
                          isDark 
                            ? 'bg-gradient-to-t from-purple-500/50 to-pink-500/50' 
                            : 'bg-gradient-to-t from-purple-100 to-pink-200'
                        } rounded-t-sm`} 
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className={`text-xs mt-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`p-6 rounded-lg ${
                isDark ? 'bg-[#181F6A]' : 'bg-gray-50'
              }`}>
                <h3 className="text-lg font-medium mb-4">Achievements</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Verified Business</h4>
                      <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Your business has been verified as women-owned
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Team Player</h4>
                      <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Successfully completed 3 contracts with other businesses
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Rising Star</h4>
                      <p className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Among the top 10% of new businesses on the platform
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
