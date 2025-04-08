
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomButton } from "@/components/ui/CustomButton";
import { useThemeStore } from "@/store/themeStore";
import { toast } from "sonner";
import { MessageSquare, MessageCircle } from 'lucide-react';

interface FeedbackProps {
  onClose?: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ onClose }) => {
  const { theme } = useThemeStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'feedback'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data if available
  React.useEffect(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        setFormData(prev => ({
          ...prev,
          name: profile.businessName || prev.name,
          email: profile.email || prev.email
        }));
      } catch (error) {
        console.error("Error parsing user profile", error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Mock submission - in a real app, this would send data to a backend
    setTimeout(() => {
      toast.success("Thank you for your feedback!");
      setIsSubmitting(false);
      if (onClose) onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'feedback'
      });
    }, 1000);
  };

  return (
    <Card className={`max-w-md mx-auto ${theme === 'dark' ? 'bg-[#0A155A]/70 border-[#303974]' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Send Feedback
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">What would you like to share?</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feedback">General Feedback</SelectItem>
                <SelectItem value="issue">Report an Issue</SelectItem>
                <SelectItem value="payment">Payment Problem</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Brief subject of your feedback"
              className={theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Please provide details..."
              className={`min-h-[120px] ${theme === 'dark' ? 'bg-[#0A155A]/50 border-[#303974]' : ''}`}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onClose && (
            <CustomButton
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </CustomButton>
          )}
          <CustomButton
            type="submit"
            disabled={isSubmitting}
            className={`ml-auto ${theme === 'dark' 
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
              : ''
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </CustomButton>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Feedback;
