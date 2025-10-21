import React from 'react';
import { useData } from '@/contexts/DataContext';
import DataTable, { Column } from '@/components/DataTable';
import { Profil } from '@/types';

const Profils = () => {
  const { data } = useData();

  const columns: Column<Profil>[] = [
    { key: 'code_prof', label: 'Code Profil' },
    { key: 'libelle_prof', label: 'Libellé Profil' },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profils</h1>
        <p className="text-muted-foreground mt-1">Affichez les profils d'utilisateurs</p>
      </div>

      <DataTable
        data={data.profils}
        columns={columns}
        searchKeys={['code_prof', 'libelle_prof']}
      />
    </div>
  );
};

export default Profils;
