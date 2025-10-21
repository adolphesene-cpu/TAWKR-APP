import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Comptes de test (en production, utiliser une vraie authentification)
const TEST_ACCOUNTS = [
  {
    id: '1',
    email: 'admin@tawkr.com',
    password: 'admin123',
    name: 'Administrateur',
    role: 'admin' as const,
    status: 'active' as const
  },
  {
    id: '2',
    email: 'franchise@tawkr.com',
    password: 'franchise123',
    name: 'Franchisé',
    role: 'franchise' as const,
    status: 'active' as const
  }
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

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('tawkr-auth-user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('tawkr-auth-user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Rechercher le compte correspondant
    const account = TEST_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (!account) {
      return { success: false, error: 'Email ou mot de passe incorrect' };
    }

    const { password: _, ...userWithoutPassword } = account;
    setUser(userWithoutPassword);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
