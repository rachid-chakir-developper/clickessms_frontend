import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Button,
} from '@mui/material';

import { BANK_ACCOUNT_RECAP } from '../../../../../_shared/graphql/queries/BankAccountQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
  getFormatDate,
} from '../../../../../_shared/tools/functions';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { ArrowBack, Edit } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BankAccountDetails() {
  let { idBankAccount } = useParams();
  const [
    getBankAccount,
    {
      loading: loadingBankAccount,
      data: bankAccountData,
      error: bankAccountError,
    },
  ] = useLazyQuery(BANK_ACCOUNT_RECAP);
  React.useEffect(() => {
    if (idBankAccount) {
      getBankAccount({ variables: { id: idBankAccount } });
    }
  }, [idBankAccount]);

  if (loadingBankAccount) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/finance/tresorerie/comptes-bancaires/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/finance/tresorerie/comptes-bancaires/modifier/${bankAccountData?.bankAccount?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <BankAccountMiniInfos bankAccount={bankAccountData?.bankAccount} />
          </Grid>
          <Grid item xs={5}>
            <BankAccountOtherInfos bankAccount={bankAccountData?.bankAccount} />
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
                {bankAccountData?.bankAccount?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {bankAccountData?.bankAccount?.observation}
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

function BankAccountMiniInfos({ bankAccount }) {
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
        {bankAccount?.image && bankAccount?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={bankAccount?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{bankAccount?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {bankAccount?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Solde : {formatCurrencyAmount(bankAccount?.balance)}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                IBAN : <b>{bankAccount?.iban}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                BIC : <b>{bankAccount?.bic}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(bankAccount?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(bankAccount?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function BankAccountOtherInfos({ bankAccount }) {
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
      {bankAccount?.establishment && (
        <>
          <Typography variant="body2" color="text.secondary">
            <b>Date ouverture: </b>{' '}
            {`${getFormatDate(bankAccount?.openingDate)}`} <br />
            <b>Date fermeture: </b>{' '}
            {`${getFormatDate(bankAccount?.closingDate)}`}
          </Typography>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <EstablishmentChip
            establishment={bankAccount?.establishment}
          />
        </>
      )}
    </Paper>
  );
}
