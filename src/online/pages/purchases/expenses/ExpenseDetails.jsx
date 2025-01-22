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
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

import { GET_EXPENSE_RECAP } from '../../../../_shared/graphql/queries/ExpenseQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  formatCurrencyAmount,
  getFormatDateTime,
} from '../../../../_shared/tools/functions';
import {Edit } from '@mui/icons-material';
import ExpenseStatusLabelMenu from './ExpenseStatusLabelMenu';
import ExpenseTabs from './expenses-tabs/ExpenseTabs';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ExpenseDetails() {
  let { idExpense } = useParams();
  const [getExpense, { loading: loadingExpense, data: expenseData, error: expenseError }] =
    useLazyQuery(GET_EXPENSE_RECAP);
  React.useEffect(() => {
    if (idExpense) {
      getExpense({ variables: { id: idExpense } });
    }
  }, [idExpense]);

  if (loadingExpense) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{ marginX: 2 }}>
          <Link
            to={`/online/achats/depenses-engagements/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />} size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link
          to={`/online/achats/depenses-engagements/modifier/${expenseData?.expense.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Mini Information Section */}
          <Grid item xs={12} sm={7}>
            <ExpenseMiniInfos expense={expenseData?.expense} />
          </Grid>

          {/* Other Information Section */}
          <Grid item xs={12} sm={5}>
            <ExpenseOtherInfos expense={expenseData?.expense} />
          </Grid>

          {/* Expense Items Section */}
          <Grid item xs={12}>
            <ExpenseItems expense={expenseData?.expense} />
          </Grid>

          <Grid item xs={12} sx={{ my: 3 }}>
            <Divider />
          </Grid>

          {/* Description Section */}
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 3, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle2" component="h3">
                Description de la dépense
              </Typography>
              <Typography variant="body1" component="div">
                {expenseData?.expense?.description || ''}
              </Typography>
            </Paper>
          </Grid>

          {/* Comments and Tabs Section */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 3 }}>
              <ExpenseTabs expense={expenseData?.expense} />
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

function ExpenseMiniInfos({ expense }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={3}>
        {expense?.image && expense?.image !== '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img alt="image" src={expense?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container direction="column" spacing={2}>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              {expense?.label}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Référence : <b>{expense?.number}</b>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems:'center'}}>
              <Typography variant="subtitle1" color="textSecondary">
                Montant total : <b>{formatCurrencyAmount(expense?.totalAmount)}</b>
              </Typography>
              <Alert sx={{marginLeft: 2}} severity={expense?.isAmountAccurate ? "success" : "warning"}>{expense?.isAmountAccurate ? "Montant précis" : "Montant non précis"}</Alert>
              <Alert sx={{marginLeft: 2}} severity="info">{expense?.isPlannedInBudget ? "Prévu au budget" : "Non prévu au budget"}</Alert>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Créé le :</b> {getFormatDateTime(expense?.createdAt)} <br />
              <b>Dernière modification :</b> {getFormatDateTime(expense?.updatedAt)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Status :</b>
            </Typography>
            <ExpenseStatusLabelMenu expense={expense} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function ExpenseOtherInfos({ expense }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {expense?.establishment && (
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Structure concernée
              </Typography>
              <EstablishmentChip establishment={expense.establishment} />
            </Paper>
          )}
          {expense?.employee && (
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Demandé par :
              </Typography>
              <EmployeeChip employee={expense?.employee} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

function ExpenseItems({ expense }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      {expense?.expenseItems.length > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            Détail des dépenses
          </Typography>
          <List sx={{ width: '100%' }}>
            {expense?.expenseItems?.map((expenseItem, index) => (
              <ListItem key={index} sx={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <ListItemText
                  primary={expenseItem?.accountingNature?.name}
                  secondary={`${formatCurrencyAmount(expenseItem?.amount)} / Quantité: ${expenseItem?.quantity} / ${expenseItem?.description}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Aucun article de dépense ajouté.
        </Typography>
      )}
    </Paper>
  );
}
