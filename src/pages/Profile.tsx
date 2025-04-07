
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from "@/store/themeStore";
import { CustomButton } from "@/components/ui/CustomButton";
import { Badge } from "@/components/ui/badge";
import { 
  Award, Building2, FileText, Briefcase, Phone, Mail, Globe, 
  MapPin, Edit2, Upload, Star, Users, Shield, Calendar, User, CheckCircle
} from "lucide-react";
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  businessType: string;
  description: string;
  foundedYear: string;
  employeeCount: string;
  skills: string[];
  certifications: string[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    businessType: '',
    description: '',
    foundedYear: '',
    employeeCount: '',
    skills: [],
    certifications: []
  });
  
  const [verifications, setVerifications] = useState({
    womanOwned: true,
    identityVerified: true,
    businessRegistered: true,
  });
  
  // Stats for profile
  const stats = [
    { 
      title: "Reputation Score", 
      value: "92%", 
      icon: <Award className={`h-5 w-5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />,
      description: "Based on completed contracts"
    },
    { 
      title: "Team Members", 
      value: "4", 
      icon: <Users className={`h-5 w-5 ${isDark ? "text-purple-400" : "text-purple-600"}`} />,
      description: "In your business"
    },
    { 
      title: "Contracts", 
      value: "12", 
      icon: <FileText className={`h-5 w-5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />,
      description: "Successfully completed"
    },
    { 
      title: "Payment Success", 
      value: "100%", 
      icon: <Shield className={`h-5 w-5 ${isDark ? "text-green-400" : "text-green-600"}`} />,
      description: "On-time contract payments"
    }
  ];
  
  // Load profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData({
          ...profileData,
          ...parsedProfile
        });
      } catch (e) {
        console.error("Error parsing profile data", e);
      }
    }
  }, []);
  
  // Handle profile editing
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setProfileData(prev => ({
      ...prev,
      skills
    }));
  };
  
  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const certifications = e.target.value.split(',').map(cert => cert.trim());
    setProfileData(prev => ({
      ...prev,
      certifications
    }));
  };
  
  const handleSaveProfile = () => {
    // Validate required fields
    if (!profileData.businessName || !profileData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      localStorage.setItem('userProfile', JSON.stringify({
        ...profileData,
        completedProfile: true
      }));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (e) {
      console.error("Error saving profile", e);
      toast.error("Failed to save profile");
    }
  };
  
  // Business details display component
  const BusinessDetails = () => (
    <div className={`p-6 rounded-lg ${
      isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Business Details
        </h2>
        <CustomButton 
          variant="outline" 
          size="sm"
          onClick={handleEditProfile}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Edit Profile
        </CustomButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Business Type
          </p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            {profileData.businessType || 'Not specified'}
          </p>
        </div>
        
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Founded
          </p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            {profileData.foundedYear || 'Not specified'}
          </p>
        </div>
        
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Team Size
          </p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            {profileData.employeeCount || 'Not specified'} employees
          </p>
        </div>
        
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Location
          </p>
          <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            {profileData.location || 'Not specified'}
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <p className={`text-sm font-medium mb-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
          Business Description
        </p>
        <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
          {profileData.description || 'No business description provided.'}
        </p>
      </div>
      
      <div className="mt-6">
        <p className={`text-sm font-medium mb-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
          Key Skills & Expertise
        </p>
        <div className="flex flex-wrap gap-2">
          {profileData.skills && profileData.skills.length > 0 ? (
            profileData.skills.map((skill, index) => (
              <Badge key={index} variant={isDark ? 'outline' : 'secondary'} className={isDark ? 'border-[#4A5BC2] text-[#B2B9E1]' : ''}>
                {skill}
              </Badge>
            ))
          ) : (
            <p className={`text-sm ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
              No skills specified
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <p className={`text-sm font-medium mb-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
          Certifications
        </p>
        <div className="flex flex-wrap gap-2">
          {profileData.certifications && profileData.certifications.length > 0 ? (
            profileData.certifications.map((cert, index) => (
              <Badge key={index} className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {cert}
              </Badge>
            ))
          ) : (
            <p className={`text-sm ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
              No certifications specified
            </p>
          )}
        </div>
      </div>
    </div>
  );
  
  // Edit profile form component
  const EditProfileForm = () => (
    <div className={`p-6 rounded-lg ${
      isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
    }`}>
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Edit Profile
      </h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              First Name
            </label>
            <input 
              type="text" 
              name="firstName" 
              value={profileData.firstName} 
              onChange={handleInputChange} 
              className={`w-full p-2 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              Last Name
            </label>
            <input 
              type="text" 
              name="lastName" 
              value={profileData.lastName} 
              onChange={handleInputChange} 
              className={`w-full p-2 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
            Business Name*
          </label>
          <input 
            type="text" 
            name="businessName" 
            value={profileData.businessName} 
            onChange={handleInputChange} 
            required
            className={`w-full p-2 rounded-md ${
              isDark 
                ? 'bg-[#182052] border-[#303974] text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              Email*
            </label>
            <input 
              type="email" 
              name="email" 
              value={profileData.email} 
              onChange={handleInputChange} 
              required
              className={`w-full p-2 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              Phone
            </label>
            <input 
              type="tel" 
              name="phone" 
              value={profileData.phone} 
              onChange={handleInputChange} 
              className={`w-full p-2 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              Website
            </label>
            <input 
              type="url" 
              name="website" 
              value={profileData.website} 
              onChange={handleInputChange} 
              className={`w-full p-2 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              Location
            </label>
            <input 
              type="text" 
              name="location" 
              value={profileData.location} 
              onChange={handleInputChange} 
              className={`w-full p-2 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
              Business Type
            </label>
            <select
              name="businessType"
              value={profileData.businessType}
              onChange={handleInputChange}
              className={`w-full p-2 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select Business Type</option>
              <option value="Consulting">Consulting</option>
              <option value="Design & Creative">Design & Creative</option>
              <option value="Technology">Technology</option>
              <option value="Marketing">Marketing</option>
              <option value="Professional Services">Professional Services</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
              <option value="Construction">Construction</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                Founded Year
              </label>
              <input 
                type="text" 
                name="foundedYear" 
                value={profileData.foundedYear} 
                onChange={handleInputChange} 
                placeholder="e.g. 2018"
                className={`w-full p-2 rounded-md ${
                  isDark 
                    ? 'bg-[#182052] border-[#303974] text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
                Team Size
              </label>
              <select
                name="employeeCount"
                value={profileData.employeeCount}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-md ${
                  isDark 
                    ? 'bg-[#182052] border-[#303974] text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select Size</option>
                <option value="Just me">Just me</option>
                <option value="2-5">2-5</option>
                <option value="6-10">6-10</option>
                <option value="11-20">11-20</option>
                <option value="21+">21+</option>
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
            Business Description
          </label>
          <textarea 
            name="description" 
            value={profileData.description} 
            onChange={handleInputChange} 
            rows={4}
            className={`w-full p-2 rounded-md ${
              isDark 
                ? 'bg-[#182052] border-[#303974] text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
            Skills (comma separated)
          </label>
          <input 
            type="text" 
            value={profileData.skills.join(', ')} 
            onChange={handleSkillsChange} 
            placeholder="e.g. Web Design, Marketing, Project Management"
            className={`w-full p-2 rounded-md ${
              isDark 
                ? 'bg-[#182052] border-[#303974] text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
            Add skills that best describe your business expertise
          </p>
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-700'}`}>
            Certifications (comma separated)
          </label>
          <input 
            type="text" 
            value={profileData.certifications.join(', ')} 
            onChange={handleCertificationsChange} 
            placeholder="e.g. WBE Certified, ISO 9001, PMP"
            className={`w-full p-2 rounded-md ${
              isDark 
                ? 'bg-[#182052] border-[#303974] text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
            Add any business certifications or qualifications you hold
          </p>
        </div>
        
        <div className="flex justify-between pt-4">
          <CustomButton 
            variant="outline" 
            onClick={handleCancelEdit}
          >
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSaveProfile}>
            Save Changes
          </CustomButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Business Profile
          </h1>
          <p className={`${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
            Manage your business information and showcase your expertise
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <CustomButton onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </CustomButton>
        </div>
      </div>
      
      {/* Profile Header */}
      <div className={`p-6 rounded-lg mb-6 ${
        isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
            <div className={`w-24 h-24 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-[#182052] text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {profileData.businessName ? (
                <span className="text-3xl font-bold">
                  {profileData.businessName.charAt(0)}
                </span>
              ) : (
                <Building2 className="h-12 w-12" />
              )}
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {profileData.businessName || 'Your Business Name'}
                </h2>
                <p className={`text-sm mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                  {profileData.businessType || 'Business Type'} • {profileData.location || 'Location'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                {verifications.womanOwned && (
                  <Badge className={isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-700'}>
                    <CheckCircle className="h-3 w-3 mr-1" /> Woman-Owned
                  </Badge>
                )}
                
                {verifications.identityVerified && (
                  <Badge className={isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-700'}>
                    <CheckCircle className="h-3 w-3 mr-1" /> Verified Identity
                  </Badge>
                )}
                
                {verifications.businessRegistered && (
                  <Badge className={isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'}>
                    <CheckCircle className="h-3 w-3 mr-1" /> Registered Business
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {profileData.email && (
                <div className="flex items-center">
                  <Mail className={`h-4 w-4 mr-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
                  <span className={`text-sm truncate ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    {profileData.email}
                  </span>
                </div>
              )}
              
              {profileData.phone && (
                <div className="flex items-center">
                  <Phone className={`h-4 w-4 mr-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    {profileData.phone}
                  </span>
                </div>
              )}
              
              {profileData.website && (
                <div className="flex items-center">
                  <Globe className={`h-4 w-4 mr-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
                  <span className={`text-sm truncate ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    {profileData.website}
                  </span>
                </div>
              )}
              
              {profileData.foundedYear && (
                <div className="flex items-center">
                  <Calendar className={`h-4 w-4 mr-2 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    Est. {profileData.foundedYear}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${
              isDark 
                ? 'bg-[#0A155A]/70 border border-[#303974]' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center mb-2">
              {stat.icon}
              <span className={`ml-2 text-sm font-medium ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                {stat.title}
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>
      
      {/* Tabs for profile sections */}
      <Tabs defaultValue="details" className="mb-6">
        <TabsList className={`mb-6 ${
          isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-gray-100 border border-gray-200'
        }`}>
          <TabsTrigger 
            value="details" 
            className={isDark 
              ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]' 
              : 'data-[state=active]:bg-white data-[state=active]:text-primary text-gray-500'
            }
          >
            <User className="h-4 w-4 mr-2" />
            Business Details
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio" 
            className={isDark 
              ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]' 
              : 'data-[state=active]:bg-white data-[state=active]:text-primary text-gray-500'
            }
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="reputation" 
            className={isDark 
              ? 'data-[state=active]:bg-[#4A5BC2] data-[state=active]:text-white text-[#B2B9E1]' 
              : 'data-[state=active]:bg-white data-[state=active]:text-primary text-gray-500'
            }
          >
            <Star className="h-4 w-4 mr-2" />
            Reputation
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          {isEditing ? <EditProfileForm /> : <BusinessDetails />}
        </TabsContent>
        
        <TabsContent value="portfolio">
          <div className={`p-6 rounded-lg ${
            isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Portfolio & Work History
              </h2>
              <CustomButton variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Add Project
              </CustomButton>
            </div>
            
            <div className="text-center py-10">
              <div className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                <Briefcase className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No portfolio items yet
              </h3>
              <p className={`mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                Showcase your past work to build credibility with clients and partners
              </p>
              <CustomButton>
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Project
              </CustomButton>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reputation">
          <div className={`p-6 rounded-lg ${
            isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Business Reputation
            </h2>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Overall Score
                </span>
                <span className={`font-bold text-lg ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  92%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full" 
                  style={{ width: '92%' }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        On-time Delivery
                      </span>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        98%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Quality of Work
                      </span>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        95%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Communication
                      </span>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        90%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                        Budget Adherence
                      </span>
                      <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        88%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Contract Success
                </h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-md ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className="flex justify-between">
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Completed Contracts
                        </div>
                        <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                          Successfully delivered
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        12
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className="flex justify-between">
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Contract Value
                        </div>
                        <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                          Total contracts completed
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        $432K
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                    <div className="flex justify-between">
                      <div>
                        <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Repeat Clients
                        </div>
                        <div className={`text-sm ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                          Client retention rate
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        83%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
