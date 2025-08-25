import { 
  UserProfile, 
  saveUserProfile, 
  getUserProfile 
} from './userProfileService';

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
    throw new Error('Failed to authenticate user');
  }
};

export const verifyUserIdentity = async (verificationData: any): Promise<boolean> => {
  try {
    const profile = getUserProfile();
    if (!profile) throw new Error('No user profile found');
    
    profile.isVerified = true;
    profile.verificationData = verificationData;
    saveUserProfile(profile);
    return true;
  } catch (error) {
    console.error('Verification failed:', error);
    return false;
  }
};

export const checkAuthStatus = (): boolean => {
  return !!getUserProfile()?.walletAddress;
};
