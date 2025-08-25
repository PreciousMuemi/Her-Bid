
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
import { useSui } from '@/hooks/useSui';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useThemeStore } from '@/store/themeStore';
import { CustomButton } from '../ui/CustomButton';
import { toast } from 'sonner';

const AppHeader = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  
  const [username, setUsername] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Load user profile if available
  useState(() => {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        if (profile.businessName) {
          setBusinessName(profile.businessName);
        }
        if (profile.firstName) {
          setUsername(profile.firstName);
        }
      } catch (e) {
        console.error("Error parsing user profile", e);
      }
    } else {
      setUsername('User');
    }
  });
  
  const handleLogout = () => {
   
    localStorage.removeItem("isAuthenticated");
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const displayName = businessName || username || 'User';
  const initials = displayName.charAt(0);

  return (
    <header className={`border-b ${theme === 'dark' ? 'border-[#303974] bg-[#0A155A]' : 'border-gray-200 bg-white'} py-2 px-4 md:px-6`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Her</span>
            <span className={theme === 'dark' ? 'text-primary bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 text-transparent' : 'text-primary'}>Bid</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <CustomButton variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {notificationCount}
                </Badge>
              )}
            </CustomButton>
          </div>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 rounded-full hover:bg-muted p-1 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={theme === 'dark' ? 'bg-[#4A5BC2] text-white' : 'bg-primary/10 text-primary'}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className={`hidden md:inline ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {displayName}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              {accountId && (
                <div className="px-2 py-1">
                  <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {accountId}
                  </p>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
