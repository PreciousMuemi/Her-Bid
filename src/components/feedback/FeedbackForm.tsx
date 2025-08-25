
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";
import { FeedbackFormData } from './types';

interface FeedbackFormProps {
  formData: FeedbackFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  isDark: boolean;
  feedbackCategories: {
    id: string;
    name: string;
    icon: JSX.Element;
  }[];
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  formData,
  handleInputChange,
  isDark,
  feedbackCategories
}) => {
  return (
    <form>
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
  );
};

export default FeedbackForm;
