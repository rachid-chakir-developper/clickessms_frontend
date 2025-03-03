import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { END_POINT } from '../../../../../ApolloProvider';

export default function TableExportButton(props) {
  const {title = 'Exporter', entity, fileName, fields, titles} = props
  const exportData = async () => {
  
    try {
      const token = JSON.parse(localStorage.getItem('token')) || '';
      const response = await fetch(`${END_POINT}/export-data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`,
        },
        body: JSON.stringify({
          entity: entity,
          file_name: fileName,
          fields: fields,
          titles: titles,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la génération du fichier');
      }
  
      // Créer un lien pour télécharger le fichier Excel
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName ? fileName : entity}_data.xlsx`); // Nom du fichier
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Optionnel : fermer l'onglet après le téléchargement
      setTimeout(() => {
        window.close();
      }, 1000); // Attendre 1 seconde avant de fermer
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  
  return (
    <Tooltip title={title}>
      <IconButton onClick={exportData}>
        <FileDownload/>
      </IconButton>
    </Tooltip>
  );
}
