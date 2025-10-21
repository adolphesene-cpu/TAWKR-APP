import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Franchise, Campaign, Territory, Client, User, City } from '@/types';
import tawkrDataRaw from '@/data/tawkr-data.json';

interface DataContextType {
  data: AppData;
  updateFranchise: (id: string, franchise: Franchise) => void;
  addFranchise: (franchise: Omit<Franchise, 'id'>) => void;
  deleteFranchise: (id: string) => void;
  updateCampaign: (id: string, campaign: Campaign) => void;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  deleteCampaign: (id: string) => void;
  approveCampaign: (id: string) => void; // Added for admin validation
  rejectCampaign: (id: string) => void; // Added for admin validation
  updateTerritory: (id: string, territory: Territory) => void;
  addTerritory: (territory: Omit<Territory, 'id'>) => void;
  deleteTerritory: (id: string) => void;
  updateClient: (id: string, client: Client) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  deleteClient: (id: string) => void;
  updateUser: (id: string, user: User) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
  updateCity: (index: number, city: City) => void;
  addCity: (city: Omit<City, 'Bureau'>) => void;
  deleteCity: (index: number) => void;
  addNotification: (userId: string, message: string, type?: 'campaignValidation' | 'general') => void; // Add notification function
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'tawkr-app-data';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored data:', e);
      }
    }
    
    const rawData = tawkrDataRaw as any;
    const sampleData = rawData.sampleData || {};
    
    // Ensure existing campaigns have a default validationStatus if not set
    const initialCampaigns = (sampleData.campaigns || []).map((campaign: Campaign) => ({
      ...campaign,
      validationStatus: campaign.validationStatus || 'approved' // Default to approved
    }));

    // Ensure existing users have an empty notifications array if not set
    const initialUsers = (sampleData.users || []).map((user: User) => ({
      ...user,
      notifications: user.notifications || []
    }));

    return {
      villes: sampleData.cities || [],
      franchises: sampleData.franchises || [],
      campagnes: initialCampaigns,
      territoires: sampleData.territories || [],
      clients: sampleData.clients || [],
      utilisateurs: initialUsers,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateFranchise = (id: string, franchise: Franchise) => {
    setData(prev => ({
      ...prev,
      franchises: prev.franchises.map(f => f.id === id ? franchise : f)
    }));
  };

  const addFranchise = (franchise: Omit<Franchise, 'id'>) => {
    const newFranchise = { ...franchise, id: `f${Date.now()}` };
    setData(prev => ({
      ...prev,
      franchises: [...prev.franchises, newFranchise]
    }));
  };

  const deleteFranchise = (id: string) => {
    setData(prev => ({
      ...prev,
      franchises: prev.franchises.filter(f => f.id !== id)
    }));
  };

  const updateCampaign = (id: string, campaign: Campaign) => {
    setData(prev => ({
      ...prev,
      campagnes: prev.campagnes.map(c => c.id === id ? campaign : c)
    }));
  };

  const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = { ...campaign, id: `cpg${Date.now()}` };
    setData(prev => ({
      ...prev,
      campagnes: [...prev.campagnes, newCampaign]
    }));
  };

  const deleteCampaign = (id: string) => {
    setData(prev => ({
      ...prev,
      campagnes: prev.campagnes.filter(c => c.id !== id)
    }));
  };

  const addNotification = (userId: string, message: string, type: 'campaignValidation' | 'general' = 'general') => {
    setData(prev => ({
      ...prev,
      utilisateurs: prev.utilisateurs.map(u =>
        u.id === userId
          ? {
              ...u,
              notifications: [
                ...(u.notifications || []),
                { id: Date.now().toString(), type, message, read: false, timestamp: new Date().toISOString() }
              ]
            }
          : u
      )
    }));
  };

  const approveCampaign = (id: string) => {
    setData(prev => {
      const updatedCampaigns = prev.campagnes.map(c =>
        c.id === id ? { ...c, validationStatus: 'approved' } : c
      );
      const approvedCampaign = updatedCampaigns.find(c => c.id === id);
      if (approvedCampaign && approvedCampaign.franchiseIds.length > 0) {
        approvedCampaign.franchiseIds.forEach(franchiseId => {
          const franchiseUser = prev.utilisateurs.find(u => u.id === franchiseId && u.role === 'franchise');
          if (franchiseUser) {
            addNotification(franchiseUser.id, `Votre campagne "${approvedCampaign.name}" a été approuvée.`, 'campaignValidation');
          }
        });
      }
      return { ...prev, campagnes: updatedCampaigns };
    });
  };

  const rejectCampaign = (id: string) => {
    setData(prev => {
      const updatedCampaigns = prev.campagnes.map(c =>
        c.id === id ? { ...c, validationStatus: 'rejected' } : c
      );
      const rejectedCampaign = updatedCampaigns.find(c => c.id === id);
      if (rejectedCampaign && rejectedCampaign.franchiseIds.length > 0) {
        rejectedCampaign.franchiseIds.forEach(franchiseId => {
          const franchiseUser = prev.utilisateurs.find(u => u.id === franchiseId && u.role === 'franchise');
          if (franchiseUser) {
            addNotification(franchiseUser.id, `Votre campagne "${rejectedCampaign.name}" a été rejetée.`, 'campaignValidation');
          }
        });
      }
      return { ...prev, campagnes: updatedCampaigns };
    });
  };

  const updateTerritory = (id: string, territory: Territory) => {
    setData(prev => ({
      ...prev,
      territoires: prev.territoires.map(t => t.id === id ? territory : t)
    }));
  };

  const addTerritory = (territory: Omit<Territory, 'id'>) => {
    const newTerritory = { ...territory, id: `t${Date.now()}` };
    setData(prev => ({
      ...prev,
      territoires: [...prev.territoires, newTerritory]
    }));
  };

  const deleteTerritory = (id: string) => {
    setData(prev => ({
      ...prev,
      territoires: prev.territoires.filter(t => t.id !== id)
    }));
  };

  const updateClient = (id: string, client: Client) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? client : c)
    }));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: `cl${Date.now()}` };
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));
  };

  const deleteClient = (id: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id)
    }));
  };

  const updateUser = (id: string, user: User) => {
    setData(prev => ({
      ...prev,
      utilisateurs: prev.utilisateurs.map(u => u.id === id ? user : u)
    }));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: `u${Date.now()}` };
    setData(prev => ({
      ...prev,
      utilisateurs: [...prev.utilisateurs, newUser]
    }));
  };

  const deleteUser = (id: string) => {
    setData(prev => ({
      ...prev,
      utilisateurs: prev.utilisateurs.filter(u => u.id !== id)
    }));
  };

  const updateCity = (index: number, city: City) => {
    setData(prev => ({
      ...prev,
      villes: prev.villes.map((v, i) => i === index ? city : v)
    }));
  };

  const addCity = (city: Omit<City, 'Bureau'>) => {
    const newCity = { ...city, Bureau: `bureau-${Date.now()}` };
    setData(prev => ({
      ...prev,
      villes: [...prev.villes, newCity]
    }));
  };

  const deleteCity = (index: number) => {
    setData(prev => ({
      ...prev,
      villes: prev.villes.filter((_, i) => i !== index)
    }));
  };

  return (
    <DataContext.Provider
      value={{
        data,
        updateFranchise,
        addFranchise,
        deleteFranchise,
        updateCampaign,
        addCampaign,
        deleteCampaign,
        approveCampaign,
        rejectCampaign,
        addNotification,
        updateTerritory,
        addTerritory,
        deleteTerritory,
        updateClient,
        addClient,
        deleteClient,
        updateUser,
        addUser,
        deleteUser,
        updateCity,
        addCity,
        deleteCity
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
