import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
} from '@mui/material';

import { CR_TRANSACTION_RECAP } from '../../../../../../_shared/graphql/queries/CashRegisterTransactionQueries';
import ProgressService from '../../../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
} from '../../../../../../_shared/tools/functions';
import EmployeeItemCard from '../../../../human_ressources/employees/EmployeeItemCard';
import EstablishmentItemCard from '../../../../companies/establishments/EstablishmentItemCard';
import CashRegisterItemCard from '../bank_accounts/CashRegisterItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function CashRegisterTransactionDetails() {
  let { idCashRegisterTransaction } = useParams();
  const [
    getCashRegisterTransaction,
    { loading: loadingCashRegisterTransaction, data: cashRegisterTransactionData, error: cashRegisterTransactionError },
  ] = useLazyQuery(CR_TRANSACTION_RECAP);
  React.useEffect(() => {
    if (idCashRegisterTransaction) {
      getCashRegisterTransaction({ variables: { id: idCashRegisterTransaction } });
    }
  }, [idCashRegisterTransaction]);

  if (loadingCashRegisterTransaction) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <CashRegisterTransactionMiniInfos cashRegisterTransaction={cashRegisterTransactionData?.cashRegisterTransaction} />
          </Grid>
          <Grid item xs={5}>
            <CashRegisterTransactionOtherInfos cashRegisterTransaction={cashRegisterTransactionData?.cashRegisterTransaction} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {cashRegisterTransactionData?.cashRegisterTransaction?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {cashRegisterTransactionData?.cashRegisterTransaction?.observation}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function CashRegisterTransactionMiniInfos({ cashRegisterTransaction }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        //maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        {cashRegisterTransaction?.image && cashRegisterTransaction?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={cashRegisterTransaction?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{cashRegisterTransaction?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {cashRegisterTransaction?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant : {formatCurrencyAmount(cashRegisterTransaction?.amount)}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                IBAN : <b>{cashRegisterTransaction?.iban}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                BIC : <b>{cashRegisterTransaction?.bic}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(cashRegisterTransaction?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(cashRegisterTransaction?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(cashRegisterTransaction?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(cashRegisterTransaction?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function CashRegisterTransactionOtherInfos({ cashRegisterTransaction }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      {cashRegisterTransaction?.cashRegister?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <EstablishmentItemCard
                establishment={cashRegisterTransaction?.cashRegister?.establishment}
              />
            </Item>
          </Paper>
        </>
      )}
      {cashRegisterTransaction?.cashRegister && (
        <>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 1 }}>
            Compte bancaire
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <CashRegisterItemCard cashRegister={cashRegisterTransaction?.cashRegister} />
            </Item>
          </Paper>
        </>
      )}
    </Paper>
  );
}
