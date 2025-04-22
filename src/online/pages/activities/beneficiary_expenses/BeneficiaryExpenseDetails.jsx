import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha, Typography, Grid, Avatar, List as ListComponent } from '@mui/material';
import styled from '@emotion/styled';
import { Devices, Edit, ArrowBack, List as ListIcon } from '@mui/icons-material';
import { GET_RECAP_BENEFICIARY_EXPENSE } from '../../../../_shared/graphql/queries/BeneficiaryExpenseQueries';
import { getFormatDate, getFormatDateTime, getGenderLabel, getPaymentMethodLabel } from '../../../../_shared/tools/functions';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';
import BeneficiaryExpenseStatusLabelMenu from './BeneficiaryExpenseStatusLabelMenu';
import { PAYMENT_METHOD } from '../../../../_shared/tools/constants';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/activites/depenses/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/activites/depenses/modifier/${beneficiaryExpenseData?.beneficiaryExpense?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      {loading ? (
        <ProgressService type="form" />
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
    bankCard,
    cashRegister,
    checkNumber,
    bankName,
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
            {paymentMethod===PAYMENT_METHOD.CREDIT_CARD && 
              <Typography variant="body1"><b>Carte bancaire :</b> {bankCard?.cardNumber}</Typography>
            }
            {paymentMethod===PAYMENT_METHOD.CASH && 
              <Typography variant="body1"><b>Caisse :</b>{cashRegister?.name}</Typography>
            }
            {paymentMethod===PAYMENT_METHOD.CHECK && <>
              <Typography variant="body1"><b>Numéro chèque :</b> {checkNumber}</Typography>
              <Typography variant="body1"><b>Nom de la banque :</b> {bankName}</Typography></>
            }
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
            <b>Date :</b>{' '} 
              {expenseDateTime
                ? `${getFormatDate(expenseDateTime)}`
                : 'Non défini'}
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
          <Paper sx={{ padding: 2, marginBottom:2 }} variant="outlined">
            <Typography variant="body1">
              <b>Type de dotation :</b> {endowmentType?.name || 'Non défini'}
            </Typography>
          </Paper>
          <Typography variant="h6" gutterBottom>
            Personne accompagnée
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            {beneficiary ? (
              <BeneficiaryChip beneficiary={beneficiary} />
            ) : (
              <Typography variant="body1">Aucune personne accompagnée associée</Typography>
            )}
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary">
            <b>Status :</b>
          </Typography>
          <BeneficiaryExpenseStatusLabelMenu beneficiaryExpense={beneficiaryExpense} />
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
    </Grid>
  );
};
