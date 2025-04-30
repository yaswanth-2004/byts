
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  LayoutGrid,
  User,
  Users,
  Settings,
  Search,
  X,
  ArrowRight,
  MessageSquare,
  Heart,
  BookOpen,
  Film,
  Laptop
} from "lucide-react";

const icons = {
  'home': Home,
  'message-square': MessageSquare,
  'heart': Heart,
  'book-open': BookOpen,
  'film': Film,
  'laptop': Laptop,
};

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { getCategories } = useContent();
  const categories = getCategories();
  
  useEffect(() => {
    // Close sidebar when route changes on mobile
    if (open && window.innerWidth < 1024) {
      setOpen(false);
    }
  }, [location.pathname]);
  
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-72 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-forum-400 p-1 text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-forum-400">Community</span> Forum
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="h-full py-2">
          <div className="px-3 py-2">
            <div className="mb-4">
              <h2 className="px-4 text-lg font-semibold tracking-tight">Main</h2>
              <div className="mt-2 space-y-1">
                <Button
                  asChild
                  variant={isActive('/') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/discover') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to="/discover">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Discover
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/search') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to="/search">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-semibold tracking-tight">Categories</h2>
                <Button asChild variant="link" className="text-xs text-muted-foreground">
                  <Link to="/categories">
                    View All
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <div className="mt-2 space-y-1">
                {categories.map(category => {
                  const IconComponent = icons[category.icon] || MessageSquare;
                  return (
                    <Button
                      key={category.id}
                      asChild
                      variant={isActive(`/category/${category.slug}`) ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <Link to={`/category/${category.slug}`}>
                        <IconComponent className="mr-2 h-4 w-4" />
                        {category.name}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="px-4 text-lg font-semibold tracking-tight">Account</h2>
              <div className="mt-2 space-y-1">
                <Button
                  asChild
                  variant={isActive('/profile') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/following') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to="/following">
                    <Users className="mr-2 h-4 w-4" />
                    Following
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={isActive('/settings') ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
