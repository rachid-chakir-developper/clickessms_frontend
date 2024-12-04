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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { GET_EXPENSE_RECAP } from '../../../../_shared/graphql/queries/ExpenseQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import CommentsList from '../../../_shared/components/feedBacks/CommentsList';
import TitlebarImageList from '../../../_shared/components/media/TitlebarImageList';
import {
  formatCurrencyAmount,
  getFormatDateTime,
  getPriorityLabel,
  getStatusLabel,
  getStepTypeLabel,
} from '../../../../_shared/tools/functions';
import PersonCard from '../../../_shared/components/persons/PersonCard';
import ChecklistsList from '../../../_shared/components/feedBacks/ChecklistsList';
import SignatureCard from '../../../_shared/components/feedBacks/SignatureCard';
import { Check, Edit, Star, StarBorder } from '@mui/icons-material';
import ExpenseStatusLabelMenu from './ExpenseStatusLabelMenu';
import ExpenseTabs from './expenses-tabs/ExpenseTabs';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1}}>
        <Link
          to={`/online/achats/depenses-engagements/modifier/${expenseData?.expense.id}`}
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
            <ExpenseMiniInfos expense={expenseData?.expense} />
          </Grid>
          <Grid item xs={5}>
            <ExpenseOtherInfos expense={expenseData?.expense} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <ExpenseItems expense={expenseData?.expense} />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {expenseData?.expense?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 2 }}>
              <ExpenseTabs expense={expenseData?.expense}/>
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
        p: 2,
        margin: 'auto',
        //maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        {expense?.image && expense?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img alt="complex" src={expense?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="h5" component="div">
                {expense?.label}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{expense?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Montant : <b>{expense?.totalAmount}&nbsp;€</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(expense?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(expense?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Status: </b>
              </Typography>
              <ExpenseStatusLabelMenu expense={expense} />
            </Grid>
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
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              {expense?.establishment && (
                  <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      La structure concernée
                    </Typography>
                    <EstablishmentChip establishment={expense.establishment} />
                  </Paper>
              )}
              {expense?.employee && (
                  <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Demandé par:
                    </Typography>
                    <EmployeeChip employee={expense?.employee} />
                  </Paper>
              )}
            </Grid>
          </Grid>
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
        p: 2,
        margin: 'auto',
        flexGrow: 1,
      }}
    >
      {expense?.expenseItems.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
            Détail de la dépense selon la nature
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {expense?.expenseItems?.map((expenseItem, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemText
                      primary={expenseItem?.accountingNature?.name}
                      secondary={`${formatCurrencyAmount(expenseItem?.amount)}`}
                    />
                    {expenseItem?.establishment && (
                        <>
                          <Stack direction="row" flexWrap='wrap' spacing={1}>
                            <EstablishmentChip establishment={expenseItem?.establishment} />
                          </Stack>
                        </>
                      )}
                  </ListItem>
                  {expenseItem?.description && expenseItem?.description != '' && <Typography variant="p" gutterBottom sx={{fontSize: 12, fontStyle: 'italic'}}>
                    {expenseItem?.description}
                  </Typography>}
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}
