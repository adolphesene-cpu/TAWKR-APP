import React from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Campaign } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CampaignValidationOverview = () => {
  const { data } = useData();

  const approvedCampaigns = data.campagnes.filter(c => c.validationStatus === 'approved');
  const rejectedCampaigns = data.campagnes.filter(c => c.validationStatus === 'rejected');

  const columns: Column<Campaign>[] = [
    { key: 'name', label: 'Nom' },
    { key: 'startDate', label: 'Début' },
    { key: 'endDate', label: 'Fin' },
    {
      key: 'status',
      label: 'Statut',
      render: (campaign) => {
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
        switch (campaign.status) {
          case 'active':
            variant = 'default';
            break;
          case 'completed':
            variant = 'secondary';
            break;
          case 'suspended':
            variant = 'destructive';
            break;
          case 'draft':
            variant = 'outline';
            break;
        }
        return <Badge variant={variant}>{campaign.status}</Badge>;
      }
    },
    {
      key: 'validationStatus',
      label: 'Validation',
      render: (campaign) => {
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
        let label = '';
        switch (campaign.validationStatus) {
          case 'pending':
            variant = 'secondary';
            label = 'En attente';
            break;
          case 'approved':
            variant = 'default';
            label = 'Approuvé';
            break;
          case 'rejected':
            variant = 'destructive';
            label = 'Rejeté';
            break;
          default:
            label = 'N/A';
        }
        return <Badge variant={variant}>{label}</Badge>;
      }
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Vue d'ensemble de la validation des campagnes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campagnes approuvées ({approvedCampaigns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={approvedCampaigns}
              columns={columns}
              searchKeys={['name', 'description', 'startDate', 'endDate']}
              onAdd={undefined} // No add button on this overview
              onEdit={undefined} // No edit button on this overview
              onDelete={undefined} // No delete button on this overview
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campagnes rejetées ({rejectedCampaigns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={rejectedCampaigns}
              columns={columns}
              searchKeys={['name', 'description', 'startDate', 'endDate']}
              onAdd={undefined}
              onEdit={undefined}
              onDelete={undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignValidationOverview;
