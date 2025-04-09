
import { useState } from 'react';
import { useThemeStore } from "@/store/themeStore";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/CustomButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Users, Check, Shield, UserPlus, ChevronRight } from "lucide-react";

const ConsortiumCreator = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tokenName: '',
    tokenSymbol: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.tokenName || !formData.tokenSymbol) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    toast.info('Creating your consortium...');
    
    // Simulate consortium creation
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Consortium created successfully!');
      navigate('/collective-engine');
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Create a New Consortium
          </CardTitle>
          <CardDescription>
            Form a legal team with clear roles, responsibilities and payment terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-purple-400/10' : 'bg-purple-50'} border ${isDark ? 'border-purple-500/30' : 'border-purple-100'}`}>
            <h4 className={`font-medium mb-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              What is a Consortium?
            </h4>
            <p className={`text-sm ${isDark ? 'text-purple-200/80' : 'text-purple-600'}`}>
              A consortium is a formal partnership between multiple women-owned businesses that allows you to:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 text-sm ${isDark ? 'text-purple-200/80' : 'text-purple-600'}`}>
              <li>Combine skills and resources to tackle larger contracts</li>
              <li>Clearly define roles, responsibilities, and payment terms</li>
              <li>Create legal agreements backed by smart contracts</li>
              <li>Share risk and collaborate seamlessly</li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : ''}`}>
                  Consortium Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Digital Innovation Collective"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={isDark ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : ''}`}>
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="What is this consortium's purpose and focus?"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={isDark ? 'bg-[#0A155A]/50 border-[#303974] min-h-[100px]' : 'min-h-[100px]'}
                />
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : ''}`}>
                  Consortium Token Details
                </h4>
                <p className={`text-xs mb-3 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                  Your consortium will have its own token for managing ownership, voting rights, and profit distribution.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tokenName" className={`block text-xs font-medium mb-1 ${isDark ? 'text-white' : ''}`}>
                      Token Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="tokenName"
                      name="tokenName"
                      placeholder="e.g. Digital Innovation Token"
                      value={formData.tokenName}
                      onChange={handleInputChange}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tokenSymbol" className={`block text-xs font-medium mb-1 ${isDark ? 'text-white' : ''}`}>
                      Token Symbol <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="tokenSymbol"
                      name="tokenSymbol"
                      placeholder="e.g. DIT"
                      value={formData.tokenSymbol}
                      onChange={handleInputChange}
                      className={isDark ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
                      required
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col space-y-4">
              <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : ''}`}>
                After Creating Your Consortium
              </h4>
              
              <div className="space-y-3">
                <div className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-purple-400/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <UserPlus className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className={`text-sm font-medium ${isDark ? 'text-white' : ''}`}>
                      Invite Partners
                    </h5>
                    <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Invite other women entrepreneurs to join your consortium
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-blue-400/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Shield className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className={`text-sm font-medium ${isDark ? 'text-white' : ''}`}>
                      Define Roles & Payments
                    </h5>
                    <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Set clear responsibilities and payment distribution rules
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-start gap-3 p-3 rounded-lg ${isDark ? 'bg-[#182052]' : 'bg-gray-50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-green-400/20 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className={`text-sm font-medium ${isDark ? 'text-white' : ''}`}>
                      Start Bidding Together
                    </h5>
                    <p className={`text-xs ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                      Find and apply for contracts as a unified team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <CustomButton 
            variant="outline" 
            onClick={() => navigate('/collective-engine')}
            className={isDark ? 'border-[#303974] text-[#B2B9E1] hover:bg-[#182052]' : ''}
          >
            Cancel
          </CustomButton>
          
          <CustomButton 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={isDark 
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
              : ''}
          >
            {isSubmitting ? 'Creating...' : 'Create Consortium'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </CustomButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConsortiumCreator;
