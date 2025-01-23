import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha, Typography, Grid, Avatar, List } from '@mui/material';
import styled from '@emotion/styled';
import { Devices, Edit } from '@mui/icons-material';
import { GET_RECAP_ENDOWMENT } from '../../../../_shared/graphql/queries/EndowmentQueries';
import { getFormatDate, getFormatDateTime, getGenderLabel } from '../../../../_shared/tools/functions';
import AppLabel from '../../../../_shared/components/app/label/AppLabel';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EndowmentDetails() {
  let { idEndowment } = useParams();
  const [getEndowment, { loading, data: endowmentData }] = useLazyQuery(GET_RECAP_ENDOWMENT);

  React.useEffect(() => {
    if (idEndowment) {
      getEndowment({ variables: { id: idEndowment } });
    }
  }, [idEndowment]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/finance/dotations/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/finance/dotations/modifier/${endowmentData?.endowment?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      {loading ? (
        <ProgressService type="form" />
      ) : (
        endowmentData?.endowment && <EndowmentDetailsPage endowment={endowmentData.endowment} />
      )}
    </Stack>
  );
}

const EndowmentDetailsPage = ({ endowment }) => {
  const {
    id,
    number,
    label,
    gender,
    amountAllocated,
    startingDateTime,
    endingDateTime,
    ageMin,
    ageMax,
    establishment,
    endowmentType,
    professionalStatus,
    accountingNature,
    description,
    observation,
    isActive,
  } = endowment;

  return (
    <Grid container spacing={3}>
      {/* Header avec l'image et le titre */}

      {/* Détails principaux */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Informations principales
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1"><b>Référence :</b> {number}</Typography>
            <Typography variant="body1"><b>Libellé :</b> {label}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
            <b>Montant alloué :</b> {amountAllocated ? `${amountAllocated} €` : 'Non défini'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1"><b>Genre :</b> {getGenderLabel(gender)}</Typography>
            <Typography variant="body1">
            <b>Période :</b>{' '}
              {startingDateTime
                ? `${getFormatDate(startingDateTime)} au ${getFormatDate(endingDateTime)}`
                : 'Non défini'}
            </Typography>
            <Typography variant="body1">
            <b>Marge d'âge :</b> {ageMin || 'Non défini'} - {ageMax || 'Non défini'}
            </Typography>
          </Paper>
        </Paper>
      </Grid>

      {/* Informations supplémentaires */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Type et statut
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
            <b>Type de dotation :</b> {endowmentType?.name || 'Non défini'}
            </Typography>
            <Typography variant="body1">
            <b>Statut professionnel :</b> {professionalStatus?.name || 'Non défini'}
            </Typography>
            <Typography variant="body1">
              <b>Nature comptable :</b> {accountingNature?.name || 'Non défini'}
            </Typography>
          </Paper>
          <Paper sx={{ padding: 2 }} variant="outlined">
            {establishment ? (
              <EstablishmentChip establishment={establishment} />
            ) : (
              <Typography variant="body1">Aucun établissement associé</Typography>
            )}
          </Paper>
        </Paper>
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {description || "Aucune description pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>

      {/* Observation */}
      <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Observation
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {observation || "Aucune observation pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
};
