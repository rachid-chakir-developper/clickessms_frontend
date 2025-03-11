import React from 'react';
import { Chip, Avatar } from '@mui/material';

const JobPositionChip = ({ jobPosition, defaultImage = '/default-placeholder.jpg' }) => {
  if (!jobPosition) {
    return null; // Retourne rien si aucune donnée n'est fournie
  }

  return (
    <Chip
      avatar={
        <Avatar
          alt={jobPosition?.title}
          src={jobPosition?.image || defaultImage}
        />
      }
      label={jobPosition?.title || 'IBAN non défini'}
      variant="outlined"
    />
  );
};

export default JobPositionChip;
