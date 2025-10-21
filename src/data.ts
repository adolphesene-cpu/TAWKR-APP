import rawData from './data/tawkr-data.json';

export interface User {
  id_us: string;
  nom_us: string;
  prenom_us: string;
  email_us: string;
  mdp_us: string;
  fonction_us: string;
  profil_us: string; // Refers to Profil.code_prof
  notifications?: Notification[]; // Added for user notifications
}

export interface Notification {
  id: string;
  type: 'campaignValidation' | 'general';
  message: string;
  read: boolean;
  timestamp: string;
}

export interface Profil {
  code_prof: string;
  libelle_prof: 'Admin' | 'Franchisé';
}

export interface Franchise {
  id_franch: string;
  nom_proprio_franch: string;
  prenom_proprio_franch: string;
  email_proprio_franch: string;
  localisation_franch: string;
  statut_franch: string;
  territory_ids: string[]; // Added for consistency with MCD
}

export interface Territory {
  id_terr: string;
  nom_ville_terr: string;
  nb_logements_terr: number;
  bx_resid_principale_terr: number;
  tot_mandays_terr: number;
  tot_mandays_high_terr: number;
  tot_mandays_middle_plus_terr: number;
  tot_mandays_midlle_terr: number;
  tot_mandays_social_terr: number;
  tps_trajet_bur_terr: string;
  dist_bur_terr: string;
  statut_terr: 'fermé' | 'attribué' | 'en attente de validation';
  id_vil: string; // Refers to City.id_vil
  campagne_ids: string[]; // Refers to Campaign.id_camp
}

export interface City {
  id_vil: string;
  nom_vil: string;
  code_postal_vil: string;
  cantons_vil: string;
  num_departement_vil: string;
  nom_departement_vil: string;
  region_vil: string;
}

export interface Campaign {
  id_camp: string;
  nom_camp: string; // Renamed from nom_client_camp
  type_camp: 'associatif' | 'privé';
  date_debut_camp: string;
  date_fin_camp: string;
  id_clt: string; // Refers to Client.id_clt
  id_terr: string; // Refers to Territory.id_terr
  validationStatus?: 'approved' | 'pending' | 'rejected';
}

export interface Client {
  id_clt: string;
  nom_clt: string;
  statut_clt: 'actif' | 'inactif';
  duree_jachere_clt: number;
}

export interface AppData {
  users: User[];
  profils: Profil[];
  franchises: Franchise[];
  territoires: Territory[];
  villes: City[];
  campagnes: Campaign[];
  clients: Client[];
}

// Initialisation légère avec des tableaux vides
export const initialData: AppData = {
  users: [],
  profils: [
    { code_prof: 'admin', libelle_prof: 'Admin' },
    { code_prof: 'franchise', libelle_prof: 'Franchisé' },
  ],
  franchises: [],
  territoires: [],
  villes: [],
  campagnes: [],
  clients: [],
};

// Fonction pour charger les données brutes et les transformer
export const loadAndTransformData = (): AppData => {
  const rawDataTyped = rawData as any;
  const sampleData = rawDataTyped.sampleData || {};

  const initialCampaigns: Campaign[] = (sampleData.campagnes || []).map((campaign: any) => ({
    ...campaign,
    nom_camp: campaign.nom_client_camp || '',
    validationStatus: campaign.validationStatus || 'approved',
  }));

  const initialUsers: User[] = (sampleData.users || []).map((user: any) => ({
    id_us: user.id,
    nom_us: user.name || '',
    prenom_us: '', // Assuming no separate first name in raw data
    email_us: user.email,
    mdp_us: user.password,
    fonction_us: user.role || '',
    profil_us: user.role || '',
    notifications: user.notifications || [],
  }));

  const initialFranchises: Franchise[] = (sampleData.franchises || []).map((franchise: any) => ({
    ...franchise,
    territory_ids: franchise.territory_ids || [],
  }));

  return {
    users: initialUsers,
    profils: [
      { code_prof: 'admin', libelle_prof: 'Admin' },
      { code_prof: 'franchise', libelle_prof: 'Franchisé' },
    ],
    franchises: initialFranchises,
    territoires: sampleData.territories || [],
    villes: sampleData.cities || [],
    campagnes: initialCampaigns,
    clients: sampleData.clients || [],
  };
};

// Fonction pour simuler la sauvegarde des données dans le local storage
export const saveData = (data: AppData) => {
  localStorage.setItem('appData', JSON.stringify(data));
};

// Fonction pour charger les données depuis le local storage ou utiliser initialData après transformation
export const loadData = (): AppData => {
  const storedData = localStorage.getItem('appData');
  return storedData ? JSON.parse(storedData) : loadAndTransformData(); // Use loadAndTransformData here
};
