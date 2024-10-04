import { Chip, Avatar } from '@mui/material';

export default function VehicleChip({ vehicle }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={`${vehicle?.name} ${vehicle?.registrationNumber}`}
          src={vehicle?.image ? vehicle?.image : '/default-placeholder.jpg'}
        />
      }
      label={`${vehicle?.name} ${vehicle?.registrationNumber}`}
      variant="outlined"
    />
  );
}
