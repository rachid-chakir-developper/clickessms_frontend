import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha, Typography, Grid, Avatar, List } from '@mui/material';
import styled from '@emotion/styled';
import { Devices, Edit, ArrowBack, Info, Description, Note, Person, Money, Payment, AccountBalance, EventNote, People } from '@mui/icons-material';
import { GET_RECAP_ENDOWMENT_PAYMENT } from '../../../../_shared/graphql/queries/EndowmentPaymentQueries';
import { getFormatDate, getFormatDateTime, getGenderLabel, getPaymentMethodLabel } from '../../../../_shared/tools/functions';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';
import EndowmentPaymentStatusLabelMenu from './EndowmentPaymentStatusLabelMenu';
import { PAYMENT_METHOD } from '../../../../_shared/tools/constants';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EndowmentPaymentDetails() {
  let { idEndowmentPayment } = useParams();
  const [getEndowmentPayment, { loading, data: endowmentPaymentData }] = useLazyQuery(GET_RECAP_ENDOWMENT_PAYMENT);

  React.useEffect(() => {
    if (idEndowmentPayment) {
      getEndowmentPayment({ variables: { id: idEndowmentPayment } });
    }
  }, [idEndowmentPayment]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/finance/dotations-paiements/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/finance/dotations-paiements/modifier/${endowmentPaymentData?.endowmentPayment?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      {loading ? (
        <ProgressService type="form" />
      ) : (
        endowmentPaymentData?.endowmentPayment && <EndowmentPaymentDetailsPage endowmentPayment={endowmentPaymentData.endowmentPayment} />
      )}
    </Stack>
  );
}

const EndowmentPaymentDetailsPage = ({ endowmentPayment }) => {
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
    iban,
    date,
    beneficiary,
    endowmentType,
    description,
    observation,
    isActive,
  } = endowmentPayment;

  return (
    <Grid container spacing={3}>
      {/* Header avec l'image et le titre */}

      {/* Détails principaux */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Info sx={{ mr: 1 }} />Informations principales
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /><b>Référence :</b> {number}
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Description sx={{ mr: 1, fontSize: 'small' }} /><b>Libellé :</b> {label}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Money sx={{ mr: 1, fontSize: 'small' }} /><b>Montant :</b> {amount ? `${amount} €` : 'Non défini'}
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Payment sx={{ mr: 1, fontSize: 'small' }} /><b>Methode du paiement :</b> {getPaymentMethodLabel(paymentMethod)}
            </Typography>
            {paymentMethod===PAYMENT_METHOD.CREDIT_CARD && 
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 3 }}>
                <Payment sx={{ mr: 1, fontSize: 'small' }} /><b>Carte bancaire :</b> {bankCard?.cardNumber}
              </Typography>
            }
            {paymentMethod===PAYMENT_METHOD.CASH && 
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 3 }}>
                <Money sx={{ mr: 1, fontSize: 'small' }} /><b>Caisse :</b> {cashRegister?.name}
              </Typography>
            }
            {paymentMethod===PAYMENT_METHOD.CHECK && <>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 3 }}>
                <Money sx={{ mr: 1, fontSize: 'small' }} /><b>Numéro chèque :</b> {checkNumber}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 3 }}>
                <AccountBalance sx={{ mr: 1, fontSize: 'small' }} /><b>Nom de la banque :</b> {bankName}
              </Typography></>
            }
            {paymentMethod===PAYMENT_METHOD.BANK_TRANSFER && 
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 3 }}>
                <AccountBalance sx={{ mr: 1, fontSize: 'small' }} /><b>RIB ou IBAN :</b> {iban}
              </Typography>
            }
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EventNote sx={{ mr: 1, fontSize: 'small' }} /><b>Date :</b>{' '} 
                {date
                  ? `${getFormatDate(date)}`
                  : 'Non défini'}
            </Typography>
          </Paper>
        </Paper>
      </Grid>

      {/* Informations supplémentaires */}
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Info sx={{ mr: 1 }} />Type et statut
          </Typography>
          <Paper sx={{ padding: 2, marginBottom:2 }} variant="outlined">
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /><b>Type de dotation :</b> {endowmentType?.name || 'Non défini'}
            </Typography>
          </Paper>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ mr: 1 }} />Personne accompagnée
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            {beneficiary ? (
              <BeneficiaryChip beneficiary={beneficiary} />
            ) : (
              <Typography variant="body1">Aucune personne accompagnée associée</Typography>
            )}
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Info sx={{ mr: 1, fontSize: 'small' }} /><b>Status :</b>
          </Typography>
          <EndowmentPaymentStatusLabelMenu endowmentPayment={endowmentPayment} />
        </Paper>
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1 }} />Description
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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Note sx={{ mr: 1 }} />Observation
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
