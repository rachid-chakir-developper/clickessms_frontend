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

import { BALANCE_RECAP } from '../../../../../_shared/graphql/queries/BalanceQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
} from '../../../../../_shared/tools/functions';
import EmployeeItemCard from '../../../human_ressources/employees/EmployeeItemCard';
import EstablishmentItemCard from '../../../companies/establishments/EstablishmentItemCard';
import BankAccountItemCard from '../bank_accounts/BankAccountItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BalanceDetails() {
  let { idBalance } = useParams();
  const [
    getBalance,
    { loading: loadingBalance, data: balanceData, error: balanceError },
  ] = useLazyQuery(BALANCE_RECAP);
  React.useEffect(() => {
    if (idBalance) {
      getBalance({ variables: { id: idBalance } });
    }
  }, [idBalance]);

  if (loadingBalance) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <BalanceMiniInfos balance={balanceData?.balance} />
          </Grid>
          <Grid item xs={5}>
            <BalanceOtherInfos balance={balanceData?.balance} />
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
                {balanceData?.balance?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {balanceData?.balance?.observation}
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

function BalanceMiniInfos({ balance }) {
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
        {balance?.image && balance?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={balance?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{balance?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {balance?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant : {formatCurrencyAmount(balance?.amount)}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                IBAN : <b>{balance?.iban}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                BIC : <b>{balance?.bic}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(balance?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(balance?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(balance?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(balance?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function BalanceOtherInfos({ balance }) {
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
      {balance?.bankAccount?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Etablissement
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <EstablishmentItemCard
                establishment={balance?.bankAccount?.establishment}
              />
            </Item>
          </Paper>
        </>
      )}
      {balance?.bankAccount && (
        <>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 1 }}>
            Compte bancaire
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <BankAccountItemCard bankAccount={balance?.bankAccount} />
            </Item>
          </Paper>
        </>
      )}
    </Paper>
  );
}