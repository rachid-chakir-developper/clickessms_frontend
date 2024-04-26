import * as React from 'react';
import {
  Avatar,
  Box,
  Card,
  Stack,
  Typography,
  IconButton,
  Divider,
  Chip,
  CardMedia,
} from '@mui/material';
import { Edit, InfoRounded, LocationOn } from '@mui/icons-material';

export default function PersonCard({ person }) {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 1,
        boxShadow: '0 1px 3px rgba(0, 127, 255, 0.1)',
        display: 'flex',
        flexDirection: {
          xs: 'column', // mobile
          sm: 'row', // tablet and up
        },
      }}
    >
      <CardMedia
        component="img"
        width="100"
        height="100"
        alt="123 Main St, Phoenix, AZ cover"
        src={person?.photo}
        sx={{
          borderRadius: 0.5,
          width: { xs: '100%', sm: 100 },
          mr: { sm: 1.5 },
          mb: { xs: 1.5, sm: 0 },
        }}
      />
      <Box sx={{ alignSelf: 'center', ml: 2 }}>
        <Typography fontWeight="bold" noWrap>
          {person?.name
            ? person?.name
            : `${person?.firstName} ${person?.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {person?.mobile && person?.mobile != '' ? `${person?.mobile} | ` : ''}
          {person?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {person?.address}
        </Typography>
      </Box>
    </Card>
  );
}
