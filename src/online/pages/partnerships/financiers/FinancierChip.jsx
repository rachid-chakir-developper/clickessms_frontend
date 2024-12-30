import { Chip, Avatar } from '@mui/material';

export default function FinancierChip({ financier }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={financier?.name}
          src={financier?.photo ? financier?.photo : '/default-placeholder.jpg'}
        />
      }
      label={financier?.name}
      variant="outlined"
    />
  );
}
