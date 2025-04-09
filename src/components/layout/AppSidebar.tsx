import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  DollarSign,
  Settings
} from "lucide-react";

const AppSidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/contracts", icon: Briefcase, label: "Contracts" },
    { path: "/bids", icon: FileText, label: "Bids" },
    { path: "/payments", icon: DollarSign, label: "Payments" },
    { path: "/team", icon: Users, label: "Team" },
    { path: "/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="w-64 border-r bg-background p-4">
      <div className="space-y-4">
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">HerBid</h2>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 rounded-md ${
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              }`}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
