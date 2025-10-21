import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { User, Profil } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Utilisateurs = () => {
  const { data, addUser, updateUser, deleteUser } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, 'id_us' | 'notifications' | 'mdp_us'>>({
    nom_us: '',
    prenom_us: '',
    email_us: '',
    fonction_us: '',
    profil_us: 'franchise', // Default to franchise
  });

  const columns: Column<User>[] = [
    { key: 'nom_us', label: 'Nom' },
    { key: 'prenom_us', label: 'Prénom' },
    { key: 'email_us', label: 'Email' },
    { key: 'fonction_us', label: 'Fonction' },
    {
      key: 'profil_us',
      label: 'Profil',
      render: (user) => (
        <Badge>{data.profils.find(p => p.code_prof === user.profil_us)?.libelle_prof}</Badge>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      nom_us: '',
      prenom_us: '',
      email_us: '',
      fonction_us: '',
      profil_us: 'franchise',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      nom_us: user.nom_us,
      prenom_us: user.prenom_us,
      email_us: user.email_us,
      fonction_us: user.fonction_us,
      profil_us: user.profil_us,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.nom_us} ${user.prenom_us} ?`)) {
      deleteUser(user.id_us);
      toast.success('Utilisateur supprimé avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.nom_us || !formData.prenom_us || !formData.email_us || !formData.profil_us) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // For new users, a default password might be needed or handled differently
    const userWithPassword = { ...formData, mdp_us: 'default_password' };

    if (editingUser) {
      updateUser(editingUser.id_us, {
        ...editingUser,
        ...userWithPassword,
      });
      toast.success('Utilisateur modifié avec succès');
    } else {
      addUser(userWithPassword as Omit<User, 'id_us' | 'notifications'>);
      toast.success('Utilisateur ajouté avec succès');
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">Gérez les comptes utilisateurs</p>
      </div>

      <DataTable
        data={data.users}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchKeys={['nom_us', 'prenom_us', 'email_us', 'fonction_us']}
        addLabel="Nouvel utilisateur"
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom_us">Nom *</Label>
              <Input
                id="nom_us"
                value={formData.nom_us}
                onChange={(e) => setFormData({ ...formData, nom_us: e.target.value })}
                placeholder="Nom de l'utilisateur"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prenom_us">Prénom *</Label>
              <Input
                id="prenom_us"
                value={formData.prenom_us}
                onChange={(e) => setFormData({ ...formData, prenom_us: e.target.value })}
                placeholder="Prénom de l'utilisateur"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email_us">Email *</Label>
              <Input
                id="email_us"
                type="email"
                value={formData.email_us}
                onChange={(e) => setFormData({ ...formData, email_us: e.target.value })}
                placeholder="email@exemple.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fonction_us">Fonction</Label>
              <Input
                id="fonction_us"
                value={formData.fonction_us}
                onChange={(e) => setFormData({ ...formData, fonction_us: e.target.value })}
                placeholder="Fonction de l'utilisateur"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profil_us">Profil *</Label>
              <Select
                value={formData.profil_us}
                onValueChange={(value) => setFormData({ ...formData, profil_us: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un profil" />
                </SelectTrigger>
                <SelectContent>
                  {data.profils.map((profil) => (
                    <SelectItem key={profil.code_prof} value={profil.code_prof}>
                      {profil.libelle_prof}
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
              {editingUser ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Utilisateurs;
