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
  Stack,
  Button,
  List,
} from '@mui/material';

import { CASH_REGISTER_RECAP } from '../../../../../_shared/graphql/queries/CashRegisterQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import {
  formatCurrencyAmount,
  getFormatDateTime,
} from '../../../../../_shared/tools/functions';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../../human_ressources/employees/EmployeeChip';
import ListCashRegisterTransactions from './transactions/ListCashRegisterTransactions';
import { Edit } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function CashRegisterDetails() {
  let { idCashRegister } = useParams();
  const [
    getCashRegister,
    { loading: loadingCashRegister, data: cashRegisterData, error: cashRegisterError },
  ] = useLazyQuery(CASH_REGISTER_RECAP);
  React.useEffect(() => {
    if (idCashRegister) {
      getCashRegister({ variables: { id: idCashRegister } });
    }
  }, [idCashRegister]);

  if (loadingCashRegister) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
          <Box sx={{ marginX: 2 }}>
            <Link
              to={`/online/finance/tresorerie/caisses/liste`}
              className="no_style"
            >
              <Button variant="text" startIcon={<List />} size="small">
                Retour à la Liste
              </Button>
            </Link>
          </Box>
          <Link
            to={`/online/finance/tresorerie/caisses/modifier/${cashRegisterData?.cashRegister?.id}`}
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Edit />} size="small">
              Modifier
            </Button>
          </Link>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <CashRegisterMiniInfos cashRegister={cashRegisterData?.cashRegister} />
          </Grid>
          <Grid item xs={5}>
            <CashRegisterOtherInfos cashRegister={cashRegisterData?.cashRegister} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {cashRegisterData?.cashRegister?.description}
              </Typography>
            </Paper>
          </Grid>
          {cashRegisterData?.cashRegister && <Grid item xs={12}>
            <ListCashRegisterTransactions cashRegister={cashRegisterData?.cashRegister}/>
          </Grid>}
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

function CashRegisterMiniInfos({ cashRegister }) {
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
        {cashRegister?.image && cashRegister?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={cashRegister?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{cashRegister?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {cashRegister?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Solde : {formatCurrencyAmount(cashRegister?.balance)}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(cashRegister?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(cashRegister?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function CashRegisterOtherInfos({ cashRegister }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
      }}
    >
      {cashRegister?.establishments.length > 0 && (
        
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les structures concernées
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {cashRegister?.establishments?.map((establishment, index) => (
                <EstablishmentChip key={index} establishment={establishment.establishment} />
              ))}
            </Stack>
          </Paper>
      )}
      {cashRegister?.managers?.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Responsables
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {cashRegister?.managers?.map((manager, index) => (
                <EmployeeChip key={index} employee={manager.employee} />
              ))}
            </Stack>
          </Paper>
      )}
    </Paper>
  );
}
