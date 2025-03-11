import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { Visibility, Download } from "@mui/icons-material";

const FileViewer = ({ title, fileUrl, fileName = "document", size="medium" }) => {
  if (!fileUrl) {
    return <p>Aucun fichier disponible.</p>;
  }

  return (
    <Box>
      {/* Bouton pour voir le fichier */}
      {title && title!=='' &&<Typography variant="h6" gutterBottom>
        {title}
      </Typography>}
      {!fileUrl ? <Typography variant="p" gutterBottom>
        Aucun fichier disponible.
      </Typography> : 
      <>
        <Tooltip title="Voir">
          <IconButton 
            component="a" 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            size={size}
          >
            <Visibility fontSize={size} />
          </IconButton>
        </Tooltip>

        {/* Bouton pour télécharger directement */}
        <Tooltip title="Télécharger">
          <IconButton
            component="a" 
            href={fileUrl} 
            target="_blank"
            download={fileName} // Ajoute l'attribut download
            size={size}
          >
            <Download fontSize={size} />
          </IconButton>
        </Tooltip>
      </>}
    </Box>
  );
};

export default FileViewer;
