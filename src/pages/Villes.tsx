import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { City } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Villes = () => {
  const { data, addCity, updateCity, deleteCity } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState<Omit<City, 'id_vil'>>({
    nom_vil: '',
    code_postal_vil: '',
    cantons_vil: '',
    num_departement_vil: '',
    nom_departement_vil: '',
    region_vil: '',
  });

  const columns: Column<City>[] = [
    { key: 'nom_vil', label: 'Nom Ville' },
    { key: 'code_postal_vil', label: 'Code Postal' },
    { key: 'cantons_vil', label: 'Cantons' },
    { key: 'nom_departement_vil', label: 'Nom Département' },
    { key: 'region_vil', label: 'Région' },
  ];

  const handleAdd = () => {
    setEditingCity(null);
    setFormData({
      nom_vil: '',
      code_postal_vil: '',
      cantons_vil: '',
      num_departement_vil: '',
      nom_departement_vil: '',
      region_vil: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      nom_vil: city.nom_vil,
      code_postal_vil: city.code_postal_vil,
      cantons_vil: city.cantons_vil,
      num_departement_vil: city.num_departement_vil,
      nom_departement_vil: city.nom_departement_vil,
      region_vil: city.region_vil,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (city: City) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la ville ${city.nom_vil} ?`)) {
      deleteCity(city.id_vil);
      toast.success('Ville supprimée avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.nom_vil || !formData.code_postal_vil) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingCity) {
      updateCity(editingCity.id_vil, {
        ...editingCity,
        ...formData
      });
      toast.success('Ville modifiée avec succès');
    } else {
      addCity(formData);
      toast.success('Ville ajoutée avec succès');
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Villes</h1>
        <p className="text-muted-foreground mt-1">Gérez vos villes</p>
      </div>

      <DataTable
        data={data.villes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['nom_vil', 'code_postal_vil', 'nom_departement_vil', 'region_vil']}
        addLabel="Nouvelle ville"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCity ? 'Modifier la ville' : 'Nouvelle ville'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom_vil">Nom Ville *</Label>
              <Input
                id="nom_vil"
                value={formData.nom_vil}
                onChange={(e) => setFormData({ ...formData, nom_vil: e.target.value })}
                placeholder="Nom de la ville"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="code_postal_vil">Code Postal *</Label>
              <Input
                id="code_postal_vil"
                value={formData.code_postal_vil}
                onChange={(e) => setFormData({ ...formData, code_postal_vil: e.target.value })}
                placeholder="Code Postal"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cantons_vil">Cantons</Label>
              <Input
                id="cantons_vil"
                value={formData.cantons_vil}
                onChange={(e) => setFormData({ ...formData, cantons_vil: e.target.value })}
                placeholder="Cantons"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="num_departement_vil">Numéro Département</Label>
              <Input
                id="num_departement_vil"
                value={formData.num_departement_vil}
                onChange={(e) => setFormData({ ...formData, num_departement_vil: e.target.value })}
                placeholder="Numéro du département"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nom_departement_vil">Nom Département</Label>
              <Input
                id="nom_departement_vil"
                value={formData.nom_departement_vil}
                onChange={(e) => setFormData({ ...formData, nom_departement_vil: e.target.value })}
                placeholder="Nom du département"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region_vil">Région</Label>
              <Input
                id="region_vil"
                value={formData.region_vil}
                onChange={(e) => setFormData({ ...formData, region_vil: e.target.value })}
                placeholder="Région"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-hover">
              {editingCity ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Villes;
