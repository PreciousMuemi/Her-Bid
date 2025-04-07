
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { 
  LayoutDashboard, Users, Search, ShieldCheck, Award, 
  ChevronLeft, ChevronRight, BriefcaseBusiness, DollarSign,
  Sparkles, File, User2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CustomButton } from '@/components/ui/CustomButton';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const menuItems = [
    { 
      icon: <LayoutDashboard className="h-5 w-5" />, 
      label: 'Dashboard', 
      path: '/dashboard',
      active: location.pathname === '/dashboard' 
    },
    { 
      icon: <Search className="h-5 w-5" />, 
      label: 'Find Opportunities', 
      path: '/opportunities',
      active: location.pathname === '/opportunities'
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      label: 'Collective Engine', 
      path: '/collective-engine',
      active: location.pathname === '/collective-engine' || location.pathname === '/create-consortium'
    },
    { 
      icon: <ShieldCheck className="h-5 w-5" />, 
      label: 'Secure Payments', 
      path: '/secure-payments',
      active: location.pathname === '/secure-payments' || location.pathname === '/manage-escrow'
    },
    { 
      icon: <Award className="h-5 w-5" />, 
      label: 'Skill Verification', 
      path: '/skill-verification',
      active: location.pathname === '/skill-verification' || location.pathname === '/token-management'
    },
    { 
      icon: <BriefcaseBusiness className="h-5 w-5" />, 
      label: 'Your Contracts', 
      path: '/contracts/1',
      active: location.pathname.startsWith('/contracts')
    },
  ];
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 z-20 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } ${isDark ? 'bg-[#0A155A] border-r border-[#303974]' : 'bg-white border-r border-gray-200'}`}
    >
      <div className={`h-16 flex items-center justify-between px-4 border-b ${
        isDark ? 'border-[#303974]' : 'border-gray-200'
      }`}>
        {isSidebarOpen ? (
          <div className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span>Her</span>
            <span className={isDark ? 'text-primary' : 'text-primary'}>Bid</span>
          </div>
        ) : (
          <div className={`font-bold text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
            HB
          </div>
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
      
      <ScrollArea className="flex-grow py-4">
        <div className="px-3 py-2 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 rounded-md transition-colors ${
                item.active 
                  ? isDark 
                    ? 'bg-[#4A5BC2] text-white' 
                    : 'bg-primary/10 text-primary'
                  : isDark 
                    ? 'text-[#B2B9E1] hover:bg-[#182052] hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="flex-shrink-0">
                {item.icon}
              </span>
              {isSidebarOpen && (
                <span className={cn("ml-3 truncate text-sm", 
                  item.active ? 'font-medium' : 'font-normal'
                )}>{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
      
      <div className={`px-3 py-4 ${isDark ? 'border-t border-[#303974]' : 'border-t border-gray-200'}`}>
        <CustomButton
          className={`w-full ${!isSidebarOpen && 'px-0 justify-center'} ${
            isDark 
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0 text-white' 
              : ''
          }`}
          onClick={() => navigate('/profile')}
        >
          {isSidebarOpen ? (
            <>
              <User2 className="h-5 w-5 mr-2" /> My Profile
            </>
          ) : (
            <User2 className="h-5 w-5" />
          )}
        </CustomButton>
      </div>
    </div>
  );
};

export default AppSidebar;
