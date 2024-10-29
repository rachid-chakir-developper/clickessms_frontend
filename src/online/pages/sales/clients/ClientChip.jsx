import { Chip, Avatar } from '@mui/material';

export default function ClientChip({ client }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={client?.name}
          src={client?.photo ? client?.photo : '/default-placeholder.jpg'}
        />
      }
      label={client?.name}
      variant="outlined"
    />
  );
}