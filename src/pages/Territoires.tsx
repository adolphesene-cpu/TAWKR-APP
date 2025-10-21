import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Territory, City } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Territoires = () => {
  const { data, addTerritory, updateTerritory, deleteTerritory } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);
  const [formData, setFormData] = useState({
    nom_ville_terr: '',
    nb_logements_terr: 0,
    bx_resid_principale_terr: 0,
    tot_mandays_terr: 0,
    tot_mandays_high_terr: 0,
    tot_mandays_middle_plus_terr: 0,
    tot_mandays_midlle_terr: 0,
    tot_mandays_social_terr: 0,
    tps_trajet_bur_terr: '',
    dist_bur_terr: '',
    statut_terr: 'fermé' as 'fermé' | 'attribué' | 'en attente de validation',
    id_vil: '',
    campagne_ids: [] as string[],
  });

  const columns: Column<Territory>[] = [
    { key: 'nom_ville_terr', label: 'Nom Ville Territoire' },
    { key: 'nb_logements_terr', label: 'Nb Logements' },
    {
      key: 'id_vil',
      label: 'Ville',
      render: (territory) => data.villes.find((v) => v.id_vil === territory.id_vil)?.nom_vil || 'N/A',
    },
    {
      key: 'statut_terr',
      label: 'Statut',
      render: (territory) => (
        <Badge variant={territory.statut_terr === 'attribué' ? 'default' : 'secondary'}>
          {territory.statut_terr}
        </Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingTerritory(null);
    setFormData({
      nom_ville_terr: '',
      nb_logements_terr: 0,
      bx_resid_principale_terr: 0,
      tot_mandays_terr: 0,
      tot_mandays_high_terr: 0,
      tot_mandays_middle_plus_terr: 0,
      tot_mandays_midlle_terr: 0,
      tot_mandays_social_terr: 0,
      tps_trajet_bur_terr: '',
      dist_bur_terr: '',
      statut_terr: 'fermé',
      id_vil: '',
      campagne_ids: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (territory: Territory) => {
    setEditingTerritory(territory);
    setFormData({
      nom_ville_terr: territory.nom_ville_terr,
      nb_logements_terr: territory.nb_logements_terr,
      bx_resid_principale_terr: territory.bx_resid_principale_terr,
      tot_mandays_terr: territory.tot_mandays_terr,
      tot_mandays_high_terr: territory.tot_mandays_high_terr,
      tot_mandays_middle_plus_terr: territory.tot_mandays_middle_plus_terr,
      tot_mandays_midlle_terr: territory.tot_mandays_midlle_terr,
      tot_mandays_social_terr: territory.tot_mandays_social_terr,
      tps_trajet_bur_terr: territory.tps_trajet_bur_terr,
      dist_bur_terr: territory.dist_bur_terr,
      statut_terr: territory.statut_terr,
      id_vil: territory.id_vil,
      campagne_ids: territory.campagne_ids || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (territory: Territory) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le territoire ${territory.nom_ville_terr} ?`)) {
      deleteTerritory(territory.id_terr);
      toast.success('Territoire supprimé avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.nom_ville_terr || !formData.id_vil) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingTerritory) {
      updateTerritory(editingTerritory.id_terr, {
        ...editingTerritory,
        ...formData,
      });
      toast.success('Territoire modifié avec succès');
    } else {
      addTerritory(formData as Omit<Territory, 'id_terr'>);
      toast.success('Territoire ajouté avec succès');
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Territoires</h1>
        <p className="text-muted-foreground mt-1">Gérez vos territoires</p>
      </div>

      <DataTable
        data={data.territoires}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['nom_ville_terr', 'statut_terr']}
        addLabel="Nouveau territoire"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTerritory ? 'Modifier le territoire' : 'Nouveau territoire'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom_ville_terr">Nom Ville Territoire *</Label>
              <Input
                id="nom_ville_terr"
                value={formData.nom_ville_terr}
                onChange={(e) => setFormData({ ...formData, nom_ville_terr: e.target.value })}
                placeholder="Nom de la ville du territoire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nb_logements_terr">Nombre de logements</Label>
              <Input
                id="nb_logements_terr"
                type="number"
                value={formData.nb_logements_terr}
                onChange={(e) => setFormData({ ...formData, nb_logements_terr: parseFloat(e.target.value) })}
                placeholder="Nombre de logements"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bx_resid_principale_terr">Taux Résidence Principale</Label>
              <Input
                id="bx_resid_principale_terr"
                type="number"
                value={formData.bx_resid_principale_terr}
                onChange={(e) => setFormData({ ...formData, bx_resid_principale_terr: parseFloat(e.target.value) })}
                placeholder="Taux de résidence principale"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tot_mandays_terr">Total Mandays</Label>
              <Input
                id="tot_mandays_terr"
                type="number"
                value={formData.tot_mandays_terr}
                onChange={(e) => setFormData({ ...formData, tot_mandays_terr: parseFloat(e.target.value) })}
                placeholder="Total Mandays"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tot_mandays_high_terr">Mandays High</Label>
              <Input
                id="tot_mandays_high_terr"
                type="number"
                value={formData.tot_mandays_high_terr}
                onChange={(e) => setFormData({ ...formData, tot_mandays_high_terr: parseFloat(e.target.value) })}
                placeholder="Mandays High"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tot_mandays_middle_plus_terr">Mandays Middle+</Label>
              <Input
                id="tot_mandays_middle_plus_terr"
                type="number"
                value={formData.tot_mandays_middle_plus_terr}
                onChange={(e) => setFormData({ ...formData, tot_mandays_middle_plus_terr: parseFloat(e.target.value) })}
                placeholder="Mandays Middle+"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tot_mandays_midlle_terr">Mandays Middle</Label>
              <Input
                id="tot_mandays_midlle_terr"
                type="number"
                value={formData.tot_mandays_midlle_terr}
                onChange={(e) => setFormData({ ...formData, tot_mandays_midlle_terr: parseFloat(e.target.value) })}
                placeholder="Mandays Middle"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tot_mandays_social_terr">Mandays Social</Label>
              <Input
                id="tot_mandays_social_terr"
                type="number"
                value={formData.tot_mandays_social_terr}
                onChange={(e) => setFormData({ ...formData, tot_mandays_social_terr: parseFloat(e.target.value) })}
                placeholder="Mandays Social"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tps_trajet_bur_terr">Temps Trajet Bureau</Label>
              <Input
                id="tps_trajet_bur_terr"
                value={formData.tps_trajet_bur_terr}
                onChange={(e) => setFormData({ ...formData, tps_trajet_bur_terr: e.target.value })}
                placeholder="Temps de trajet bureau"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dist_bur_terr">Distance Bureau</Label>
              <Input
                id="dist_bur_terr"
                value={formData.dist_bur_terr}
                onChange={(e) => setFormData({ ...formData, dist_bur_terr: e.target.value })}
                placeholder="Distance bureau"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="id_vil">Ville *</Label>
              <Select
                value={formData.id_vil}
                onValueChange={(value) => setFormData({ ...formData, id_vil: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent>
                  {data.villes.map((city) => (
                    <SelectItem key={city.id_vil} value={city.id_vil}>
                      {city.nom_vil}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="statut_terr">Statut *</Label>
              <Select
                value={formData.statut_terr}
                onValueChange={(value: 'fermé' | 'attribué' | 'en attente de validation') =>
                  setFormData({ ...formData, statut_terr: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fermé">Fermé</SelectItem>
                  <SelectItem value="attribué">Attribué</SelectItem>
                  <SelectItem value="en attente de validation">En attente de validation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover">
              {editingTerritory ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Territoires;
