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

import { BUDGET_RECAP } from '../../../../_shared/graphql/queries/BudgetQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  getFormatDateTime,
  formatCurrencyAmount,
  getFormatDate,
} from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';
import BudgetStatusLabelMenu from './BudgetStatusLabelMenu';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import { Edit } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BudgetDetails() {
  let { idBudget } = useParams();
  const [
    getBudget,
    {
      loading: loadingBudget,
      data: budgetData,
      error: budgetError,
    },
  ] = useLazyQuery(BUDGET_RECAP);
  React.useEffect(() => {
    if (idBudget) {
      getBudget({ variables: { id: idBudget } });
    }
  }, [idBudget]);

  if (loadingBudget) return <ProgressService type="form" />;
  return (
    <>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1}}>
      <Link
        to={`/online/finance/budgets/modifier/${budgetData?.budget?.id}`}
        className="no_style"
      >
        <Button variant="outlined" endIcon={<Edit />}>
          Modifier
        </Button>
      </Link>
    </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <BudgetMiniInfos budget={budgetData?.budget} />
          </Grid>
          <Grid item xs={5}>
            <BudgetOtherInfos budget={budgetData?.budget} />
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
                {budgetData?.budget?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {budgetData?.budget?.observation}
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

function BudgetMiniInfos({ budget }) {
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
        {budget?.image && budget?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={budget?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{budget?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {budget?.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant prévu : {formatCurrencyAmount(budget?.amountAllocated)}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant dépensé : {formatCurrencyAmount(budget?.amountSpent)}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Année: </b>{' '}
                {getFormatDate(budget?.startingDate, 'YYYY')}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(budget?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(budget?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function BudgetOtherInfos({ budget }) {
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
      {budget?.establishment && (
        <>
          <Typography variant="h6" gutterBottom>
            Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <EstablishmentChip
                establishment={budget?.establishment}
              />
          </Paper>
          <Paper sx={{ padding: 2, marginY: 1 }} variant="outlined">
            <BudgetStatusLabelMenu budget={budget} />
          </Paper>
        </>
      )}
    </Paper>
  );
}
