import { Chip, Avatar } from '@mui/material';

export default function BeneficiaryChip({ beneficiary }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={`${beneficiary?.firstName} ${beneficiary?.preferredName && beneficiary?.preferredName !== ''  ? beneficiary?.preferredName : beneficiary?.lastName}`}
          src={beneficiary?.photo ? beneficiary?.photo : '/default-placeholder.jpg'}
        />
      }
      label={`${beneficiary?.firstName} ${beneficiary?.preferredName && beneficiary?.preferredName !== ''  ? beneficiary?.preferredName : beneficiary?.lastName}`}
      variant="outlined"
    />
  );
}
