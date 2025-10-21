import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const ImportData = () => {
  const navigate = useNavigate();
  const { addFranchise, updateFranchise, addCampaign, updateCampaign, addTerritory, updateTerritory, addClient, updateClient, addUser, updateUser, addCity, updateCity } = useData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [entityType, setEntityType] = useState<string>('');
  const [headerRow, setHeaderRow] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<any[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setHeaderRow([]);
      setDataRows([]);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile || !entityType) {
      toast.error('Veuillez sélectionner un fichier et un type d\'entité.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;

      if (selectedFile.name.endsWith('.csv')) {
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setHeaderRow(Object.keys(results.data[0]));
            setDataRows(results.data);
            toast.success('Fichier CSV lu avec succès.');
          },
          error: (error) => {
            toast.error(`Erreur de lecture du fichier CSV: ${error.message}`);
          },
        });
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        const workbook = XLSX.read(fileContent, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (json.length > 0) {
          const headers = json[0] as string[];
          const rows = json.slice(1);
          
          setHeaderRow(headers);
          setDataRows(rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          }));
          toast.success('Fichier Excel lu avec succès.');
        } else {
          toast.error('Le fichier Excel est vide.');
        }
      } else {
        toast.error('Format de fichier non pris en charge. Veuillez utiliser un fichier CSV ou Excel.');
      }
    };

    if (selectedFile.name.endsWith('.csv')) {
      reader.readAsText(selectedFile);
    } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
      reader.readAsBinaryString(selectedFile);
    }
  };

  const processData = () => {
    if (dataRows.length === 0) {
      toast.error('Aucune donnée à importer.');
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    dataRows.forEach((row) => {
      try {
        switch (entityType) {
          case 'franchise':
            const franchiseData = {
              name: row.name || '',
              manager: row.manager || '',
              contact: row.contact || '',
              address: row.address || '',
              cityId: row.cityId || '',
              status: (row.status === 'active' || row.status === 'inactive') ? row.status : 'active',
            };
            if (row.id) {
              updateFranchise(row.id, { id: row.id, ...franchiseData });
            } else {
              addFranchise(franchiseData);
            }
            break;
          case 'campaign':
            const campaignData = {
              name: row.name || '',
              description: row.description || '',
              startDate: row.startDate || '',
              endDate: row.endDate || '',
              managerId: row.managerId || '',
              territoryIds: row.territoryIds ? String(row.territoryIds).split(',') : [],
              franchiseIds: row.franchiseIds ? String(row.franchiseIds).split(',') : [],
              status: (['draft', 'active', 'completed', 'suspended'].includes(row.status)) ? row.status : 'active',
            };
            if (row.id) {
              updateCampaign(row.id, { id: row.id, ...campaignData });
            } else {
              addCampaign(campaignData);
            }
            break;
          case 'territory':
            const territoryData = {
              code: row.code || '',
              name: row.name || '',
              region: row.region || '',
              managerId: row.managerId || '',
              franchiseId: row.franchiseId || '',
              status: (row.status === 'active' || row.status === 'inactive') ? row.status : 'active',
            };
            if (row.id) {
              updateTerritory(row.id, { id: row.id, ...territoryData });
            } else {
              addTerritory(territoryData);
            }
            break;
          case 'client':
            const clientData = {
              name: row.name || '',
              email: row.email || '',
              phone: row.phone || '',
              cityId: row.cityId || '',
              territoryId: row.territoryId || '',
              franchiseId: row.franchiseId || '',
              status: (row.status === 'active' || row.status === 'inactive') ? row.status : 'active',
            };
            if (row.id) {
              updateClient(row.id, { id: row.id, ...clientData });
            } else {
              addClient(clientData);
            }
            break;
          case 'user':
            const userData = {
              name: row.name || '',
              email: row.email || '',
              role: (row.role === 'admin' || row.role === 'franchise') ? row.role : 'franchise',
              status: (row.status === 'active' || row.status === 'inactive') ? row.status : 'active',
            };
            if (row.id) {
              updateUser(row.id, { id: row.id, ...userData });
            } else {
              addUser(userData);
            }
            break;
          case 'city':
            const cityData = {
              Bureau: row.Bureau || '',
              "Code INSEE": row["Code INSEE"] || '',
              Ville: row.Ville || '',
              Commentaires: row.Commentaires || '',
              "Code Postal": row["Code Postal"] || '',
              Département: row.Département || '',
              Cantons: row.Cantons || '',
              Distance: row.Distance || '',
              "Temps de trajet": row["Temps de trajet"] || '',
              Région: row.Région || '',
              "Taux de résidence principale": row["Taux de résidence principale"] || '',
              "Total Mandays disponible": row["Total Mandays disponible"] || '',
              "Mandays High": row["Mandays High"] || '',
              "Mandays Middle+": row["Mandays Middle+"] || '',
              "Mandays Middle": row["Mandays Middle"] || '',
              "Mandays Social": row["Mandays Social"] || '',
              "Disponible campagne CRF ?": row["Disponible campagne CRF ?"] || '',
              "Disponible autre campagne ?": row["Disponible autre campagne ?"] || '',
              MC: row.MC || '',
              Campagne: row.Campagne || '',
              "Réservation Mois+1 (= à venir)": row["Réservation Mois+1 (= à venir)"] || '',
              "MC.1": row["MC.1"] || '',
              "Campagne.1": row["Campagne.1"] || '',
              "Réservation Mois N et N-1 (= en cours et passé)": row["Réservation Mois N et N-1 (= en cours et passé)"] || '',
              "Last sales CRF": row["Last sales CRF"] || '',
              "Last sales ACF": row["Last sales ACF"] || '',
              "Last sales MDM": row["Last sales MDM"] || '',
              "Last sales WWF": row["Last sales WWF"] || '',
              "Last sales other": row["Last sales other"] || '',
              "Prochaine date disponible CRF": row["Prochaine date disponible CRF"] || '',
              "Prochaine date disponible ACF": row["Prochaine date disponible ACF"] || '',
              "Prochaine date disponible MDM": row["Prochaine date disponible MDM"] || '',
              "Prochaine date disponible WWF": row["Prochaine date disponible WWF"] || '',
              "Prochaine date disponible autre campagne": row["Prochaine date disponible autre campagne"] || '',
              territoryId: row.territoryId || '',
              franchiseId: row.franchiseId || '',
            };
            // Cities don't have a simple 'id', they are identified by index for update in DataContext
            // For add, we need to ensure unique primary key if applicable, or rely on internal logic
            // For simplicity, for cities, we'll assume add always creates a new entry and update uses a custom identifier if possible
            // Given the current DataContext for cities uses index for update, we need to find the existing city to update
            const existingCityIndex = data.villes.findIndex(v => v["Code INSEE"] === row["Code INSEE"]);
            if (existingCityIndex !== -1) {
                updateCity(existingCityIndex, cityData as any);
            } else {
                addCity(cityData as any);
            }
            break;
          default:
            errorCount++;
            console.error('Type d\'entité inconnu:', entityType);
            return;
        }
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Erreur lors du traitement de la ligne: ${JSON.stringify(row)}`, error);
      }
    });

    toast.success(`Importation terminée. ${successCount} lignes traitées avec succès, ${errorCount} erreurs.`);
    switch (entityType) {
      case 'franchise':
        navigate('/franchises');
        break;
      case 'campaign':
        navigate('/campagnes');
        break;
      case 'territory':
        navigate('/territoires');
        break;
      case 'city':
        navigate('/villes');
        break;
      case 'client':
        navigate('/clients');
        break;
      case 'user':
        navigate('/utilisateurs');
        break;
      default:
        navigate('/dashboard/admin'); // Fallback
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Importer des données</h1>
        <p className="text-muted-foreground mt-1">Importez des données depuis un fichier Excel ou CSV.</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" /> Importer un fichier
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Fichier (.csv ou .xlsx)</Label>
            <Input id="file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="entity-type">Type d\'entité</Label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type d\'entité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="franchise">Franchisés</SelectItem>
                <SelectItem value="campaign">Campagnes</SelectItem>
                <SelectItem value="territory">Territoires</SelectItem>
                <SelectItem value="city">Villes</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="user">Utilisateurs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleFileUpload} disabled={!selectedFile || !entityType}>
            Charger le fichier
          </Button>

          {dataRows.length > 0 && (
            <div className="mt-4 p-4 border rounded-md bg-muted/20">
              <h3 className="font-semibold mb-2">Aperçu des données ({dataRows.length} lignes)</h3>
              <p className="text-sm text-muted-foreground">Vérifiez les 5 premières lignes et les en-têtes.</p>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      {headerRow.map((header, index) => (
                        <th scope="col" className="px-6 py-3" key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.slice(0, 5).map((row, rowIndex) => (
                      <tr key={rowIndex} className="bg-white border-b">
                        {headerRow.map((header, colIndex) => (
                          <td className="px-6 py-4" key={colIndex}>{row[header] as React.ReactNode}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button onClick={processData} className="mt-4 w-full bg-primary hover:bg-primary-hover">
                Importer les données
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportData;
