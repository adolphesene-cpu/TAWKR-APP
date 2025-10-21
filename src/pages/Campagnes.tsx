import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Campaign } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const Campagnes = () => {
  const { data, addCampaign, updateCampaign, deleteCampaign } = useData();
  const { isAdmin } = useAuth(); // Get isAdmin status
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    managerId: '',
    territoryIds: [] as string[],
    franchiseIds: [] as string[],
    status: 'active' as 'draft' | 'active' | 'completed' | 'suspended',
    validationStatus: 'approved' as 'pending' | 'approved' | 'rejected', // Default for new campaigns
  });

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

  const handleAdd = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      managerId: '',
      territoryIds: [],
      franchiseIds: [],
      status: 'active',
      validationStatus: isAdmin ? 'approved' : 'pending', // Set based on role
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      managerId: campaign.managerId || '',
      territoryIds: campaign.territoryIds || [],
      franchiseIds: campaign.franchiseIds || [],
      status: campaign.status,
      validationStatus: isAdmin ? (campaign.validationStatus || 'approved') : 'pending',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (campaign: Campaign) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la campagne ${campaign.name} ?`)) {
      deleteCampaign(campaign.id);
      toast.success('Campagne supprimée avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, {
        ...editingCampaign,
        ...formData
      });
      toast.success('Campagne modifiée avec succès');
    } else {
      addCampaign(formData);
      toast.success('Campagne ajoutée avec succès');
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Campagnes</h1>
        <p className="text-muted-foreground mt-1">Gérez vos campagnes</p>
      </div>

      <DataTable
        data={data.campagnes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['name', 'description', 'startDate', 'endDate']}
        addLabel="Nouvelle campagne"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Modifier la campagne' : 'Nouvelle campagne'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom de la campagne"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la campagne"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Date de fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'active' | 'completed' | 'suspended') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover">
              {editingCampaign ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Campagnes;
