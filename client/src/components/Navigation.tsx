import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, User, Settings, LogOut, PenTool } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    if (user?.lastName) return user.lastName;
    return user?.email || "User";
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Mobile optimized */}
          <Link href="/" className="flex items-center min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mr-3 shadow-sm">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900 truncate">NicheScribe AI</span>
          </Link>
          
          {/* Breadcrumb - Hidden on small screens */}
          {location !== "/" && (
            <div className="hidden sm:block text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
              {location.includes("/content-type") && "Seleziona Tipo Contenuto"}
              {location.includes("/content-input") && "Inserisci Dettagli"}
              {location.includes("/content-output") && "Contenuto Generato"}
              {location.includes("/content-suggestion") && "Suggerimenti AI"}
              {location.includes("/onboarding") && "Nuovo Progetto"}
              {location.includes("/account") && "Account"}
              {location.includes("/subscribe") && "Premium"}
            </div>
          )}
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2 sm:px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <Avatar className="w-9 h-9 ring-2 ring-slate-100">
                    <AvatarImage src={(user as any)?.profileImageUrl || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                      {getInitials((user as any)?.firstName, (user as any)?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-slate-700 font-medium max-w-32 truncate">
                    {getDisplayName()}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Il Mio Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Piani e Abbonamento
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/api/logout" className="flex items-center cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
