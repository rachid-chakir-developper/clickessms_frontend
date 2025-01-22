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

import { BANK_CARD_RECAP } from '../../../../../_shared/graphql/queries/BankCardQueries';
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

export default function BankCardDetails() {
  let { idBankCard } = useParams();
  const [
    getBankCard,
    { loading: loadingBankCard, data: bankCardData, error: bankCardError },
  ] = useLazyQuery(BANK_CARD_RECAP);
  React.useEffect(() => {
    if (idBankCard) {
      getBankCard({ variables: { id: idBankCard } });
    }
  }, [idBankCard]);

  if (loadingBankCard) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <BankCardMiniInfos bankCard={bankCardData?.bankCard} />
          </Grid>
          <Grid item xs={5}>
            <BankCardOtherInfos bankCard={bankCardData?.bankCard} />
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
                {bankCardData?.bankCard?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {bankCardData?.bankCard?.observation}
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

function BankCardMiniInfos({ bankCard }) {
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
        {bankCard?.image && bankCard?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={bankCard?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{bankCard?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {bankCard?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant : {formatCurrencyAmount(bankCard?.amount)}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                IBAN : <b>{bankCard?.iban}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                BIC : <b>{bankCard?.bic}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(bankCard?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(bankCard?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(bankCard?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(bankCard?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function BankCardOtherInfos({ bankCard }) {
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
      {bankCard?.bankAccount?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <EstablishmentItemCard
                establishment={bankCard?.bankAccount?.establishment}
              />
            </Item>
          </Paper>
        </>
      )}
      {bankCard?.bankAccount && (
        <>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 1 }}>
            Compte bancaire
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Item>
              <BankAccountItemCard bankAccount={bankCard?.bankAccount} />
            </Item>
          </Paper>
        </>
      )}
    </Paper>
  );
}
