import { Card, CardContent, Avatar, Typography } from '@mui/material';

const OrganizationCard = ({employee , color}) => {
  const { firstName, preferredName, lastName, role, photo } = employee
  const name = `${firstName} ${preferredName && preferredName !== ''  ? preferredName : lastName}`
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: color,
        minWidth: 150,
        maxWidth: 200,
        margin: 'auto',
        backgroundColor: '#fff',
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Avatar
          alt={name}
          src={photo}
          sx={{ width: 48, height: 48, margin: '0 auto 8px' }}
        />
        <Typography variant="subtitle1" fontWeight="bold">
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {role}
        </Typography>
      </CardContent>
    </Card>
  )
};

export default OrganizationCard;
