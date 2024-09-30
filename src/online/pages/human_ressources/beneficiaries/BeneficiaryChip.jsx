import { Chip, Avatar } from '@mui/material';

export default function BeneficiaryChip({ beneficiary }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={`${beneficiary?.firstName} ${beneficiary?.lastName}`}
          src={beneficiary?.photo ? beneficiary?.photo : '/default-placeholder.jpg'}
        />
      }
      label={`${beneficiary?.firstName} ${beneficiary?.lastName}`}
      variant="outlined"
    />
  );
}
