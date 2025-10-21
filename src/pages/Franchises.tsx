import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Franchise } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Franchises = () => {
  const { data, addFranchise, updateFranchise, deleteFranchise } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFranchise, setEditingFranchise] = useState<Franchise | null>(null);
  const [formData, setFormData] = useState({
    nom_proprio_franch: '',
    prenom_proprio_franch: '',
    email_proprio_franch: '',
    localisation_franch: '',
    statut_franch: 'active' as 'active' | 'inactive',
    territory_ids: [] as string[], // Added
  });

  const columns: Column<Franchise>[] = [
    { key: 'nom_proprio_franch', label: 'Nom Propriétaire' },
    { key: 'prenom_proprio_franch', label: 'Prénom Propriétaire' },
    { key: 'email_proprio_franch', label: 'Email Propriétaire' },
    { key: 'localisation_franch', label: 'Localisation' },
    {
      key: 'statut_franch',
      label: 'Statut',
      render: (franchise) => (
        <Badge variant={franchise.statut_franch === 'active' ? 'default' : 'secondary'}>
          {franchise.statut_franch === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'territory_ids',
      label: 'Territoires Associés',
      render: (franchise) => (
        <div className="flex flex-wrap gap-1">
          {franchise.territory_ids && franchise.territory_ids.length > 0 ? (
            franchise.territory_ids.map((id) => {
              const territory = data.territoires.find((t) => t.id_terr === id);
              return territory ? <Badge key={id}>{territory.nom_ville_terr}</Badge> : null;
            })
          ) : (
            <Badge variant="secondary">Aucun</Badge>
          )}
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingFranchise(null);
    setFormData({
      nom_proprio_franch: '',
      prenom_proprio_franch: '',
      email_proprio_franch: '',
      localisation_franch: '',
      statut_franch: 'active',
      territory_ids: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (franchise: Franchise) => {
    setEditingFranchise(franchise);
    setFormData({
      nom_proprio_franch: franchise.nom_proprio_franch,
      prenom_proprio_franch: franchise.prenom_proprio_franch,
      email_proprio_franch: franchise.email_proprio_franch,
      localisation_franch: franchise.localisation_franch || '',
      statut_franch: franchise.statut_franch,
      territory_ids: franchise.territory_ids || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (franchise: Franchise) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${franchise.nom_proprio_franch} ${franchise.prenom_proprio_franch} ?`)) {
      deleteFranchise(franchise.id_franch);
      toast.success('Franchisé supprimé avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.nom_proprio_franch || !formData.prenom_proprio_franch || !formData.email_proprio_franch) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingFranchise) {
      updateFranchise(editingFranchise.id_franch, {
        ...editingFranchise,
        ...formData,
      });
      toast.success('Franchisé modifié avec succès');
    } else {
      addFranchise(formData as Omit<Franchise, 'id_franch'>);
      toast.success('Franchisé ajouté avec succès');
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Franchisés</h1>
        <p className="text-muted-foreground mt-1">Gérez vos franchisés</p>
      </div>

      <DataTable
        data={data.franchises}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['nom_proprio_franch', 'prenom_proprio_franch', 'email_proprio_franch', 'localisation_franch']}
        addLabel="Nouveau franchisé"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFranchise ? 'Modifier le franchisé' : 'Nouveau franchisé'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom_proprio_franch">Nom Propriétaire *</Label>
              <Input
                id="nom_proprio_franch"
                value={formData.nom_proprio_franch}
                onChange={(e) => setFormData({ ...formData, nom_proprio_franch: e.target.value })}
                placeholder="Nom du propriétaire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prenom_proprio_franch">Prénom Propriétaire *</Label>
              <Input
                id="prenom_proprio_franch"
                value={formData.prenom_proprio_franch}
                onChange={(e) => setFormData({ ...formData, prenom_proprio_franch: e.target.value })}
                placeholder="Prénom du propriétaire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email_proprio_franch">Email Propriétaire *</Label>
              <Input
                id="email_proprio_franch"
                value={formData.email_proprio_franch}
                onChange={(e) => setFormData({ ...formData, email_proprio_franch: e.target.value })}
                placeholder="Email du propriétaire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="localisation_franch">Localisation</Label>
              <Input
                id="localisation_franch"
                value={formData.localisation_franch}
                onChange={(e) => setFormData({ ...formData, localisation_franch: e.target.value })}
                placeholder="Localisation du franchisé"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="statut_franch">Statut</Label>
              <Select
                value={formData.statut_franch}
                onValueChange={(value: 'active' | 'inactive') =>
                  setFormData({ ...formData, statut_franch: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="territory_ids">Territoires Associés</Label>
              <Select
                value={formData.territory_ids.length > 0 ? formData.territory_ids[0] : ''} // Only display first for now
                onValueChange={(value) => setFormData({ ...formData, territory_ids: [value] })}
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
              {editingFranchise ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Franchises;
