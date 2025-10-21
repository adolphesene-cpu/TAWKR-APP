import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, Franchise, Campaign, Territory, Client, User, City } from '@/types';
import { initialData, loadData, saveData, loadAndTransformData } from '../data'; // Import loadAndTransformData

interface DataContextType {
  data: AppData;
  updateFranchise: (id: string, franchise: Franchise) => void;
  addFranchise: (franchise: Omit<Franchise, 'id_franch'>) => void;
  deleteFranchise: (id: string) => void;
  updateCampaign: (id: string, campaign: Campaign) => void;
  addCampaign: (campaign: Omit<Campaign, 'id_camp'>) => void;
  deleteCampaign: (id: string) => void;
  approveCampaign: (id: string) => void; // Added for admin validation
  rejectCampaign: (id: string) => void; // Added for admin validation
  updateTerritory: (id: string, territory: Territory) => void;
  addTerritory: (territory: Omit<Territory, 'id_terr'>) => void;
  deleteTerritory: (id: string) => void;
  updateClient: (id: string, client: Client) => void;
  addClient: (client: Omit<Client, 'id_clt'>) => void;
  deleteClient: (id: string) => void;
  updateUser: (id: string, user: User) => void;
  addUser: (user: Omit<User, 'id_us'>) => void;
  deleteUser: (id: string) => void;
  updateCity: (id: string, city: City) => void;
  addCity: (city: Omit<City, 'id_vil'>) => void;
  deleteCity: (id: string) => void;
  addNotification: (userId: string, message: string, type?: 'campaignValidation' | 'general') => void; // Add notification function
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      console.log("Début du chargement des données...");
      const storedData = localStorage.getItem('appData');
      if (storedData) {
        try {
          setData(JSON.parse(storedData));
          console.log("Données chargées depuis localStorage.");
        } catch (e) {
          console.error("Erreur lors de l'analyse des données stockées, chargement depuis tawkr-data.json.", e);
          try {
            setData(loadAndTransformData());
            console.log("Données chargées et transformées depuis tawkr-data.json.");
          } catch (transformError) {
            console.error("Erreur lors de la transformation des données de tawkr-data.json:", transformError);
          }
        }
      } else {
        console.log("Aucune donnée dans localStorage, chargement depuis tawkr-data.json.");
        try {
          // Simuler un délai de chargement pour les tests (à retirer en production)
          // await new Promise(resolve => setTimeout(resolve, 1000));
          setData(loadAndTransformData());
          console.log("Données chargées et transformées depuis tawkr-data.json.");
        } catch (transformError) {
          console.error("Erreur lors de la transformation des données de tawkr-data.json:", transformError);
        }
      }
      console.log("Fin du chargement des données, mise à jour de l'état de chargement.");
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log("Sauvegarde des données dans localStorage.");
      saveData(data);
    }
  }, [data, loading]);

  const updateFranchise = (id: string, franchise: Franchise) => {
    setData(prev => ({
      ...prev,
      franchises: prev.franchises.map(f => f.id_franch === id ? franchise : f)
    }));
  };

  const addFranchise = (franchise: Omit<Franchise, 'id_franch'>) => {
    const newFranchise = { ...franchise, id_franch: `f${Date.now()}` };
    setData(prev => ({
      ...prev,
      franchises: [...prev.franchises, newFranchise]
    }));
  };

  const deleteFranchise = (id: string) => {
    setData(prev => ({
      ...prev,
      franchises: prev.franchises.filter(f => f.id_franch !== id)
    }));
  };

  const updateCampaign = (id: string, campaign: Campaign) => {
    setData(prev => ({
      ...prev,
      campagnes: prev.campagnes.map(c => c.id_camp === id ? campaign : c)
    }));
  };

  const addCampaign = (campaign: Omit<Campaign, 'id_camp'>) => {
    const newCampaign = { ...campaign, id_camp: `c${Date.now()}` };
    setData(prev => ({
      ...prev,
      campagnes: [...prev.campagnes, newCampaign]
    }));
  };

  const deleteCampaign = (id: string) => {
    setData(prev => ({
      ...prev,
      campagnes: prev.campagnes.filter(c => c.id_camp !== id)
    }));
  };

  const approveCampaign = (id: string) => {
    setData(prev => ({
      ...prev,
      campagnes: prev.campagnes.map(campaign =>
        campaign.id_camp === id ? { ...campaign, validationStatus: 'approved' } : campaign
      )
    }));
  };

  const rejectCampaign = (id: string) => {
    setData(prev => ({
      ...prev,
      campagnes: prev.campagnes.map(campaign =>
        campaign.id_camp === id ? { ...campaign, validationStatus: 'rejected' } : campaign
      )
    }));
  };

  const updateTerritory = (id: string, territory: Territory) => {
    setData(prev => ({
      ...prev,
      territoires: prev.territoires.map(t => t.id_terr === id ? territory : t)
    }));
  };

  const addTerritory = (territory: Omit<Territory, 'id_terr'>) => {
    const newTerritory = { ...territory, id_terr: `t${Date.now()}` };
    setData(prev => ({
      ...prev,
      territoires: [...prev.territoires, newTerritory]
    }));
  };

  const deleteTerritory = (id: string) => {
    setData(prev => ({
      ...prev,
      territoires: prev.territoires.filter(t => t.id_terr !== id)
    }));
  };

  const updateClient = (id: string, client: Client) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id_clt === id ? client : c)
    }));
  };

  const addClient = (client: Omit<Client, 'id_clt'>) => {
    const newClient = { ...client, id_clt: `cl${Date.now()}` };
    setData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));
  };

  const deleteClient = (id: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id_clt !== id)
    }));
  };

  const updateUser = (id: string, user: User) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id_us === id ? user : u)
    }));
  };

  const addUser = (user: Omit<User, 'id_us'>) => {
    const newUser = { ...user, id_us: `u${Date.now()}` };
    setData(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  };

  const deleteUser = (id: string) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id_us !== id)
    }));
  };

  const updateCity = (id: string, city: City) => {
    setData(prev => ({
      ...prev,
      villes: prev.villes.map(c => c.id_vil === id ? city : c)
    }));
  };

  const addCity = (city: Omit<City, 'id_vil'>) => {
    const newCity = { ...city, id_vil: `v${Date.now()}` };
    setData(prev => ({
      ...prev,
      villes: [...prev.villes, newCity]
    }));
  };

  const deleteCity = (id: string) => {
    setData(prev => ({
      ...prev,
      villes: prev.villes.filter(c => c.id_vil !== id)
    }));
  };

  const addNotification = (userId: string, message: string, type: 'campaignValidation' | 'general' = 'general') => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id_us === userId
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-2xl font-semibold">Chargement des données...</div>; // Show loading state
  }

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
        deleteCity,
        addNotification
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
