import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Users, TrendingUp, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BellRing, MailOpen } from 'lucide-react'; // Import icons for notifications
import { Button } from '@/components/ui/button';

const DashboardFranchise = () => {
  const { data, updateUser } = useData(); // Destructure updateUser
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filtrer les données pour le franchisé connecté
  const myCampaigns = data.campagnes.filter(c => c.franchiseIds.includes(user?.id || ''));
  const myTerritories = data.territoires.filter(t => t.franchiseId === user?.id);
  
  const currentUser = data.utilisateurs.find(u => u.id === user?.id);
  const unreadNotifications = currentUser?.notifications?.filter(n => !n.read) || [];

  const handleMarkAllAsRead = () => {
    if (currentUser) {
      const updatedNotifications = currentUser.notifications?.map(n => ({ ...n, read: true })) || [];
      updateUser(currentUser.id, { ...currentUser, notifications: updatedNotifications });
    }
  };

  const stats = [
    {
      title: 'Mes Campagnes',
      value: myCampaigns.length,
      icon: Map,
      route: '/campagnes',
      color: 'text-primary'
    },
    {
      title: 'Mes Territoires',
      value: myTerritories.length,
      icon: Building2,
      route: '/territoires',
      color: 'text-primary'
    },
    {
      title: 'Notifications non lues',
      value: unreadNotifications.length,
      icon: BellRing,
      route: '/dashboard/franchise',
      color: unreadNotifications.length > 0 ? 'text-red-500' : 'text-gray-500'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tableau de bord Franchisé
        </h1>
        <p className="text-muted-foreground">Bienvenue, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              Mes dernières campagnes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myCampaigns.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucune campagne pour le moment
              </p>
            ) : (
              <div className="space-y-2">
                {myCampaigns.slice(0, 5).map((campaign) => (
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
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Mes notifications
            </CardTitle>
            {unreadNotifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <MailOpen className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {unreadNotifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucune notification non lue.
              </p>
            ) : (
              <div className="space-y-2">
                {unreadNotifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 rounded-lg bg-secondary hover:bg-accent/10 transition-colors"
                  >
                    <div className="font-medium">{notification.message}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
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

export default DashboardFranchise;
