import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs'; // Import ExcelJS
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
    reader.onload = async (e) => { // Made onload async to use await with workbook.xlsx.load
      const fileContent = e.target?.result; // fileContent can be string or ArrayBuffer

      if (selectedFile.name.endsWith('.csv')) {
        Papa.parse(fileContent as string, {
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
        try {
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(fileContent as ArrayBuffer); // ExcelJS expects ArrayBuffer
          const worksheet = workbook.worksheets[0];
          
          if (worksheet) {
            const rows: any[] = [];
            const headers: string[] = [];

            // Read header row
            worksheet.getRow(1).eachCell((cell) => {
              headers.push(String(cell.value));
            });
            setHeaderRow(headers);

            // Read data rows
            worksheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) return; // Skip header row
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = row.getCell(index + 1).value;
              });
              rows.push(obj);
            });
            setDataRows(rows);
            toast.success('Fichier Excel lu avec succès.');
          } else {
            toast.error('Le fichier Excel est vide ou ne contient pas de feuille de calcul.');
          }
        } catch (error) {
          console.error('Erreur de lecture du fichier Excel:', error);
          toast.error(`Erreur de lecture du fichier Excel: ${(error as Error).message}`);
        }
      } else {
        toast.error('Format de fichier non pris en charge. Veuillez utiliser un fichier CSV ou Excel.');
      }
    };

    if (selectedFile.name.endsWith('.csv')) {
      reader.readAsText(selectedFile);
    } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(selectedFile); // Use readAsArrayBuffer for ExcelJS
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
              nom_proprio_franch: row['Nom Propriétaire'] || '',
              prenom_proprio_franch: row['Prénom Propriétaire'] || '',
              email_proprio_franch: row['Email Propriétaire'] || '',
              localisation_franch: row.Localisation || '',
              statut_franch: (row.Statut === 'Actif' || row.Statut === 'Inactif') ? row.Statut : 'active',
              territory_ids: String(row['Territoires Associés'] || '').split(',').filter(id => id.trim() !== ''),
            };
            if (row.id_franch) {
              updateFranchise(row.id_franch, { id_franch: row.id_franch, ...franchiseData } as any);
            } else {
              addFranchise(franchiseData as any);
            }
            break;
          case 'campaign':
            const campaignData = {
              nom_camp: row['Nom Campagne'] || '',
              type_camp: (row.Type === 'Associatif' || row.Type === 'Privé') ? row.Type : 'associatif',
              date_debut_camp: row['Début'] || '',
              date_fin_camp: row['Fin'] || '',
              id_clt: row.Client || '',
              id_terr: row.Territoire || '',
              validationStatus: (['pending', 'approved', 'rejected'].includes(row.Validation)) ? row.Validation : 'approved',
            };
            if (row.id_camp) {
              updateCampaign(row.id_camp, { id_camp: row.id_camp, ...campaignData } as any);
            } else {
              addCampaign(campaignData as any);
            }
            break;
          case 'territory':
            const territoryData = {
              nom_ville_terr: row['Nom Ville Territoire'] || '',
              nb_logements_terr: parseFloat(row['Nb Logements']) || 0,
              bx_resid_principale_terr: parseFloat(row['Taux Résidence Principale']) || 0,
              tot_mandays_terr: parseFloat(row['Total Mandays']) || 0,
              tot_mandays_high_terr: parseFloat(row['Mandays High']) || 0,
              tot_mandays_middle_plus_terr: parseFloat(row['Mandays Middle+']) || 0,
              tot_mandays_midlle_terr: parseFloat(row['Mandays Middle']) || 0,
              tot_mandays_social_terr: parseFloat(row['Mandays Social']) || 0,
              tps_trajet_bur_terr: row['Temps Trajet Bureau'] || '',
              dist_bur_terr: row['Distance Bureau'] || '',
              statut_terr: (['fermé', 'attribué', 'en attente de validation'].includes(row.Statut)) ? row.Statut : 'fermé',
              id_vil: row.Ville || '',
              campagne_ids: String(row['Campagnes Associées'] || '').split(',').filter(id => id.trim() !== ''),
            };
            if (row.id_terr) {
              updateTerritory(row.id_terr, { id_terr: row.id_terr, ...territoryData } as any);
            } else {
              addTerritory(territoryData as any);
            }
            break;
          case 'client':
            const clientData = {
              nom_clt: row['Nom Client'] || '',
              statut_clt: (row.Statut === 'actif' || row.Statut === 'inactif') ? row.Statut : 'actif',
              duree_jachere_clt: parseFloat(row['Durée Jachère (jours)']) || 0,
            };
            if (row.id_clt) {
              updateClient(row.id_clt, { id_clt: row.id_clt, ...clientData } as any);
            } else {
              addClient(clientData as any);
            }
            break;
          case 'user':
            const userData = {
              nom_us: row.Nom || '',
              prenom_us: row.Prénom || '',
              email_us: row.Email || '',
              mdp_us: row['Mot de Passe'] || 'default_password',
              fonction_us: row.Fonction || '',
              profil_us: (row.Profil === 'admin' || row.Profil === 'franchise') ? row.Profil : 'franchise',
              notifications: [], // Initialiser vide
            };
            if (row.id_us) {
              updateUser(row.id_us, { id_us: row.id_us, ...userData } as any);
            } else {
              addUser(userData as any);
            }
            break;
          case 'city':
            const cityData = {
              nom_vil: row['Nom Ville'] || '',
              code_postal_vil: row['Code Postal'] || '',
              cantons_vil: row.Cantons || '',
              num_departement_vil: row['Numéro Département'] || '',
              nom_departement_vil: row['Nom Département'] || '',
              region_vil: row.Région || '',
            };
            if (row.id_vil) {
              updateCity(row.id_vil, { id_vil: row.id_vil, ...cityData } as any);
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
