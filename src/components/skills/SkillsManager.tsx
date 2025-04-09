
import { useState } from 'react';
import { useThemeStore } from "@/store/themeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/CustomButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, X, Plus, FileText, Image, Check, Star } from "lucide-react";

const SkillsManager = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // Mock user skills data
  const [skills, setSkills] = useState([
    { id: 1, name: 'Web Development', level: 'Advanced', verified: true },
    { id: 2, name: 'UI/UX Design', level: 'Advanced', verified: true },
    { id: 3, name: 'Project Management', level: 'Intermediate', verified: true },
    { id: 4, name: 'Content Creation', level: 'Intermediate', verified: false },
  ]);
  
  // Mock portfolio items
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: 1,
      title: 'E-commerce Website Redesign',
      description: 'Complete redesign of an e-commerce platform that increased conversion rates by 32%',
      imageUrl: 'https://placehold.co/600x400/8B5CF6/FFFFFF/webp?text=E-commerce+Redesign',
      tags: ['Web Design', 'UI/UX', 'E-commerce']
    }
  ]);
  
  const addSkill = () => {
    if (!skillInput.trim()) return;
    
    const newSkill = {
      id: skills.length + 1,
      name: skillInput.trim(),
      level: 'Beginner',
      verified: false
    };
    
    setSkills([...skills, newSkill]);
    setSkillInput('');
    toast.success(`"${newSkill.name}" added to your skills`);
  };
  
  const removeSkill = (id: number) => {
    setSkills(skills.filter(skill => skill.id !== id));
    toast.info('Skill removed');
  };
  
  const handleVerifySkill = () => {
    toast.info('Starting skill verification process...');
    setTimeout(() => {
      toast.success('Verification request submitted. You will be notified once verified.');
    }, 1500);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    // Simulate file upload
    toast.info('Uploading your file...');
    
    setTimeout(() => {
      setUploading(false);
      
      // Add new portfolio item
      const newItem = {
        id: portfolioItems.length + 1,
        title: 'New Project',
        description: 'Click to edit the description of your new project',
        imageUrl: 'https://placehold.co/600x400/6366F1/FFFFFF/webp?text=New+Project',
        tags: ['New']
      };
      
      setPortfolioItems([...portfolioItems, newItem]);
      toast.success('File uploaded successfully!');
      
      // Reset file input
      e.target.value = '';
    }, 2000);
  };
  
  const deletePortfolioItem = (id: number) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    toast.info('Portfolio item removed');
  };
  
  return (
    <div className="space-y-6">
      {/* Skills Management Card */}
      <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-500" />
            Manage Your Skills
          </CardTitle>
          <CardDescription>
            Add and verify your professional skills to match with relevant opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add a new skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className={isDark ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
              />
              <CustomButton onClick={addSkill}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </CustomButton>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="outline"
                  className={`flex items-center gap-1 px-3 py-1.5 ${
                    isDark ? 'border-[#303974] bg-[#182052]' : ''
                  }`}
                >
                  {skill.name}
                  {skill.verified && (
                    <Check className={`h-3.5 w-3.5 ml-1 ${isDark ? 'text-green-300' : 'text-green-500'}`} />
                  )}
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className={`ml-2 hover:${isDark ? 'text-red-300' : 'text-red-500'}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
            <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-white' : ''}`}>Skill Verification</h4>
            <p className={`text-sm mb-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
              Verified skills increase your chances of being matched with opportunities and help build trust with potential clients.
            </p>
            <CustomButton size="sm" onClick={handleVerifySkill}>
              Request Skill Verification
            </CustomButton>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Upload Card */}
      <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Portfolio & Work Samples
          </CardTitle>
          <CardDescription>
            Showcase your best work to attract more contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label 
              htmlFor="portfolio-upload" 
              className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                isDark 
                  ? 'border-[#303974] bg-[#0A155A]/30 hover:bg-[#182052]' 
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className={`h-8 w-8 mb-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
                <p className={`mb-1 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
                  {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                  SVG, PNG, JPG, GIF, PDF or DOC (MAX. 10MB)
                </p>
              </div>
              <input 
                id="portfolio-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
          
          {portfolioItems.length > 0 && (
            <div className="space-y-4">
              <h4 className={`text-sm font-medium ${isDark ? 'text-white' : ''}`}>Your Portfolio</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolioItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`rounded-lg overflow-hidden border ${
                      isDark ? 'border-[#303974]' : 'border-gray-200'
                    }`}
                  >
                    <div className="aspect-video relative bg-gray-800">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => deletePortfolioItem(item.id)}
                        className={`absolute top-2 right-2 p-1 rounded-full ${
                          isDark 
                            ? 'bg-red-500/80 hover:bg-red-600 text-white' 
                            : 'bg-white/80 hover:bg-white text-red-500'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-3">
                      <h5 className={`font-medium mb-1 ${isDark ? 'text-white' : ''}`}>
                        {item.title}
                      </h5>
                      <p className={`text-xs mb-2 line-clamp-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded ${
                              isDark 
                                ? 'bg-[#182052] text-[#B2B9E1]' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsManager;
