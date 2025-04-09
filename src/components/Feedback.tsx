
import { useState } from 'react';
import { useThemeStore } from "@/store/themeStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomButton } from "@/components/ui/CustomButton";
import { toast } from "sonner";
import { MessageSquareText, Send, HelpCircle, AlertTriangle, ThumbsUp, Check } from "lucide-react";

// Define feedback categories
const feedbackCategories = [
  {
    id: 'payment',
    name: 'Payment Issues',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
  },
  {
    id: 'suggestion',
    name: 'Suggestion',
    icon: <ThumbsUp className="h-5 w-5 text-green-500" />
  },
  {
    id: 'help',
    name: 'Need Help',
    icon: <HelpCircle className="h-5 w-5 text-blue-500" />
  },
  {
    id: 'other',
    name: 'Other Feedback',
    icon: <MessageSquareText className="h-5 w-5 text-purple-500" />
  }
];

const Feedback = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
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
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor="category" 
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : ''}`}
                  >
                    Feedback Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      isDark ? 'bg-[#0A155A]/50 border-[#303974] text-white' : 'border-gray-200'
                    }`}
                    required
                  >
                    <option value="">Select a category</option>
                    {feedbackCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label 
                    htmlFor="subject" 
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : ''}`}
                  >
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Brief summary of your feedback"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={isDark ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="message" 
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : ''}`}
                  >
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please provide as much detail as possible"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={isDark ? 'bg-[#0A155A]/50 border-[#303974] min-h-[150px]' : 'min-h-[150px]'}
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className={`block text-sm font-medium mb-1 ${isDark ? 'text-white' : ''}`}
                  >
                    Your Email (optional)
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Where we can respond to you"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={isDark ? 'bg-[#0A155A]/50 border-[#303974]' : ''}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-[#B2B9E1]' : 'text-gray-500'}`}>
                    If you'd like us to follow up with you directly
                  </p>
                </div>
                
                {formData.category === 'payment' && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-amber-400/10 border border-amber-400/30' : 'bg-amber-50 border border-amber-100'}`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${isDark ? 'text-amber-300' : 'text-amber-500'}`} />
                      <div>
                        <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                          Payment Issue Reporting
                        </h4>
                        <p className={`text-xs ${isDark ? 'text-amber-200/80' : 'text-amber-700'}`}>
                          Please include transaction IDs and contract details when reporting payment issues for faster resolution.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
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
                {formData.email && ' We'll get back to you via email if needed.'}
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
