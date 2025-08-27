
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '@/store/themeStore';
import { ChevronLeft, ChevronRight, Home, Globe, Briefcase, UserRoundCog, Users, Coins, ShieldCheck, MessageSquareText, Brain } from 'lucide-react';

const AppSidebar: React.FC<{ isSidebarOpen: boolean; toggleSidebar: () => void }> = ({
  isSidebarOpen,
  toggleSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: '/dashboard',
    },
    {
      label: 'AGI Showcase',
      icon: <Brain size={20} />,
      path: '/agi-showcase',
    },
    {
      label: 'Opportunities',
      icon: <Globe size={20} />,
      path: '/opportunities',
    },
    {
      label: 'Collective Engine',
      icon: <Users size={20} />,
      path: '/collective-engine',
    },
    {
      label: 'Secure Payments',
      icon: <ShieldCheck size={20} />,
      path: '/secure-payments',
    },
    {
      label: 'Token Management',
      icon: <Coins size={20} />,
      path: '/token-management',
    },
    {
      label: 'Profile',
      icon: <UserRoundCog size={20} />,
      path: '/profile',
    },
    {
      label: 'Issuer Dashboard',
      icon: <Briefcase size={20} />,
      path: '/issuer-dashboard',
    },
    {
      label: 'Send Feedback',
      icon: <MessageSquareText size={20} />,
      path: '/feedback',
    },
  ];

  // Check if the path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`h-screen fixed top-16 bottom-0 left-0 z-40 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-16'
      } ${
        isDark
          ? 'bg-[#0A155A] border-r border-[#303974]'
          : 'bg-white border-r border-gray-200'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg ${
                      isSidebarOpen ? 'justify-start' : 'justify-center'
                    } ${
                      isActive
                        ? isDark
                          ? 'bg-[#182052] text-purple-300'
                          : 'bg-gray-100 text-purple-700'
                        : isDark
                        ? 'text-gray-200 hover:bg-[#182052]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {isSidebarOpen && (
                    <span className="ml-3 whitespace-nowrap overflow-hidden">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <button
            onClick={toggleSidebar}
            className={`flex items-center justify-center w-full p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-[#182052] text-gray-200 hover:bg-[#2b3a7c]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            {isSidebarOpen && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
