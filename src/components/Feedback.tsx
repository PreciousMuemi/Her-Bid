
import { useState } from 'react';
import { useThemeStore } from "@/store/themeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/CustomButton";
import { toast } from "sonner";
import { MessageSquareText, Send, Check } from "lucide-react";
import FeedbackForm from './feedback/FeedbackForm';
import FeedbackSuccess from './feedback/FeedbackSuccess';
import { feedbackCategories } from './feedback/feedbackCategories';
import { FeedbackFormData } from './feedback/types';

const Feedback = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    category: '',
    subject: '',
    message: '',
    email: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.category || !formData.subject || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Your feedback has been submitted. Thank you!');
    }, 1500);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      category: '',
      subject: '',
      message: '',
      email: ''
    });
  };
  
  return (
    <div className="max-w-xl mx-auto p-4">
      <Card className={isDark ? 'bg-[#0A155A]/70 border-[#303974]' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-purple-500" />
            Send Us Feedback
          </CardTitle>
          <CardDescription>
            We value your input to improve HerBid and address any issues
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!submitted ? (
            <FeedbackForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              isDark={isDark}
              feedbackCategories={feedbackCategories}
            />
          ) : (
            <div className="py-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                isDark ? 'bg-green-400/20' : 'bg-green-100'
              }`}>
                <Check className={`h-8 w-8 ${isDark ? 'text-green-300' : 'text-green-600'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>
                Thank You for Your Feedback
              </h3>
              <p className={`mb-6 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-600'}`}>
                We've received your submission and will review it promptly.
                {formData.email && " We'll get back to you via email if needed."}
              </p>
              <CustomButton 
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    category: '',
                    subject: '',
                    message: '',
                    email: ''
                  });
                }}
              >
                Send Another Feedback
              </CustomButton>
            </div>
          )}
        </CardContent>
        
        {!submitted && (
          <CardFooter className="flex justify-end border-t pt-6">
            <CustomButton 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting} 
              className={isDark 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0' 
                : ''}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              <Send className="h-4 w-4 ml-2" />
            </CustomButton>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Feedback;
