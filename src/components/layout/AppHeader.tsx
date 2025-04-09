import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AppHeader = () => {
  return (
    <header className="border-b p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Issuer Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarFallback>CI</AvatarFallback>
          </Avatar>
          <Button variant="ghost" className="flex items-center">
            Contract Issuer
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
