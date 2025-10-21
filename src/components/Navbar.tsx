import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Map, MapPin, Users, UserCircle, BarChart3, LogOut, Menu } from 'lucide-react';
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';

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
    { path: '/utilisateurs', label: 'Utilisateurs', icon: UserCircle },
    { path: '/profils', label: 'Profils', icon: UserCircle } // Added Profils for admin
  ];

  const franchiseNavItems = [
    { path: '/', label: 'Tableau de bord', icon: BarChart3 },
    { path: '/campagnes', label: 'Mes Campagnes', icon: Map },
    { path: '/territoires', label: 'Mes Territoires', icon: MapPin },
  ];

  const navItems = isAdmin ? adminNavItems : franchiseNavItems;

  return (
    <aside className="w-64 bg-primary text-primary-foreground h-full fixed left-0 top-0 p-4 flex flex-col shadow-lg z-50">
      <div className="flex items-center gap-2 mb-8">
        <Building2 className="h-8 w-8" />
        <span className="text-2xl font-bold">tawkr</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-primary-foreground hover:bg-primary/90 transition-colors ${
                  isActive ? 'bg-primary/80' : ''
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary/90">
              <UserCircle className="h-5 w-5 mr-2" />
              <span className="truncate">{user?.nom_us} {user?.prenom_us}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground">
              {user?.email_us}
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
    </aside>
  );
};

export default Navbar;
