import { Chip, Avatar } from '@mui/material';

export default function GovernanceMemberChip({ governanceMember }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={`${governanceMember?.firstName} ${governanceMember?.preferredName && governanceMember?.preferredName !== ''  ? governanceMember?.preferredName : governanceMember?.lastName}`}
          src={governanceMember?.photo ? governanceMember?.photo : '/default-placeholder.jpg'}
        />
      }
      label={`${governanceMember?.firstName} ${governanceMember?.preferredName && governanceMember?.preferredName !== ''  ? governanceMember?.preferredName : governanceMember?.lastName}`}
      variant="outlined"
    />
  );
}
