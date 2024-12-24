import { Chip, Avatar } from '@mui/material';

export default function SupplierChip({ supplier }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={supplier?.name}
          src={supplier?.photo ? supplier?.photo : '/default-placeholder.jpg'}
        />
      }
      label={supplier?.name}
      variant="outlined"
    />
  );
}
