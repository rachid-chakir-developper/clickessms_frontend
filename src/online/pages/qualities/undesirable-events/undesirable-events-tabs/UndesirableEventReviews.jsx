import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function UndesirableEventReviews({undesirableEvent}) {
  return (
    <Box>
    </Box>
  );
}
