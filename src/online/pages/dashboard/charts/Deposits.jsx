import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';

export default function Deposits({ data, title = 'Dépôts récents' }) {
  function preventDefault(event) {
    event.preventDefault();
  }
  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Typography component="p" variant="h4">
        {data?.spendings}
        {data?.budget}
        {data?.revenue} €
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        dans le mois de {data?.date}
      </Typography>
      {/* <div>
            <Link color="primary" href="#" onClick={preventDefault}>
              Les autres mois
            </Link>
        </div> */}
    </React.Fragment>
  );
}
