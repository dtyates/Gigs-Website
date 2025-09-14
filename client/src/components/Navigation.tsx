import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Calendar, 
  Music, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Menu,
  X 
} from "lucide-react";

interface NavigationProps {
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  currentPage: "events" | "schedule" | "profile" | "admin";
  notificationCount?: number;
  onNavigate: (page: "events" | "schedule" | "profile" | "admin") => void;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navigation({ 
  user, 
  currentPage, 
  notificationCount = 0,
  onNavigate, 
  onLogin, 
  onLogout 
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "events" as const, label: "Discover", icon: Search },
    { id: "schedule" as const, label: "Schedule", icon: Calendar },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  // Add admin for demo purposes
  if (user) {
    (navigationItems as any[]).push({ id: "admin" as const, label: "Admin", icon: Settings });
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl" data-testid="text-app-logo">
              Festival Planner
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => onNavigate(item.id)}
                    className="flex items-center gap-2"
                    data-testid={`button-nav-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </>
            ) : (
              <Button onClick={onLogin} data-testid="button-login">
                Sign In
              </Button>
            )}
          </div>

          {/* User Menu & Theme Toggle */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  data-testid="button-notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      data-testid="badge-notification-count"
                    >
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </Badge>
                  )}
                </Button>

                {/* User Avatar - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback data-testid="text-user-initials">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium" data-testid="text-user-name">
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>

                {/* Navigation Items */}
                {navigationItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                    data-testid={`button-mobile-nav-${item.id}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}

                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  data-testid="button-mobile-logout"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={onLogin} className="w-full" data-testid="button-mobile-login">
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}