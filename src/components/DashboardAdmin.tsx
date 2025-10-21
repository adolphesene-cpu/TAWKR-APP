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
      value: data.utilisateurs.length,
      icon: UserCircle,
      route: '/utilisateurs',
      color: 'text-primary'
    }
  ];

  const pendingCampaigns = data.campagnes.filter(c => c.validationStatus === 'pending');

  if (isAdmin) {
    stats.push({
      title: 'Campagnes en attente',
      value: pendingCampaigns.length,
      icon: Map,
      route: '/campaign-validation-overview',
      color: 'text-yellow-600' // Using a warning color for pending items
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

      {/* Moved CampaignValidationList into its own card for consistency and better layout */}
      {isAdmin && pendingCampaigns.length > 0 && (
        <div className="grid grid-cols-1 mb-8">
          <CampaignValidationList campaigns={pendingCampaigns} />
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
                    key={campaign.id}
                    className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                    onClick={() => navigate('/campagnes')}
                  >
                    <div className="font-medium">{campaign.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {campaign.startDate} - {campaign.endDate}
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
              Franchisés actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.franchises.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun franchisé pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.franchises
                  .filter(f => f.status === 'active')
                  .slice(0, 5)
                  .map((franchise) => (
                    <div
                      key={franchise.id}
                      className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => navigate('/franchises')}
                    >
                      <div className="font-medium">{franchise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {franchise.manager}
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
              Territoires actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.territoires.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun territoire pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.territoires
                  .filter(t => t.status === 'active')
                  .slice(0, 5)
                  .map((territory) => (
                    <div
                      key={territory.id}
                      className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => navigate('/territoires')}
                    >
                      <div className="font-medium">{territory.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {territory.region}
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
              Villes gérées
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
                    key={city["Code INSEE"]}
                    className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                    onClick={() => navigate('/villes')}
                  >
                    <div className="font-medium">{city.Ville}</div>
                    <div className="text-sm text-muted-foreground">
                      {city.Département}
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
              Clients récents
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
                    key={client.id}
                    className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                    onClick={() => navigate('/clients')}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.email}
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
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.utilisateurs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucun utilisateur pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {data.utilisateurs
                  .filter(u => u.status === 'active')
                  .slice(0, 5)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="p-3 rounded-lg bg-secondary hover:bg-accent/10 cursor-pointer transition-colors"
                      onClick={() => navigate('/utilisateurs')}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.role === 'admin' ? 'Administrateur' : 'Franchisé'}
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
