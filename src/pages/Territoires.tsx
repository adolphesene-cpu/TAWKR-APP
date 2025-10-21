import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Territory } from '@/types';
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
    code: '',
    name: '',
    region: '',
    managerId: '',
    franchiseId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const columns: Column<Territory>[] = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Nom' },
    { key: 'region', label: 'Région' },
    {
      key: 'status',
      label: 'Statut',
      render: (territory) => (
        <Badge variant={territory.status === 'active' ? 'default' : 'secondary'}>
          {territory.status === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      )
    }
  ];

  const handleAdd = () => {
    setEditingTerritory(null);
    setFormData({
      code: '',
      name: '',
      region: '',
      managerId: '',
      franchiseId: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (territory: Territory) => {
    setEditingTerritory(territory);
    setFormData({
      code: territory.code,
      name: territory.name,
      region: territory.region || '',
      managerId: territory.managerId || '',
      franchiseId: territory.franchiseId || '',
      status: territory.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (territory: Territory) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le territoire ${territory.name} ?`)) {
      deleteTerritory(territory.id);
      toast.success('Territoire supprimé avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.name) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (editingTerritory) {
      updateTerritory(editingTerritory.id, {
        ...editingTerritory,
        ...formData
      });
      toast.success('Territoire modifié avec succès');
    } else {
      addTerritory(formData);
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
        searchKeys={['code', 'name', 'region']}
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
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Code du territoire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du territoire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="Région du territoire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="managerId">Responsable</Label>
              <Select
                value={formData.managerId}
                onValueChange={(value) => setFormData({ ...formData, managerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un responsable" />
                </SelectTrigger>
                <SelectContent>
                  {data.utilisateurs.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="franchiseId">Franchise</Label>
              <Select
                value={formData.franchiseId}
                onValueChange={(value) => setFormData({ ...formData, franchiseId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une franchise" />
                </SelectTrigger>
                <SelectContent>
                  {data.franchises.map((franchise) => (
                    <SelectItem key={franchise.id} value={franchise.id}>
                      {franchise.name}
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
              {editingTerritory ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Territoires;
