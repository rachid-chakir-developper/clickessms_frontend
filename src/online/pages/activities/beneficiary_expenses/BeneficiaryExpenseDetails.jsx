import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha, Typography, Grid, Avatar, List } from '@mui/material';
import styled from '@emotion/styled';
import { Devices, Edit } from '@mui/icons-material';
import { GET_RECAP_BENEFICIARY_EXPENSE } from '../../../../_shared/graphql/queries/BeneficiaryExpenseQueries';
import { getFormatDate, getFormatDateTime, getGenderLabel, getPaymentMethodLabel } from '../../../../_shared/tools/functions';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';
import BeneficiaryExpenseStatusLabelMenu from './BeneficiaryExpenseStatusLabelMenu';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryExpenseDetails() {
  let { idBeneficiaryExpense } = useParams();
  const [getBeneficiaryExpense, { loading, data: beneficiaryExpenseData }] = useLazyQuery(GET_RECAP_BENEFICIARY_EXPENSE);

  React.useEffect(() => {
    if (idBeneficiaryExpense) {
      getBeneficiaryExpense({ variables: { id: idBeneficiaryExpense } });
    }
  }, [idBeneficiaryExpense]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/activites/depenses/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/activites/depenses/modifier/${beneficiaryExpenseData?.beneficiaryExpense?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      {loading ? (
        <Typography variant="body1">Chargement...</Typography>
      ) : (
        beneficiaryExpenseData?.beneficiaryExpense && <BeneficiaryExpenseDetailsPage beneficiaryExpense={beneficiaryExpenseData.beneficiaryExpense} />
      )}
    </Stack>
  );
}

const BeneficiaryExpenseDetailsPage = ({ beneficiaryExpense }) => {
  const {
    id,
    number,
    label,
    amount,
    paymentMethod,
    expenseDateTime,
    beneficiary,
    endowmentType,
    description,
    observation,
    isActive,
  } = beneficiaryExpense;

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
            <b>Montant :</b> {amount ? `${amount} €` : 'Non défini'}
            </Typography>
            <Typography variant="body1"><b>Methode du paiement :</b> {getPaymentMethodLabel(paymentMethod)}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
            <b>Date :</b>{' '} 
              {expenseDateTime
                ? `${getFormatDate(expenseDateTime)}`
                : 'Non défini'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Status :</b>
            </Typography>
            <BeneficiaryExpenseStatusLabelMenu beneficiaryExpense={beneficiaryExpense} />
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
          </Paper>
          <Paper sx={{ padding: 2 }} variant="outlined">
            {beneficiary ? (
              <BeneficiaryChip beneficiary={beneficiary} />
            ) : (
              <Typography variant="body1">Aucune personne accompagnée associée</Typography>
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
