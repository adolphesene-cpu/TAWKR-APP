import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Campaign } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface CampaignValidationListProps {
  campaigns: Campaign[];
}

const CampaignValidationList: React.FC<CampaignValidationListProps> = ({ campaigns }) => {
  const { updateCampaign } = useData();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleApprove = (campaignId: string) => {
    // Assuming updateCampaign can handle partial updates or you fetch the full campaign first
    const campaignToUpdate = campaigns.find(c => c.id === campaignId);
    if (campaignToUpdate) {
      updateCampaign(campaignId, { ...campaignToUpdate, validationStatus: 'approved' });
      toast.success('Campagne approuvée avec succès.');
      navigate('/campaign-validation-overview'); // Redirect after action
    }
  };

  const handleReject = (campaignId: string) => {
    const campaignToUpdate = campaigns.find(c => c.id === campaignId);
    if (campaignToUpdate) {
      updateCampaign(campaignId, { ...campaignToUpdate, validationStatus: 'rejected' });
      toast.info('Campagne rejetée.');
      navigate('/campaign-validation-overview'); // Redirect after action
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campagnes en attente de validation</CardTitle>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucune campagne en attente de validation.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la campagne</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.startDate}</TableCell>
                  <TableCell>{campaign.endDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(campaign.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(campaign.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignValidationList;
