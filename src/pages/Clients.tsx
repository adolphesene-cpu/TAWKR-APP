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
  const [formData, setFormData] = useState<Omit<Client, 'id_clt'>>({
    nom_clt: '',
    statut_clt: 'actif',
    duree_jachere_clt: 0,
  });

  const columns: Column<Client>[] = [
    { key: 'nom_clt', label: 'Nom Client' },
    {
      key: 'statut_clt',
      label: 'Statut',
      render: (client) => (
        <Badge variant={client.statut_clt === 'actif' ? 'default' : 'secondary'}>
          {client.statut_clt === 'actif' ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    { key: 'duree_jachere_clt', label: 'Durée Jachère (jours)' },
  ];

  const handleAdd = () => {
    setEditingClient(null);
    setFormData({
      nom_clt: '',
      statut_clt: 'actif',
      duree_jachere_clt: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nom_clt: client.nom_clt,
      statut_clt: client.statut_clt,
      duree_jachere_clt: client.duree_jachere_clt,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (client: Client) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.nom_clt} ?`)) {
      deleteClient(client.id_clt);
      toast.success('Client supprimé avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.nom_clt) {
      toast.error('Veuillez remplir le champ Nom Client');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id_clt, {
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
        searchKeys={['nom_clt', 'statut_clt']}
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
              <Label htmlFor="nom_clt">Nom Client *</Label>
              <Input
                id="nom_clt"
                value={formData.nom_clt}
                onChange={(e) => setFormData({ ...formData, nom_clt: e.target.value })}
                placeholder="Nom du client"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="statut_clt">Statut</Label>
              <Select
                value={formData.statut_clt}
                onValueChange={(value: 'actif' | 'inactif') =>
                  setFormData({ ...formData, statut_clt: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duree_jachere_clt">Durée Jachère (jours)</Label>
              <Input
                id="duree_jachere_clt"
                type="number"
                value={formData.duree_jachere_clt}
                onChange={(e) => setFormData({ ...formData, duree_jachere_clt: parseFloat(e.target.value) })}
                placeholder="Durée de la jachère en jours"
              />
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
