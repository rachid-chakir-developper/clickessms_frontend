import { Chip, Avatar } from '@mui/material';

export default function PartnerChip({ partner }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={partner?.name}
          src={partner?.photo ? partner?.photo : '/default-placeholder.jpg'}
        />
      }
      label={partner?.name}
      variant="outlined"
    />
  );
}
