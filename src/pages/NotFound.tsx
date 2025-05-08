
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-university-primary to-university-secondary">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
        <h1 className="text-5xl font-bold text-university-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! The page you're looking for cannot be found.</p>
        <p className="text-gray-500 mb-8">
          The page might have been moved, deleted, or perhaps never existed.
        </p>
        <div className="space-x-4">
          <Button 
            variant="default"
            onClick={() => navigate("/")}
            className="bg-university-primary hover:bg-university-primary/90"
          >
            Return to Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
