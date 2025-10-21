import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Map, MapPin, Users, UserCircle, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Différents menus selon le rôle
  const adminNavItems = [
    { path: '/', label: 'Tableau de bord', icon: BarChart3 },
    { path: '/franchises', label: 'Franchisés', icon: Building2 },
    { path: '/campagnes', label: 'Campagnes', icon: Map },
    { path: '/territoires', label: 'Territoires', icon: MapPin },
    { path: '/villes', label: 'Villes', icon: MapPin },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: UserCircle }
  ];

  const franchiseNavItems = [
    { path: '/', label: 'Tableau de bord', icon: BarChart3 },
    { path: '/campagnes', label: 'Mes Campagnes', icon: Map },
    { path: '/territoires', label: 'Mes Territoires', icon: MapPin },
  ];

  const navItems = isAdmin ? adminNavItems : franchiseNavItems;

  return (
    <header className="bg-primary h-16 flex items-center justify-between px-6 shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-2 text-white">
        <Building2 className="h-8 w-8" />
        <span className="text-2xl font-bold">tawkr</span>
      </div>

      <nav className="flex items-center gap-1 flex-1 mx-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`text-white hover:bg-white/10 transition-colors ${
                  isActive ? 'bg-white/20' : ''
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <UserCircle className="h-5 w-5 mr-2" />
              {user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              {user?.email}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground">
              Rôle: {isAdmin ? 'Administrateur' : 'Franchisé'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
