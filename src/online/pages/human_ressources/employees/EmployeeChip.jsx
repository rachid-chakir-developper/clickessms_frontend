import { Chip, Avatar } from '@mui/material';

export default function EmployeeChip({ employee }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={`${employee?.firstName} ${employee?.preferredName && employee?.preferredName !== ''  ? employee?.preferredName : employee?.lastName}`}
          src={employee?.photo ? employee?.photo : '/default-placeholder.jpg'}
        />
      }
      label={`${employee?.firstName} ${employee?.preferredName && employee?.preferredName !== ''  ? employee?.preferredName : employee?.lastName}`}
      variant="outlined"
    />
  );
}
