import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { CustomButton } from '../components/ui/CustomButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { 
  Search,
  Filter,
  MapPin,
  Star,
  Building,
  Wrench,
  Utensils,
  Laptop,
  Package,
  Megaphone,
  Plus,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('browse');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Simplified for now
  const theme = 'light'; // Simplified for now
  
  const categories = [
    { id: 'all', name: 'All Categories', icon: Package, count: 156 },
    { id: 'tech', name: 'Tech & Web', icon: Laptop, count: 45 },
    { id: 'construction', name: 'Construction', icon: Building, count: 34 },
    { id: 'trades', name: 'Trades & Repair', icon: Wrench, count: 28 },
    { id: 'catering', name: 'Food & Catering', icon: Utensils, count: 23 },
    { id: 'supply', name: 'Supply & Logistics', icon: Package, count: 19 },
    { id: 'marketing', name: 'Marketing & Media', icon: Megaphone, count: 7 }
  ];

  const jobs = [
    {
      id: 1,
      title: 'School Lunch Catering - 5 Schools',
      description: 'Need reliable catering service for 5 primary schools in Nairobi. 500 meals daily.',
      budget: 'KES 150,000/month',
      location: 'Nairobi',
      category: 'catering',
      tags: ['Catering', 'Food Supply', 'Schools'],
      deadline: '3 days left',
      applicants: 12,
      postedBy: 'Nairobi Education Board',
      rating: 4.8
    },
    {
      id: 2,
      title: 'E-commerce Website Development',
      description: 'Build modern e-commerce platform for local fashion brand with M-Pesa integration.',
      budget: 'KES 80,000',
      location: 'Remote',
      category: 'tech',
      tags: ['Web Development', 'E-commerce', 'M-Pesa'],
      deadline: '1 week left',
      applicants: 8,
      postedBy: 'Fashion Forward Ltd',
      rating: 4.9
    },
    {
      id: 3,
      title: 'Plumbing Installation - 10 Houses',
      description: 'Complete plumbing installation for new residential development in Mombasa.',
      budget: 'KES 200,000',
      location: 'Mombasa',
      category: 'trades',
      tags: ['Plumbing', 'Installation', 'Residential'],
      deadline: '5 days left',
      applicants: 15,
      postedBy: 'Coast Developers',
      rating: 4.7
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Check auth status
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050A30]' : 'bg-background'}`}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
              Marketplace
            </h1>
            <p className={`${theme === 'dark' ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>
              Find opportunities or post jobs across Kenya
            </p>
          </div>
          <CustomButton onClick={() => navigate('/post-job')} className="mt-4 md:mt-0">
            <Plus className="w-4 h-4 mr-2" />
            Post a Job
          </CustomButton>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="my-applications">My Applications</TabsTrigger>
            <TabsTrigger value="my-jobs">My Posted Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <CustomButton variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </CustomButton>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <p className="text-sm font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.count} jobs</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {job.rating}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.deadline}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applicants} applicants
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary mb-2">{job.budget}</p>
                        <p className="text-sm text-muted-foreground mb-3">by {job.postedBy}</p>
                        <CustomButton>Apply Now</CustomButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-applications">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track your job applications and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No applications yet. Start browsing jobs to apply!</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-jobs">
            <Card>
              <CardHeader>
                <CardTitle>My Posted Jobs</CardTitle>
                <CardDescription>Manage jobs you've posted and review applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No jobs posted yet. Click "Post a Job" to get started!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
