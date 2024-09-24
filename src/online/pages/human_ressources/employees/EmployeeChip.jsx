import { Chip, Avatar } from '@mui/material';

export default function EmployeeChip({ employee }) {
  return (
    <Chip
      avatar={
        <Avatar
          alt={`${employee?.firstName} ${employee?.lastName}`}
          src={employee?.photo ? employee?.photo : '/default-placeholder.jpg'}
        />
      }
      label={`${employee?.firstName} ${employee?.lastName}`}
      variant="outlined"
    />
  );
}
