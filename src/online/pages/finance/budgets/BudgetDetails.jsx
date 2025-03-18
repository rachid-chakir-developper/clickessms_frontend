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
import { Edit, ArrowBack, Info, Description, Note, Business, Money, Event, AccountBalance } from '@mui/icons-material';
import AccountingNatureTreeViewForm from './AccountingNatureTreeViewForm';

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/finance/budgets/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/finance/budgets/modifier/${budgetData?.budget?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <BudgetMiniInfos budget={budgetData?.budget} />
          </Grid>
          <Grid item xs={5}>
            <BudgetOtherInfos budget={budgetData?.budget} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} />Description
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1">
                  {budgetData?.budget?.description ? budgetData?.budget?.description : "Aucune description pour l'instant"}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Note sx={{ mr: 1 }} />Observation
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1">
                  {budgetData?.budget?.observation ? budgetData?.budget?.observation : "Aucune observation pour l'instant"}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 1 }} />Nature comptable
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <AccountingNatureTreeViewForm budget={budgetData?.budget} disabled={true}/>
              </Paper>
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
      <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Info sx={{ mr: 1 }} />Informations principales
      </Typography>
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
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} />Référence : <b>{budget?.number}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Description sx={{ mr: 1, fontSize: 'small' }} />Nom : <b>{budget?.name}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Money sx={{ mr: 1, fontSize: 'small' }} />Montant prévu : <b>{formatCurrencyAmount(budget?.amountAllocated)}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Money sx={{ mr: 1, fontSize: 'small' }} />Montant dépensé : <b>{formatCurrencyAmount(budget?.amountSpent)}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Event sx={{ mr: 1, fontSize: 'small' }} /><b>Année: </b>{' '}
                {getFormatDate(budget?.startingDate, 'YYYY')}
              </Typography>
              {/* <Divider sx={{ marginTop: 2, marginBottom: 2 }} /> */}
              {/* <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} /><b>Créé le: </b>{' '}
                {`${getFormatDateTime(budget?.createdAt)}`}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} /><b>Dernière modification: </b>
                {`${getFormatDateTime(budget?.updatedAt)}`}
              </Typography> */}
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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Business sx={{ mr: 1 }} />Structure
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <EstablishmentChip
                establishment={budget?.establishment}
              />
          </Paper>
          <Paper sx={{ padding: 2, marginY: 1 }} variant="outlined">
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /><b>Status :</b>
            </Typography>
            <BudgetStatusLabelMenu budget={budget} />
          </Paper>
        </>
      )}
    </Paper>
  );
}
