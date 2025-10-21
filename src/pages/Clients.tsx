import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Client } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Clients = () => {
  const { data, addClient, updateClient, deleteClient } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cityId: '',
    territoryId: '',
    franchiseId: '',
    status: 'active' as 'active' | 'inactive'
  });

  const columns: Column<Client>[] = [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
    {
      key: 'status',
      label: 'Statut',
      render: (client) => (
        <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
          {client.status === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      )
    }
  ];

  const handleAdd = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      cityId: '',
      territoryId: '',
      franchiseId: '',
      status: 'active'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      cityId: client.cityId || '',
      territoryId: client.territoryId || '',
      franchiseId: client.franchiseId || '',
      status: client.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (client: Client) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.name} ?`)) {
      deleteClient(client.id);
      toast.success('Client supprimé avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Veuillez remplir le champ Nom');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, {
        ...editingClient,
        ...formData
      });
      toast.success('Client modifié avec succès');
    } else {
      addClient(formData);
      toast.success('Client ajouté avec succès');
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <p className="text-muted-foreground mt-1">Gérez vos clients</p>
      </div>

      <DataTable
        data={data.clients}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['name', 'email', 'phone']}
        addLabel="Nouveau client"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Modifier le client' : 'Nouveau client'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du client"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email du client"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Téléphone du client"
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
              <Label htmlFor="territoryId">Territoire</Label>
              <Select
                value={formData.territoryId}
                onValueChange={(value) => setFormData({ ...formData, territoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un territoire" />
                </SelectTrigger>
                <SelectContent>
                  {data.territoires.map((territory) => (
                    <SelectItem key={territory.id} value={territory.id}>
                      {territory.name}
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
              {editingClient ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
