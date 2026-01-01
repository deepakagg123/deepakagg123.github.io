import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Layers, FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/hooks/use-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Publications", url: "/publications", icon: BookOpen },
  { title: "Projects", url: "/projects", icon: Layers },
  { title: "CV", url: "/cv", icon: FileText },
];

export function Sidebar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { data: profile } = useProfile();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-secondary/30 border-r border-border backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="mb-10 mt-8 md:mt-0 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 mb-4 border-2 border-primary/10 shadow-xl">
              <AvatarImage src={profile?.imageUrl || ""} alt={profile?.name} />
              <AvatarFallback className="text-xl font-display font-bold text-primary bg-primary/5">
                {profile?.name ? getInitials(profile.name) : "??"}
              </AvatarFallback>
            </Avatar>
            <h2 className="font-display text-xl font-bold text-primary">
              {profile?.name || "Loading..."}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.title || "Academic Portfolio"}
            </p>
          </div>

          <nav className="space-y-2 flex-1">
            {items.map((item) => {
              const isActive = location === item.url;
              return (
                <Link key={item.title} href={item.url}>
                  <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}>
                    <item.icon size={18} className={cn(
                      "transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {item.title}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="text-xs text-muted-foreground text-center pt-6 border-t border-border">
            &copy; {new Date().getFullYear()} {profile?.name?.split(" ")[0] || "Portfolio"}
          </div>
        </div>
      </aside>
    </>
  );
}
