export interface UserProfile {
  walletAddress: string;
  email?: string;
  userType: 'entrepreneur' | 'issuer' | 'both';
  gender?: string;
  businessName?: string;
  industry?: string;
  skills?: string[];
  isVerified?: boolean;
  verificationData?: any;
  createdAt?: string;
  lastLogin?: string;
  needsVerification?: boolean;
}

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const profile = localStorage.getItem('userProfile');
  return profile ? JSON.parse(profile) : null;
};

export const getUserType = (): string | null => {
  const profile = getUserProfile();
  return profile?.userType || null;
};

export const isVerifiedUser = (): boolean => {
  const profile = getUserProfile();
  return profile?.isVerified || false;
};
