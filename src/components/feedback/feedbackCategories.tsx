
import { MessageSquareText, HelpCircle, AlertTriangle, ThumbsUp } from "lucide-react";
import { FeedbackCategory } from "./types";

export const feedbackCategories: FeedbackCategory[] = [
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
