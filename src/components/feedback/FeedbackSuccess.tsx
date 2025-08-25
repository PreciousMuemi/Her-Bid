
import React from 'react';
import { Check } from "lucide-react";
import { CustomButton } from "@/components/ui/CustomButton";
import { FeedbackFormData } from './types';

interface FeedbackSuccessProps {
  isDark: boolean;
  formData: FeedbackFormData;
  onReset: () => void;
}

const FeedbackSuccess: React.FC<FeedbackSuccessProps> = ({ isDark, formData, onReset }) => {
  return (
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
      <CustomButton onClick={onReset}>
        Send Another Feedback
      </CustomButton>
    </div>
  );
};

export default FeedbackSuccess;
