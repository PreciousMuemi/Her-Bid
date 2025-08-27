import { UserProfile, saveUserProfile, getUserProfile } from './userProfileService';

export const authenticateUser = async (walletAddress: string): Promise<UserProfile> => {
  try {
    const existingProfile = getUserProfile();
    
    if (existingProfile?.walletAddress === walletAddress) {
      existingProfile.lastLogin = new Date().toISOString();
      saveUserProfile(existingProfile);
      return existingProfile;
    }

    const newProfile: UserProfile = {
      walletAddress,
      isVerified: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      userType: 'entrepreneur'
    };
    
    saveUserProfile(newProfile);
    return newProfile;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

export const checkAuthStatus = (): boolean => {
  return !!getUserProfile()?.walletAddress;
};

export const getCurrentUser = (): UserProfile | null => {
  return getUserProfile();
};
