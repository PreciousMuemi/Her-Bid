
import { useState } from "react";
import { Home, Users, Heart, TrendingUp, Star, MessageCircle, Settings, ChevronLeft, ChevronRight, UserCircle, Calendar, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useThemeStore } from "@/store/themeStore";

interface SidebarProps {
  activePage: string;
  onChangePage: (page: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ activePage, onChangePage, isOpen, toggleSidebar }: SidebarProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "opportunities", label: "Opportunities", icon: Briefcase, badge: 12 },
    { id: "squad", label: "Girl Squad", icon: Users, badge: 4 },
    { id: "matches", label: "Matches", icon: Heart, badge: 8 },
    { id: "bids", label: "Your Bids", icon: TrendingUp },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "messages", label: "Messages", icon: MessageCircle, badge: 3 },
    { id: "profile", label: "Profile", icon: UserCircle },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
        isDark ? 'bg-[#0A155A]/80 backdrop-blur-sm border-r border-[#303974]' : 'bg-white/80 backdrop-blur-sm border-r border-gray-200'
      } ${isOpen ? 'w-64' : 'w-16'}`}
    >
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className={`flex items-center ${isOpen ? 'p-4 justify-start' : 'p-2 justify-center'} border-b ${isDark ? 'border-[#303974]' : 'border-gray-200'}`}>
          <Avatar className={`${isDark ? 'border-[#4A5BC2]' : 'border-primary'} border-2 ${isOpen ? 'h-10 w-10' : 'h-8 w-8'}`}>
            <AvatarFallback className={`${isDark ? 'bg-indigo-400/20 text-indigo-300' : 'bg-primary/20 text-primary'}`}>
              JD
            </AvatarFallback>
          </Avatar>
          
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-foreground'}`}>Jessica Davis</p>
              <p className={`text-xs truncate ${isDark ? 'text-[#B2B9E1]' : 'text-muted-foreground'}`}>UI/UX Designer</p>
            </div>
          )}
        </div>
        
        {/* Sidebar Items */}
        <div className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          <TooltipProvider>
            <ul className="space-y-1 px-2">
              {sidebarItems.map((item) => {
                const isActive = activePage === item.id;
                
                return (
                  <li key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onChangePage(item.id)}
                          className={`flex items-center w-full ${isOpen ? 'justify-start px-4' : 'justify-center'} py-2.5 rounded-md transition-colors ${
                            isActive 
                              ? isDark 
                                ? 'bg-[#4A5BC2] text-white' 
                                : 'bg-primary text-white' 
                              : isDark 
                                ? 'text-[#B2B9E1] hover:bg-[#0A155A] hover:text-white' 
                                : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          
                          {isOpen && (
                            <span className="ml-3 truncate">{item.label}</span>
                          )}
                          
                          {isOpen && item.badge && (
                            <Badge className={`ml-auto ${
                              isDark ? 'bg-pink-400/20 text-pink-300 hover:bg-pink-400/30 border-none' : 'bg-primary/20 text-primary hover:bg-primary/30 border-none'
                            }`}>
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      </TooltipTrigger>
                      
                      {!isOpen && (
                        <TooltipContent side="right">
                          <p>{item.label}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
        </div>
        
        {/* Toggle Button */}
        <div 
          className={`p-4 border-t ${isDark ? 'border-[#303974]' : 'border-gray-200'} flex justify-${isOpen ? 'end' : 'center'}`}
        >
          <button 
            onClick={toggleSidebar}
            className={`p-2 rounded-full ${
              isDark 
                ? 'bg-[#0A155A] text-[#B2B9E1] hover:bg-[#303974] hover:text-white' 
                : 'bg-gray-100 text-muted-foreground hover:bg-primary/10 hover:text-primary'
            } transition-colors`}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
