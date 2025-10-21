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
    name: '',
    manager: '',
    contact: '',
    address: '',
    cityId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const columns: Column<Franchise>[] = [
    { key: 'name', label: 'Nom' },
    { key: 'manager', label: 'Responsable' },
    { key: 'contact', label: 'Contact' },
    {
      key: 'status',
      label: 'Statut',
      render: (franchise) => (
        <Badge variant={franchise.status === 'active' ? 'default' : 'secondary'}>
          {franchise.status === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      )
    }
  ];

  const handleAdd = () => {
    setEditingFranchise(null);
    setFormData({
      name: '',
      manager: '',
      contact: '',
      address: '',
      cityId: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (franchise: Franchise) => {
    setEditingFranchise(franchise);
    setFormData({
      name: franchise.name,
      manager: franchise.manager,
      contact: franchise.contact,
      address: franchise.address || '',
      cityId: franchise.cityId || '',
      status: franchise.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (franchise: Franchise) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${franchise.name} ?`)) {
      deleteFranchise(franchise.id);
      toast.success('Franchisé supprimé avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.manager || !formData.contact) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingFranchise) {
      updateFranchise(editingFranchise.id, {
        ...editingFranchise,
        ...formData
      });
      toast.success('Franchisé modifié avec succès');
    } else {
      addFranchise(formData);
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
        searchKeys={['name', 'manager', 'contact']}
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
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du franchisé"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="manager">Responsable *</Label>
              <Input
                id="manager"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                placeholder="Nom du responsable"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Email ou téléphone"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Adresse complète"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cityId">Ville</Label>
              <Select
                value={formData.cityId}
                onValueChange={(value) => setFormData({ ...formData, cityId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une ville" />
                </SelectTrigger>
                <SelectContent>
                  {data.villes.map((city) => (
                    <SelectItem key={city["Code INSEE"]} value={city["Code INSEE"]}>
                      {city.Ville}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
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
