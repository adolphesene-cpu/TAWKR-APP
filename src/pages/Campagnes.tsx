import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Campaign, Client, Territory } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Campagnes = () => {
  const { data, addCampaign, updateCampaign, deleteCampaign } = useData();
  const { isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    nom_camp: '', // Renamed from nom_client_camp
    type_camp: 'associatif' as 'associatif' | 'privé',
    date_debut_camp: '',
    date_fin_camp: '',
    id_clt: '',
    id_terr: '',
    validationStatus: 'approved' as 'pending' | 'approved' | 'rejected',
  });

  const columns: Column<Campaign>[] = [
    { key: 'nom_camp', label: 'Nom Campagne' }, // Updated label
    {
      key: 'type_camp',
      label: 'Type',
      render: (campaign) => (
        <Badge variant={campaign.type_camp === 'associatif' ? 'default' : 'secondary'}>
          {campaign.type_camp === 'associatif' ? 'Associatif' : 'Privé'}
        </Badge>
      ),
    },
    { key: 'date_debut_camp', label: 'Début' },
    { key: 'date_fin_camp', label: 'Fin' },
    {
      key: 'id_clt',
      label: 'Client',
      render: (campaign) => (
        data.clients.find((client) => client.id_clt === campaign.id_clt)?.nom_clt || 'N/A'
      ),
    },
    {
      key: 'id_terr',
      label: 'Territoire',
      render: (campaign) => (
        data.territoires.find((territory) => territory.id_terr === campaign.id_terr)?.nom_ville_terr || 'N/A'
      ),
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
      },
    },
  ];

  const handleAdd = () => {
    setEditingCampaign(null);
    setFormData({
      nom_camp: '',
      type_camp: 'associatif',
      date_debut_camp: '',
      date_fin_camp: '',
      id_clt: '',
      id_terr: '',
      validationStatus: isAdmin ? 'approved' : 'pending',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      nom_camp: campaign.nom_camp,
      type_camp: campaign.type_camp,
      date_debut_camp: campaign.date_debut_camp,
      date_fin_camp: campaign.date_fin_camp,
      id_clt: campaign.id_clt,
      id_terr: campaign.id_terr,
      validationStatus: isAdmin ? (campaign.validationStatus || 'approved') : 'pending',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (campaign: Campaign) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la campagne ${campaign.nom_camp} ?`)) {
      deleteCampaign(campaign.id_camp);
      toast.success('Campagne supprimée avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.nom_camp || !formData.date_debut_camp || !formData.date_fin_camp || !formData.id_clt || !formData.id_terr) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingCampaign) {
      updateCampaign(editingCampaign.id_camp, {
        ...editingCampaign,
        ...formData,
      });
      toast.success('Campagne modifiée avec succès');
    } else {
      addCampaign(formData as Omit<Campaign, 'id_camp'>);
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
        searchKeys={['nom_camp', 'type_camp', 'date_debut_camp', 'date_fin_camp']}
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
              <Label htmlFor="nom_camp">Nom Campagne *</Label>
              <Input
                id="nom_camp"
                value={formData.nom_camp}
                onChange={(e) => setFormData({ ...formData, nom_camp: e.target.value })}
                placeholder="Nom de la campagne"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type_camp">Type *</Label>
              <Select
                value={formData.type_camp}
                onValueChange={(value: 'associatif' | 'privé') =>
                  setFormData({ ...formData, type_camp: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="associatif">Associatif</SelectItem>
                  <SelectItem value="privé">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_debut_camp">Date de début *</Label>
                <Input
                  id="date_debut_camp"
                  type="date"
                  value={formData.date_debut_camp}
                  onChange={(e) => setFormData({ ...formData, date_debut_camp: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date_fin_camp">Date de fin *</Label>
                <Input
                  id="date_fin_camp"
                  type="date"
                  value={formData.date_fin_camp}
                  onChange={(e) => setFormData({ ...formData, date_fin_camp: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="id_clt">Client *</Label>
              <Select
                value={formData.id_clt}
                onValueChange={(value) => setFormData({ ...formData, id_clt: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {data.clients.map((client) => (
                    <SelectItem key={client.id_clt} value={client.id_clt}>
                      {client.nom_clt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="id_terr">Territoire *</Label>
              <Select
                value={formData.id_terr}
                onValueChange={(value) => setFormData({ ...formData, id_terr: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un territoire" />
                </SelectTrigger>
                <SelectContent>
                  {data.territoires.map((territory) => (
                    <SelectItem key={territory.id_terr} value={territory.id_terr}>
                      {territory.nom_ville_terr}
                    </SelectItem>
                  ))}
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
