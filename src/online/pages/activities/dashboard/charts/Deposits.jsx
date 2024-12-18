import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';

export default function Deposits({ data, title = 'Dépôts récents' }) {
  function preventDefault(event) {
    event.preventDefault();
  }
  return (
    <React.Fragment>
      <Title>{title} {data?.date}</Title>
      <Typography component="p" variant="h4">
        {data?.value}
      </Typography>
    </React.Fragment>
  );
}
