import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { City } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Villes = () => {
  const { data, addCity, updateCity, deleteCity } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [editingCityIndex, setEditingCityIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    Bureau: '',
    "Code INSEE": '',
    Ville: '',
    Commentaires: '',
    "Code Postal": '',
    Département: '',
    Cantons: '',
    Distance: '',
    "Temps de trajet": '',
    Région: '',
    "Taux de résidence principale": '',
    "Total Mandays disponible": '',
    "Mandays High": '',
    "Mandays Middle+": '',
    "Mandays Middle": '',
    "Mandays Social": '',
    "Disponible campagne CRF ?": '',
    "Disponible autre campagne ?": '',
    MC: '',
    Campagne: '',
    "Réservation Mois+1 (= à venir)": '',
    "MC.1": '',
    "Campagne.1": '',
    "Réservation Mois N et N-1 (= en cours et passé)": '',
    "Last sales CRF": '',
    "Last sales ACF": '',
    "Last sales MDM": '',
    "Last sales WWF": '',
    "Last sales other": '',
    "Prochaine date disponible CRF": '',
    "Prochaine date disponible ACF": '',
    "Prochaine date disponible MDM": '',
    "Prochaine date disponible WWF": '',
    "Prochaine date disponible autre campagne": '',
    territoryId: '',
    franchiseId: '',
  });

  const columns: Column<City>[] = [
    { key: 'Ville', label: 'Ville' },
    { key: 'Département', label: 'Département' },
    { key: 'Région', label: 'Région' },
    { key: 'Code Postal', label: 'Code Postal' },
  ];

  const handleAdd = () => {
    setEditingCity(null);
    setEditingCityIndex(null);
    setFormData({
      Bureau: '',
      "Code INSEE": '',
      Ville: '',
      Commentaires: '',
      "Code Postal": '',
      Département: '',
      Cantons: '',
      Distance: '',
      "Temps de trajet": '',
      Région: '',
      "Taux de résidence principale": '',
      "Total Mandays disponible": '',
      "Mandays High": '',
      "Mandays Middle+": '',
      "Mandays Middle": '',
      "Mandays Social": '',
      "Disponible campagne CRF ?": '',
      "Disponible autre campagne ?": '',
      MC: '',
      Campagne: '',
      "Réservation Mois+1 (= à venir)": '',
      "MC.1": '',
      "Campagne.1": '',
      "Réservation Mois N et N-1 (= en cours et passé)": '',
      "Last sales CRF": '',
      "Last sales ACF": '',
      "Last sales MDM": '',
      "Last sales WWF": '',
      "Last sales other": '',
      "Prochaine date disponible CRF": '',
      "Prochaine date disponible ACF": '',
      "Prochaine date disponible MDM": '',
      "Prochaine date disponible WWF": '',
      "Prochaine date disponible autre campagne": '',
      territoryId: '',
      franchiseId: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (city: City, index: number) => {
    setEditingCity(city);
    setEditingCityIndex(index);
    setFormData({
      Bureau: city.Bureau,
      "Code INSEE": city["Code INSEE"],
      Ville: city.Ville,
      Commentaires: city.Commentaires,
      "Code Postal": city["Code Postal"],
      Département: city.Département,
      Cantons: city.Cantons,
      Distance: city.Distance,
      "Temps de trajet": city["Temps de trajet"],
      Région: city.Région,
      "Taux de résidence principale": city["Taux de résidence principale"],
      "Total Mandays disponible": city["Total Mandays disponible"],
      "Mandays High": city["Mandays High"],
      "Mandays Middle+": city["Mandays Middle+"],
      "Mandays Middle": city["Mandays Middle"],
      "Mandays Social": city["Mandays Social"],
      "Disponible campagne CRF ?": city["Disponible campagne CRF ?"],
      "Disponible autre campagne ?": city["Disponible autre campagne ?"],
      MC: city.MC,
      Campagne: city.Campagne,
      "Réservation Mois+1 (= à venir)": city["Réservation Mois+1 (= à venir)"],
      "MC.1": city["MC.1"],
      "Campagne.1": city["Campagne.1"],
      "Réservation Mois N et N-1 (= en cours et passé)": city["Réservation Mois N et N-1 (= en cours et passé)"],
      "Last sales CRF": city["Last sales CRF"],
      "Last sales ACF": city["Last sales ACF"],
      "Last sales MDM": city["Last sales MDM"],
      "Last sales WWF": city["Last sales WWF"],
      "Last sales other": city["Last sales other"],
      "Prochaine date disponible CRF": city["Prochaine date disponible CRF"],
      "Prochaine date disponible ACF": city["Prochaine date disponible ACF"],
      "Prochaine date disponible MDM": city["Prochaine date disponible MDM"],
      "Prochaine date disponible WWF": city["Prochaine date disponible WWF"],
      "Prochaine date disponible autre campagne": city["Prochaine date disponible autre campagne"],
      territoryId: (city as any).territoryId || '',
      franchiseId: (city as any).franchiseId || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (city: City, index: number) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la ville ${city.Ville} ?`)) {
      deleteCity(index);
      toast.success('Ville supprimée avec succès');
    }
  };

  const handleSubmit = () => {
    if (!formData.Ville || !formData["Code INSEE"]) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newCity: City = {
      Bureau: formData.Bureau,
      "Code INSEE": formData["Code INSEE"],
      Ville: formData.Ville,
      Commentaires: formData.Commentaires,
      "Code Postal": formData["Code Postal"],
      Département: formData.Département,
      Cantons: formData.Cantons,
      Distance: formData.Distance,
      "Temps de trajet": formData["Temps de trajet"],
      Région: formData.Région,
      "Taux de résidence principale": formData["Taux de résidence principale"],
      "Total Mandays disponible": formData["Total Mandays disponible"],
      "Mandays High": formData["Mandays High"],
      "Mandays Middle+": formData["Mandays Middle+"],
      "Mandays Middle": formData["Mandays Middle"],
      "Mandays Social": formData["Mandays Social"],
      "Disponible campagne CRF ?": formData["Disponible campagne CRF ?"],
      "Disponible autre campagne ?": formData["Disponible autre campagne ?"],
      MC: formData.MC,
      Campagne: formData.Campagne,
      "Réservation Mois+1 (= à venir)": formData["Réservation Mois+1 (= à venir)"],
      "MC.1": formData["MC.1"],
      "Campagne.1": formData["Campagne.1"],
      "Réservation Mois N et N-1 (= en cours et passé)": formData["Réservation Mois N et N-1 (= en cours et passé)"],
      "Last sales CRF": formData["Last sales CRF"],
      "Last sales ACF": formData["Last sales ACF"],
      "Last sales MDM": formData["Last sales MDM"],
      "Last sales WWF": formData["Last sales WWF"],
      "Last sales other": formData["Last sales other"],
      territoryId: formData.territoryId,
      franchiseId: formData.franchiseId,
    };

    if (editingCity && editingCityIndex !== null) {
      updateCity(editingCityIndex, newCity);
      toast.success('Ville modifiée avec succès');
    } else {
      addCity(newCity);
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
        searchKeys={['Ville', 'Département', 'Région', 'Code Postal']}
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
              <Label htmlFor="Ville">Ville *</Label>
              <Input
                id="Ville"
                value={formData.Ville}
                onChange={(e) => setFormData({ ...formData, Ville: e.target.value })}
                placeholder="Nom de la ville"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="Code INSEE">Code INSEE *</Label>
              <Input
                id="Code INSEE"
                value={formData["Code INSEE"]}
                onChange={(e) => setFormData({ ...formData, "Code INSEE": e.target.value })}
                placeholder="Code INSEE"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="Code Postal">Code Postal</Label>
              <Input
                id="Code Postal"
                value={formData["Code Postal"]}
                onChange={(e) => setFormData({ ...formData, "Code Postal": e.target.value })}
                placeholder="Code Postal"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="Département">Département</Label>
              <Input
                id="Département"
                value={formData.Département}
                onChange={(e) => setFormData({ ...formData, Département: e.target.value })}
                placeholder="Département"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="Région">Région</Label>
              <Input
                id="Région"
                value={formData.Région}
                onChange={(e) => setFormData({ ...formData, Région: e.target.value })}
                placeholder="Région"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="Commentaires">Commentaires</Label>
              <Input
                id="Commentaires"
                value={formData.Commentaires}
                onChange={(e) => setFormData({ ...formData, Commentaires: e.target.value })}
                placeholder="Commentaires"
              />
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

            {/* Additional fields for City interface */}
            <div className="grid gap-2">
              <Label htmlFor="Cantons">Cantons</Label>
              <Input
                id="Cantons"
                value={formData.Cantons}
                onChange={(e) => setFormData({ ...formData, Cantons: e.target.value })}
                placeholder="Cantons"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Distance">Distance</Label>
              <Input
                id="Distance"
                value={formData.Distance}
                onChange={(e) => setFormData({ ...formData, Distance: e.target.value })}
                placeholder="Distance"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Temps de trajet">Temps de trajet</Label>
              <Input
                id="Temps de trajet"
                value={formData["Temps de trajet"]}
                onChange={(e) => setFormData({ ...formData, "Temps de trajet": e.target.value })}
                placeholder="Temps de trajet"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Taux de résidence principale">Taux de résidence principale</Label>
              <Input
                id="Taux de résidence principale"
                value={formData["Taux de résidence principale"]}
                onChange={(e) => setFormData({ ...formData, "Taux de résidence principale": e.target.value })}
                placeholder="Taux de résidence principale"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Total Mandays disponible">Total Mandays disponible</Label>
              <Input
                id="Total Mandays disponible"
                value={formData["Total Mandays disponible"]}
                onChange={(e) => setFormData({ ...formData, "Total Mandays disponible": e.target.value })}
                placeholder="Total Mandays disponible"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Mandays High">Mandays High</Label>
              <Input
                id="Mandays High"
                value={formData["Mandays High"]}
                onChange={(e) => setFormData({ ...formData, "Mandays High": e.target.value })}
                placeholder="Mandays High"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Mandays Middle+">Mandays Middle+</Label>
              <Input
                id="Mandays Middle+"
                value={formData["Mandays Middle+"]}
                onChange={(e) => setFormData({ ...formData, "Mandays Middle+": e.target.value })}
                placeholder="Mandays Middle+"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Mandays Middle">Mandays Middle</Label>
              <Input
                id="Mandays Middle"
                value={formData["Mandays Middle"]}
                onChange={(e) => setFormData({ ...formData, "Mandays Middle": e.target.value })}
                placeholder="Mandays Middle"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Mandays Social">Mandays Social</Label>
              <Input
                id="Mandays Social"
                value={formData["Mandays Social"]}
                onChange={(e) => setFormData({ ...formData, "Mandays Social": e.target.value })}
                placeholder="Mandays Social"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Disponible campagne CRF ?">Disponible campagne CRF ?</Label>
              <Input
                id="Disponible campagne CRF ?"
                value={formData["Disponible campagne CRF ?"]}
                onChange={(e) => setFormData({ ...formData, "Disponible campagne CRF ?": e.target.value })}
                placeholder="Disponible campagne CRF ?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Disponible autre campagne ?">Disponible autre campagne ?</Label>
              <Input
                id="Disponible autre campagne ?"
                value={formData["Disponible autre campagne ?"]}
                onChange={(e) => setFormData({ ...formData, "Disponible autre campagne ?": e.target.value })}
                placeholder="Disponible autre campagne ?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="MC">MC</Label>
              <Input
                id="MC"
                value={formData.MC}
                onChange={(e) => setFormData({ ...formData, MC: e.target.value })}
                placeholder="MC"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Campagne">Campagne</Label>
              <Input
                id="Campagne"
                value={formData.Campagne}
                onChange={(e) => setFormData({ ...formData, Campagne: e.target.value })}
                placeholder="Campagne"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Réservation Mois+1 (= à venir)">Réservation Mois+1 (= à venir)</Label>
              <Input
                id="Réservation Mois+1 (= à venir)"
                value={formData["Réservation Mois+1 (= à venir)"]}
                onChange={(e) => setFormData({ ...formData, "Réservation Mois+1 (= à venir)": e.target.value })}
                placeholder="Réservation Mois+1 (= à venir)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="MC.1">MC.1</Label>
              <Input
                id="MC.1"
                value={formData["MC.1"]}
                onChange={(e) => setFormData({ ...formData, "MC.1": e.target.value })}
                placeholder="MC.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Campagne.1">Campagne.1</Label>
              <Input
                id="Campagne.1"
                value={formData["Campagne.1"]}
                onChange={(e) => setFormData({ ...formData, "Campagne.1": e.target.value })}
                placeholder="Campagne.1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Réservation Mois N et N-1 (= en cours et passé)">Réservation Mois N et N-1 (= en cours et passé)</Label>
              <Input
                id="Réservation Mois N et N-1 (= en cours et passé)"
                value={formData["Réservation Mois N et N-1 (= en cours et passé)"]}
                onChange={(e) => setFormData({ ...formData, "Réservation Mois N et N-1 (= en cours et passé)": e.target.value })}
                placeholder="Réservation Mois N et N-1 (= en cours et passé)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Last sales CRF">Last sales CRF</Label>
              <Input
                id="Last sales CRF"
                value={formData["Last sales CRF"]}
                onChange={(e) => setFormData({ ...formData, "Last sales CRF": e.target.value })}
                placeholder="Last sales CRF"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Last sales ACF">Last sales ACF</Label>
              <Input
                id="Last sales ACF"
                value={formData["Last sales ACF"]}
                onChange={(e) => setFormData({ ...formData, "Last sales ACF": e.target.value })}
                placeholder="Last sales ACF"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Last sales MDM">Last sales MDM</Label>
              <Input
                id="Last sales MDM"
                value={formData["Last sales MDM"]}
                onChange={(e) => setFormData({ ...formData, "Last sales MDM": e.target.value })}
                placeholder="Last sales MDM"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Last sales WWF">Last sales WWF</Label>
              <Input
                id="Last sales WWF"
                value={formData["Last sales WWF"]}
                onChange={(e) => setFormData({ ...formData, "Last sales WWF": e.target.value })}
                placeholder="Last sales WWF"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Last sales other">Last sales other</Label>
              <Input
                id="Last sales other"
                value={formData["Last sales other"]}
                onChange={(e) => setFormData({ ...formData, "Last sales other": e.target.value })}
                placeholder="Last sales other"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Prochaine date disponible CRF">Prochaine date disponible CRF</Label>
              <Input
                id="Prochaine date disponible CRF"
                value={formData["Prochaine date disponible CRF"]}
                onChange={(e) => setFormData({ ...formData, "Prochaine date disponible CRF": e.target.value })}
                placeholder="Prochaine date disponible CRF"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Prochaine date disponible ACF">Prochaine date disponible ACF</Label>
              <Input
                id="Prochaine date disponible ACF"
                value={formData["Prochaine date disponible ACF"]}
                onChange={(e) => setFormData({ ...formData, "Prochaine date disponible ACF": e.target.value })}
                placeholder="Prochaine date disponible ACF"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Prochaine date disponible MDM">Prochaine date disponible MDM</Label>
              <Input
                id="Prochaine date disponible MDM"
                value={formData["Prochaine date disponible MDM"]}
                onChange={(e) => setFormData({ ...formData, "Prochaine date disponible MDM": e.target.value })}
                placeholder="Prochaine date disponible MDM"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Prochaine date disponible WWF">Prochaine date disponible WWF</Label>
              <Input
                id="Prochaine date disponible WWF"
                value={formData["Prochaine date disponible WWF"]}
                onChange={(e) => setFormData({ ...formData, "Prochaine date disponible WWF": e.target.value })}
                placeholder="Prochaine date disponible WWF"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="Prochaine date disponible autre campagne">Prochaine date disponible autre campagne</Label>
              <Input
                id="Prochaine date disponible autre campagne"
                value={formData["Prochaine date disponible autre campagne"]}
                onChange={(e) => setFormData({ ...formData, "Prochaine date disponible autre campagne": e.target.value })}
                placeholder="Prochaine date disponible autre campagne"
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
