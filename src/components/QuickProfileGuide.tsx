
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { CustomButton } from '@/components/ui/CustomButton';
import { Building, Briefcase, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const QuickProfileGuide = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: '',
    skillsArray: [''],
    capacity: '',
    portfolio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...formData.skillsArray];
    updatedSkills[index] = value;
    setFormData(prev => ({ ...prev, skillsArray: updatedSkills }));
  };

  const addSkill = () => {
    setFormData(prev => ({ ...prev, skillsArray: [...prev.skillsArray, ''] }));
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...formData.skillsArray];
    updatedSkills.splice(index, 1);
    setFormData(prev => ({ ...prev, skillsArray: updatedSkills }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Save profile data to localStorage
    try {
      const userProfile = {
        businessType: formData.businessType,
        skills: formData.skillsArray.filter(skill => skill.trim() !== ''),
        capacity: formData.capacity,
        portfolio: formData.portfolio,
        completedProfile: true
      };
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      
      setTimeout(() => {
        setIsSubmitting(false);
        toast.success("Profile updated successfully!");
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to update profile. Please try again.");
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 rounded-lg shadow-lg ${
      isDark ? 'bg-[#0A155A]/70 border border-[#303974]' : 'bg-white border border-gray-200'
    }`}>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= i 
                ? isDark 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-primary text-white'
                : isDark
                  ? 'bg-[#182052] text-[#8891C5]'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {step > i ? <CheckCircle className="h-4 w-4" /> : i}
            </div>
            {i < 3 && (
              <div className={`w-20 h-1 ${
                step > i 
                  ? isDark
                    ? 'bg-purple-500'
                    : 'bg-primary'
                  : isDark
                    ? 'bg-[#182052]'
                    : 'bg-gray-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Business Type */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Building className={`h-6 w-6 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Tell us about your business
            </h2>
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
            This helps us match you with the right opportunities and partners.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="businessType" className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-[#B2B9E1]' : 'text-gray-700'
              }`}>
                What type of business do you run?
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-md ${
                  isDark 
                    ? 'bg-[#182052] border-[#303974] text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-purple-500`}
                required
              >
                <option value="">Select a business type</option>
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
              <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                Choose the category that best describes your business
              </p>
            </div>
            
            <div>
              <label htmlFor="capacity" className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-[#B2B9E1]' : 'text-gray-700'
              }`}>
                What's your team size?
              </label>
              <select
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                className={`w-full p-2 rounded-md ${
                  isDark 
                    ? 'bg-[#182052] border-[#303974] text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-purple-500`}
                required
              >
                <option value="">Select team size</option>
                <option value="Solo">Just me (Solopreneur)</option>
                <option value="2-5">Small (2-5 people)</option>
                <option value="6-10">Medium (6-10 people)</option>
                <option value="11-20">Growing (11-20 people)</option>
                <option value="21+">Established (21+ people)</option>
              </select>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
                This helps us find projects that match your capacity
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Briefcase className={`h-6 w-6 ${isDark ? 'text-pink-300' : 'text-pink-600'}`} />
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              What are your business strengths?
            </h2>
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
            Add your top skills so we can match you with the perfect opportunities.
          </p>
          
          <div className="space-y-3">
            {formData.skillsArray.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder="Enter a skill (e.g., UX Design, Project Management)"
                  className={`flex-grow p-2 rounded-md ${
                    isDark 
                      ? 'bg-[#182052] border-[#303974] text-white placeholder-[#8891C5]' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-purple-500`}
                />
                {formData.skillsArray.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className={`p-2 rounded-md ${
                      isDark
                        ? 'bg-[#303974] text-white hover:bg-[#4A5BC2]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addSkill}
              className={`w-full p-2 mt-2 rounded-md border border-dashed ${
                isDark
                  ? 'border-[#303974] text-[#B2B9E1] hover:border-purple-500'
                  : 'border-gray-300 text-gray-600 hover:border-purple-500'
              }`}
            >
              + Add Another Skill
            </button>
            
            <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
              The more specific your skills, the better we can match you
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Portfolio */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Users className={`h-6 w-6 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Tell us about your past work
            </h2>
          </div>
          <p className={`text-sm mb-4 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
            Share a brief description of your previous projects or clients.
          </p>
          
          <div>
            <label htmlFor="portfolio" className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-[#B2B9E1]' : 'text-gray-700'
            }`}>
              Portfolio or Previous Experience
            </label>
            <textarea
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              placeholder="Tell us about your past projects, clients, or achievements. What makes your business special?"
              rows={5}
              className={`w-full p-3 rounded-md ${
                isDark 
                  ? 'bg-[#182052] border-[#303974] text-white placeholder-[#8891C5]' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-purple-500`}
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-[#8891C5]' : 'text-gray-500'}`}>
              This helps build credibility when applying for contracts and finding partners
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <CustomButton
          variant="outline"
          onClick={handlePrevStep}
          disabled={step === 1}
          className={`${step === 1 ? 'invisible' : ''}`}
        >
          Back
        </CustomButton>
        
        <CustomButton
          onClick={handleNextStep}
          disabled={
            (step === 1 && (!formData.businessType || !formData.capacity)) ||
            (step === 2 && formData.skillsArray.filter(s => s.trim()).length === 0) ||
            isSubmitting
          }
        >
          {step === 3 ? (isSubmitting ? "Saving..." : "Complete Profile") : "Continue"}
        </CustomButton>
      </div>
    </div>
  );
};

export default QuickProfileGuide;
