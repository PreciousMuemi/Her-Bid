
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { useHedera } from '@/contexts/HederaContext';
import { 
  LayoutDashboard, Users, Briefcase, ShieldCheck, Award, 
  Settings, LogOut, ChevronLeft, ChevronRight, HelpCircle,
  Building2, Moon, Sun
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomButton } from '@/components/ui/CustomButton';
import { toast } from 'sonner';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const { theme, setTheme } = useThemeStore();
  const { disconnectFromHedera } = useHedera();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  
  const handleDisconnect = () => {
    disconnectFromHedera();
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully');
    navigate('/');
  };
  
  const menuItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: 'Dashboard', 
      path: '/dashboard',
      active: location.pathname === '/dashboard' 
    },
    { 
      icon: <Building2 className="h-5 w-5" />, 
      label: 'Profile', 
      path: '/profile',
      active: location.pathname === '/profile'
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: 'Team Up', 
      path: '/create-consortium',
      active: location.pathname === '/create-consortium'
    },
    { 
      icon: <Briefcase className="h-5 w-5" />, 
      label: 'Contracts', 
      path: '/contracts',
      active: location.pathname === '/contracts'
    },
    { 
      icon: <ShieldCheck className="h-5 w-5" />, 
      label: 'Secure Payments', 
      path: '/manage-escrow',
      active: location.pathname === '/manage-escrow'
    },
    { 
      icon: <Award className="h-5 w-5" />, 
      label: 'Business Reputation', 
      path: '/token-management',
      active: location.pathname === '/token-management'
    },
  ];
  
  const bottomMenuItems = [
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: 'Settings', 
      path: '/settings',
      active: location.pathname === '/settings'
    },
    { 
      icon: <HelpCircle className="h-5 w-5" />, 
      label: 'Help & Support', 
      path: '/help',
      active: location.pathname === '/help'
    }
  ];
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-20 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } ${isDark ? 'bg-[#0A155A] border-r border-[#303974]' : 'bg-white border-r border-gray-200'}`}
    >
      <div className={`h-16 flex items-center justify-between px-4 ${
        isDark ? 'border-b border-[#303974]' : 'border-b border-gray-200'
      }`}>
        {isSidebarOpen ? (
          <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            HerBid
          </span>
        ) : (
          <span className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            HB
          </span>
        )}
        <button 
          onClick={toggleSidebar}
          className={`p-1 rounded-md ${
            isDark ? 'text-[#B2B9E1] hover:text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      
      <ScrollArea className="flex-grow py-2">
        <div className="px-3 py-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'} py-2 my-1 rounded-md ${
                item.active 
                  ? isDark 
                    ? 'bg-[#4A5BC2] text-white' 
                    : 'bg-primary/10 text-primary'
                  : isDark 
                    ? 'text-[#B2B9E1] hover:bg-[#182052] hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="flex-shrink-0">
                {item.icon}
              </span>
              {isSidebarOpen && (
                <span className="ml-3 truncate">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
      
      <div className={`px-3 py-3 ${isDark ? 'border-t border-[#303974]' : 'border-t border-gray-200'}`}>
        {bottomMenuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'} py-2 my-1 rounded-md ${
              item.active 
                ? isDark 
                  ? 'bg-[#4A5BC2] text-white' 
                  : 'bg-primary/10 text-primary'
                : isDark 
                  ? 'text-[#B2B9E1] hover:bg-[#182052] hover:text-white' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <span className="flex-shrink-0">
              {item.icon}
            </span>
            {isSidebarOpen && (
              <span className="ml-3 truncate">{item.label}</span>
            )}
          </button>
        ))}
        
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'} py-2 my-1 rounded-md ${
            isDark 
              ? 'text-[#B2B9E1] hover:bg-[#182052] hover:text-white' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <span className="flex-shrink-0">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </span>
          {isSidebarOpen && (
            <span className="ml-3 truncate">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>
        
        <button
          onClick={handleDisconnect}
          className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'} py-2 my-1 rounded-md ${
            isDark 
              ? 'text-[#B2B9E1] hover:bg-red-500/20 hover:text-red-300' 
              : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          <span className="flex-shrink-0">
            <LogOut className="h-5 w-5" />
          </span>
          {isSidebarOpen && (
            <span className="ml-3 truncate">Log Out</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
