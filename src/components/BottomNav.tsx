import { Home, Wallet, LayoutDashboard, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-t-3xl md:bottom-4">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-150 relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-lg blur-sm" />
              )}
              <Icon className={cn("h-5 w-5 relative z-10", isActive && "scale-110")} />
              <span className="text-xs font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
