import React from 'react';
import { Chip, Avatar } from '@mui/material';

const BankAccountChip = ({ bankAccount, defaultImage = '/default-placeholder.jpg' }) => {
  if (!bankAccount) {
    return null; // Retourne rien si aucune donnée n'est fournie
  }

  return (
    <Chip
      avatar={
        <Avatar
          alt={bankAccount?.iban}
          src={bankAccount?.image || defaultImage}
        />
      }
      label={bankAccount?.iban || 'IBAN non défini'}
      variant="outlined"
    />
  );
};

export default BankAccountChip;
