import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive 
}) => {
  return (
    <Link
      to={href}
      className={`
        flex items-center px-4 py-3 rounded-lg transition-colors duration-200
        ${isActive 
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-purple-600">GigeBid</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Empowering the Gig Economy</p>
      </div>
      <nav className="px-4 space-y-1">
        <SidebarItem           icon={LayoutDashboard}           label="Dashboard"           href="/dashboard"           isActive={pathname === '/dashboard'}         />        <SidebarItem           icon={Briefcase}           label="Opportunities"           href="/opportunities"           isActive={pathname === '/opportunities'}         />        <SidebarItem           icon={FileText}           label="Post Job"           href="/post-job"           isActive={pathname === '/post-job'}         />        <SidebarItem           icon={Users}           label="Collective Engine"           href="/collective-engine"           isActive={pathname === '/collective-engine'}         />        <SidebarItem           icon={DollarSign}           label="Secure Payments"           href="/secure-payments"           isActive={pathname === '/secure-payments'}         />        <SidebarItem           icon={CheckCircle}           label="Skill Verification"           href="/skill-verification"           isActive={pathname === '/skill-verification'}         />        <SidebarItem           icon={Wallet}           label="Sui Blockchain"           href="/sui"           isActive={pathname === '/sui'}         />        <SidebarItem           icon={Activity}           label="AGI Showcase"           href="/agi-showcase"           isActive={pathname === '/agi-showcase'}         />        <SidebarItem 
          icon={Database} 
          label="Database Debug" 
          href="/database-debug" 
          isActive={pathname === '/database-debug'} 
        />
        <SidebarItem 
          icon={User} 
          label="Profile" 
          href="/profile" 
          isActive={pathname === '/profile'} 
        />
        <SidebarItem 
          icon={MessageSquare} 
          label="Feedback" 
          href="/feedback" 
          isActive={pathname === '/feedback'} 
        />
        <SidebarItem 
          icon={Zap} 
          label="Demo" 
          href="/demo" 
          isActive={pathname === '/demo'} 
        />
      </nav>
    </div>
  );
};

export default Sidebar;