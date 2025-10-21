export interface City {
  Bureau: string;
  "Code INSEE": string;
  Ville: string;
  Commentaires: string;
  "Code Postal": string;
  Département: string;
  Cantons: string;
  Distance: string;
  "Temps de trajet": string;
  Région: string;
  "Taux de résidence principale": string;
  "Total Mandays disponible": string;
  "Mandays High": string;
  "Mandays Middle+": string;
  "Mandays Middle": string;
  "Mandays Social": string;
  "Disponible campagne CRF ?": string;
  "Disponible autre campagne ?": string;
  MC: string;
  Campagne: string;
  "Réservation Mois+1 (= à venir)": string;
  "MC.1": string;
  "Campagne.1": string;
  "Réservation Mois N et N-1 (= en cours et passé)": string;
  "Last sales CRF": string;
  "Last sales ACF": string;
  "Last sales MDM": string;
  "Last sales WWF": string;
  "Last sales other": string;
  "Prochaine date disponible CRF": string;
  "Prochaine date disponible ACF": string;
  "Prochaine date disponible MDM": string;
  "Prochaine date disponible WWF": string;
  "Prochaine date disponible autre campagne": string;
}

export interface Franchise {
  id: string;
  name: string;
  manager: string;
  contact: string;
  address?: string;
  cityId?: string;
  status: 'active' | 'inactive';
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  managerId?: string;
  territoryIds: string[];
  franchiseIds: string[];
  status: 'draft' | 'active' | 'completed' | 'suspended';
  validationStatus?: 'pending' | 'approved' | 'rejected'; // Added for admin validation
}

export interface Territory {
  id: string;
  code: string;
  name: string;
  region?: string;
  managerId?: string;
  franchiseId?: string;
  status: 'active' | 'inactive';
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cityId?: string;
  territoryId?: string;
  franchiseId?: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'franchise';
  status: 'active' | 'inactive';
  notifications?: Notification[]; // Added for user notifications
}

export interface Notification {
  id: string;
  type: 'campaignValidation' | 'general';
  message: string;
  read: boolean;
  timestamp: string;
}

export interface AppData {
  villes: City[];
  franchises: Franchise[];
  campagnes: Campaign[];
  territoires: Territory[];
  clients: Client[];
  utilisateurs: User[];
}
