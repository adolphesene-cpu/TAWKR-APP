import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Profil } from '@/types';
import { initialData } from '../data';
import { useData } from './DataContext'; // Import useData

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TEST_ACCOUNTS = [
  {
    id_us: 'test-admin',
    nom_us: 'Admin',
    prenom_us: '',
    email_us: 'admin@tawkr.app',
    mdp_us: 'admin123',
    fonction_us: 'Administrateur',
    profil_us: 'admin',
    notifications: [],
  },
  {
    id_us: 'test-franchise',
    nom_us: 'Franchisé',
    prenom_us: '',
    email_us: 'franchise@tawkr.app',
    mdp_us: 'franchise123',
    fonction_us: 'Franchisé',
    profil_us: 'franchise',
    notifications: [],
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('tawkr-auth-user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    return null;
  });

  const { data } = useData(); // Use data from DataContext

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('tawkr-auth-user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('tawkr-auth-user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Tenter de se connecter avec les comptes de test d'abord
    const testUser = TEST_ACCOUNTS.find(
      (acc) => acc.email_us === email && acc.mdp_us === password
    );

    if (testUser) {
      setUser(testUser);
      return { success: true };
    }

    // Si pas un compte de test, tenter de se connecter avec les données chargées
    // const foundUser = data.users.find(
    //   (u) => u.email_us === email && u.mdp_us === password
    // );

    if (!testUser) {
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }

    // setUser(foundUser);
    // return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user ? data.profils.find((p) => p.code_prof === user.profil_us)?.libelle_prof === 'Admin' : false; // Use data.profils

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
