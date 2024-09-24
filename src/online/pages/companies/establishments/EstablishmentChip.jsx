import { Chip, Avatar } from '@mui/material';

export default function EstablishmentChip({ establishment }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={establishment?.name}
          src={establishment?.logo ? establishment?.logo : '/default-placeholder.jpg'}
        />
      }
      label={establishment?.name}
      variant="outlined"
    />
  );
}
