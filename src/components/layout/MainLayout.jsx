
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <TopNav setSidebarOpen={setSidebarOpen} />
      
      <div className="flex">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        
        <div className="flex-1 p-4 lg:p-8">
          {!currentUser && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary">Join our community today!</h2>
                  <p className="text-muted-foreground">Sign up to participate in discussions and create content.</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link to="/login">Log In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
