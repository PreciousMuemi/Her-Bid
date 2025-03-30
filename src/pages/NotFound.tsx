
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { CustomButton } from "@/components/ui/CustomButton";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center px-4 animate-fade-in">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl text-foreground mb-8">Oops! We couldn't find that page</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <a href="/">
          <CustomButton variant="default" size="lg">
            Return to Home
          </CustomButton>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
