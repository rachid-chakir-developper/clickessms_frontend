import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import { GET_RECAP_ENDOWMENT } from '../../../../_shared/graphql/queries/EndowmentQueries';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import styled from '@emotion/styled';
import { Devices, Edit } from '@mui/icons-material';
import AppLabel from '../../../../_shared/components/app/label/AppLabel';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EndowmentDetails() {
  let { idEndowment } = useParams();
  const [
    getEndowment,
    { loading: loadingEndowment, data: endowmentData },
  ] = useLazyQuery(GET_RECAP_ENDOWMENT);

  React.useEffect(() => {
    if (idEndowment) {
      getEndowment({ variables: { id: idEndowment } });
    }
  }, [idEndowment]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
        <Link
          to={`/online/finance/dotations/modifier/${endowmentData?.endowment?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      {endowmentData?.endowment && (
        <EndowmentDetailsPage
          endowment={endowmentData?.endowment}
        />
      )}
    </Stack>
  );
}

const EndowmentDetailsPage = ({ endowment }) => {
  const {
    id,
    number,
    name,
    image,
    coverImage,
    folder,
    barCode,
    buyingPriceHt,
    tva,
    designation,
    quantity,
    description,
    observation,
    createdAt,
    updatedAt,
  } = endowment;

  return (
    <Grid container spacing={3}>
      {/* Informations de l'employé */}
      <Grid item xs={12} sm={4}>
        <Paper
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(${coverImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 1),
          }}
        >
          <Box
            sx={{
              py: 1.2,
              px: 2,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
              boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2) inset',
            }}
          >
            <Avatar
              src={image}
              alt={name}
              sx={{
                width: 100,
                height: 100,
                boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)',
                border: '2px solid white',
              }}
            >
              <Devices />
            </Avatar>
            <Box
              sx={{
                mt: 1,
                width: '100%',
                display: 'flex',
                borderRadius: 1.5,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: (theme) => theme.palette.primary.contrastText,
              }}
            >
              <Typography variant="h5" gutterBottom>
                {name}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      {/* Autres informations de l'employé */}
      <Grid item xs={12} sm={8}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Informations supplémentaires
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">Référence: {number}</Typography>
            <Typography variant="body1">Code-barres: {barCode}</Typography>
            <Typography variant="body1">Prix d'achat HT: {buyingPriceHt} €</Typography>
            <Typography variant="body1">TVA: {tva}%</Typography>
            <Typography variant="body1">Quantité: {quantity}</Typography>
            <Typography variant="body1">Désignation: {designation}</Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              Ajouté le: {getFormatDateTime(createdAt)}
            </Typography>
            <Typography variant="body1">
              Dernière modification: {getFormatDateTime(updatedAt)}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
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
      <Grid item xs={12} sm={6}>
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
