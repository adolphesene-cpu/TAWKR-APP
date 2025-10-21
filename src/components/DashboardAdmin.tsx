import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Map, MapPin, Users, UserCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { Button } from '@/components/ui/button'; // Import Button
import { Upload } from 'lucide-react'; // Import Upload icon
import CampaignValidationList from './CampaignValidationList'; // Import CampaignValidationList

const DashboardAdmin = () => {
  const { data } = useData();
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // Use isAdmin from AuthContext

  const stats = [
    {
      title: 'Franchisés',
      value: data.franchises.length,
      icon: Building2,
      route: '/franchises',
      color: 'text-primary'
    },
    {
      title: 'Campagnes',
      value: data.campagnes.length,
      icon: Map,
      route: '/campagnes',
      color: 'text-primary'
    },
    {
      title: 'Territoires',
      value: data.territoires.length,
      icon: MapPin,
      route: '/territoires',
      color: 'text-primary'
    },
    {
      title: 'Villes',
      value: data.villes.length,
      icon: MapPin,
      route: '/villes',
      color: 'text-primary'
    },
    {
      title: 'Clients',
      value: data.clients.length,
      icon: Users,
      route: '/clients',
      color: 'text-primary'
    },
    {
      title: 'Utilisateurs',
      value: data.users.length,
      icon: UserCircle,
      route: '/utilisateurs',
      color: 'text-primary'
    }
  ];

  const pendingCampagnes = data.campagnes.filter(c => c.validationStatus === 'pending');

  if (isAdmin) {
    stats.push({
      title: 'Campagnes en attente',
      value: pendingCampagnes.length,
      icon: Map,
      route: '/campaign-validation-overview',
      color: 'text-yellow-600'
    });
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord Administrateur</h1>
          <p className="text-muted-foreground">Vue d'overview complète de l'application</p>
        </div>
        {isAdmin && (
          <Button onClick={() => navigate('/import-data')} className="bg-primary hover:bg-primary-hover">
            <Upload className="h-4 w-4 mr-2" />
            Importer des données
          </Button>
        )}
      </div>

      {isAdmin && pendingCampagnes.length > 0 && (
        <div className="grid grid-cols-1 mb-8">
          <CampaignValidationList campaigns={pendingCampagnes} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="cursor-pointer hover:shadow-lg transition-all hover:border-primary"
              onClick={() => navigate(stat.route)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Dernières campagnes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.campagnes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucune campagne pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.campagnes.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id_camp}
                    className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                    onClick={() => navigate('/campagnes')}
                  >
                    <div className="font-medium">{campaign.nom_client_camp}</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.date_debut_camp} - {campaign.date_fin_camp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Franchisés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.franchises.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun franchisé pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.franchises.slice(0, 5).map((franchise) => (
                    <div
                      key={franchise.id_franch}
                      className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => navigate('/franchises')}
                    >
                      <div className="font-medium">{franchise.nom_proprio_franch}</div>
                      <div className="text-sm text-muted-foreground">
                        {franchise.prenom_proprio_franch}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Territoires
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.territoires.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun territoire pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.territoires.slice(0, 5).map((territory) => (
                    <div
                      key={territory.id_terr}
                      className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => navigate('/territoires')}
                    >
                      <div className="font-medium">{territory.nom_ville_terr}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.villes.find(v => v.id_vil === territory.id_vil)?.region_vil}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Villes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.villes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucune ville pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.villes.slice(0, 5).map((city) => (
                  <div
                    key={city.id_vil}
                    className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                    onClick={() => navigate('/villes')}
                  >
                    <div className="font-medium">{city.nom_vil}</div>
                    <div className="text-sm text-muted-foreground">
                      {city.nom_departement_vil}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.clients.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun client pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.clients.slice(0, 5).map((client) => (
                  <div
                    key={client.id_clt}
                    className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                    onClick={() => navigate('/clients')}
                  >
                    <div className="font-medium">{client.nom_clt}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.nom_clt} {/* Pas d'email dans la nouvelle interface client */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.users.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun utilisateur pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.users.slice(0, 5).map((user) => (
                    <div
                      key={user.id_us}
                      className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => navigate('/utilisateurs')}
                    >
                      <div className="font-medium">{user.nom_us} {user.prenom_us}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.profils.find(p => p.code_prof === user.profil_us)?.libelle_prof}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin;
