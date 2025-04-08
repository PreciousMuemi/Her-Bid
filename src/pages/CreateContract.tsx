
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomButton } from "@/components/ui/CustomButton";
import { toast } from "sonner";
import { Calendar, Clock, Briefcase, DollarSign, Users, X } from "lucide-react";

const CreateContract = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Contract form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    location: "",
    projectLength: "",
    industry: "",
    skills: [] as string[],
    skillInput: "",
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle selection changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select element change - this is the fix for the type error
  const handleSelectElementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Add a skill tag
  const handleAddSkill = () => {
    if (formData.skillInput.trim() !== "" && !formData.skills.includes(formData.skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.skillInput.trim()],
        skillInput: ""
      });
    }
  };
  
  // Remove a skill tag
  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill)
    });
  };
  
  // Handle skill input key press (add on Enter)
  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };
  
  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Create contract object
    const newContract = {
      ...formData,
      id: `contract-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'draft',
      applicants: 0
    };
    
    // Store in localStorage (in a real app, this would be sent to a backend)
    const contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
    contracts.push(newContract);
    localStorage.setItem('contracts', JSON.stringify(contracts));
    
    // Show success message
    toast.success("Contract created successfully!");
    
    // Redirect to issuer dashboard
    setTimeout(() => {
      navigate('/issuer-dashboard');
    }, 1000);
  };
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Post a New Contract
        </h1>
        <p className={theme === 'dark' ? 'text-[#B2B9E1]' : 'text-gray-600'}>
          Create a contract listing to find talented women-owned businesses to work on your project.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className={theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
          <CardHeader>
            <CardTitle className="text-lg">Contract Details</CardTitle>
            <CardDescription>
              Provide detailed information to attract qualified teams
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Contract Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Contract Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Website Redesign for Government Agency"
                className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
                required
              />
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the project, requirements, and expectations..."
                className={`min-h-[120px] ${theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}`}
                required
              />
            </div>
            
            {/* Budget and Deadline row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="budget" 
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="e.g. $50,000 - $75,000"
                    className={`pl-9 ${theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}`}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="deadline" 
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className={`pl-9 ${theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}`}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Location and Project Length row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleSelectElementChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974] text-white' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select location type</option>
                  <option value="remote">Remote Only</option>
                  <option value="onsite">Onsite Only</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectLength">Project Length</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="projectLength" 
                    name="projectLength"
                    value={formData.projectLength}
                    onChange={handleInputChange}
                    placeholder="e.g. 3 months"
                    className={`pl-9 ${theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}`}
                  />
                </div>
              </div>
            </div>
            
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select 
                value={formData.industry} 
                onValueChange={(value) => handleSelectChange('industry', value)}
              >
                <SelectTrigger className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}>
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex">
                <Input 
                  id="skills" 
                  name="skillInput"
                  value={formData.skillInput}
                  onChange={handleInputChange}
                  onKeyPress={handleSkillKeyPress}
                  placeholder="e.g. Web Development"
                  className={`mr-2 ${theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}`}
                />
                <CustomButton 
                  type="button" 
                  onClick={handleAddSkill}
                  variant="secondary"
                >
                  Add
                </CustomButton>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        theme === 'dark' 
                          ? 'bg-[#182052] text-[#B2B9E1]' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-500 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-3 border-t pt-6">
            <CustomButton 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/issuer-dashboard')}
            >
              Cancel
            </CustomButton>
            <CustomButton 
              type="button" 
              variant="secondary"
              onClick={() => {
                toast.success("Draft saved!");
                navigate('/issuer-dashboard');
              }}
            >
              Save as Draft
            </CustomButton>
            <CustomButton 
              type="submit"
              disabled={isSubmitting}
              className={theme === 'dark' 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                : ''
              }
            >
              {isSubmitting ? "Publishing..." : "Publish Contract"}
            </CustomButton>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CreateContract;
