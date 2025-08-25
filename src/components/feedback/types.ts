
export interface FeedbackFormData {
  category: string;
  subject: string;
  message: string;
  email: string;
}

export interface FeedbackCategory {
  id: string;
  name: string;
  icon: JSX.Element;
}
