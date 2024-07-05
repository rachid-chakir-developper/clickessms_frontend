import * as React from 'react';
import { Paper, Stack } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import styled from '@emotion/styled';
import EstablishmentItemCard from '../EstablishmentItemCard';
import EmployeeItemCard from '../../../human_ressources/employees/EmployeeItemCard';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EstablishmentInfos({establishment}) {
  return (
    <Stack>
      {establishment && (
        <EstablishmentDetailsPage
          establishment={establishment}
        />
      )}
    </Stack>
  );
}
const EstablishmentDetailsPage = ({ establishment }) => {
  const {
    description,
    observation,
    managers,
    establishmentChilds,
    establishmentParent,
  } = establishment;

  return (
    <Grid container spacing={3}>
        {managers?.length > 0 && <Grid item xs={12} sm={6}>
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                    Les responsables
                    </Typography>
                    <Paper sx={{ padding: 2 }} variant="outlined">
                    <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                        {managers?.map((manager, index) => (
                        <Grid item xs={12} sm={12} md={12} key={index}>
                            <Item>
                            <EmployeeItemCard employee={manager?.employee} />
                            </Item>
                        </Grid>
                        ))}
                    </Grid>
                    </Paper>
                </Paper>
            </Grid>
        }
        {establishmentParent && <Grid item xs={12} sm={6}>
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Structure mère
                    </Typography>
                    <Paper sx={{ padding: 2 }} variant="outlined">
                        <Item>
                        <EstablishmentItemCard establishment={establishmentParent} />
                        </Item>
                    </Paper>
                </Paper>
            </Grid>
        }
        {establishmentChilds?.length > 0 && (
        <Grid item xs={12} sm={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Les structures filles
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                {establishmentChilds?.map((establishment, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Item>
                      <EstablishmentItemCard establishment={establishment} />
                    </Item>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Paper>
        </Grid>
      )}
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {description ? description : "Aucune description pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Observation
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {observation ? observation : "Aucune observation pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
};
