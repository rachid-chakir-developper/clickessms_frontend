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
  ListItemText,
  Alert,
} from '@mui/material';

import { GET_EXPENSE_REPORT_RECAP } from '../../../../_shared/graphql/queries/ExpenseReportQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  formatCurrencyAmount,
  getFormatDateTime,
} from '../../../../_shared/tools/functions';
import ExpenseReportStatusLabelMenu from './ExpenseReportStatusLabelMenu';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import { Edit, ArrowBack } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ExpenseReportDetails() {
  let { idExpenseReport } = useParams();
  const [getExpenseReport, { loading: loadingExpenseReport, data: expenseReportData, error: expenseReportError }] =
    useLazyQuery(GET_EXPENSE_REPORT_RECAP);
  React.useEffect(() => {
    if (idExpenseReport) {
      getExpenseReport({ variables: { id: idExpenseReport } });
    }
  }, [idExpenseReport]);

  if (loadingExpenseReport) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to={`/online/achats/notes-frais/liste`}
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link
          to={`/online/achats/notes-frais/modifier/${expenseReportData?.expenseReport.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Mini Information Section */}
          <Grid item xs={12} sm={7}>
            <ExpenseReportMiniInfos expenseReport={expenseReportData?.expenseReport} />
          </Grid>

          {/* Other Information Section */}
          <Grid item xs={12} sm={5}>
            <ExpenseReportOtherInfos expenseReport={expenseReportData?.expenseReport} />
          </Grid>

          {/* ExpenseReport Items Section */}
          <Grid item xs={12}>
            <ExpenseReportItems expenseReport={expenseReportData?.expenseReport} />
          </Grid>

          <Grid item xs={12} sx={{ my: 3 }}>
            <Divider />
          </Grid>

          {/* Description Section */}
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 3, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle2" component="h3">
                Description de la note de frais
              </Typography>
              <Typography variant="body1" component="div">
                {expenseReportData?.expenseReport?.description || ''}
              </Typography>
            </Paper>
          </Grid>

          {/* Comments and Tabs Section */}
          {/* <Grid item xs={12}>
            <Paper sx={{ padding: 3 }}>
              <ExpenseReportTabs expenseReport={expenseReportData?.expenseReport} />
            </Paper>
          </Grid> */}
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

function ExpenseReportMiniInfos({ expenseReport }) {
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
        {expenseReport?.image && expenseReport?.image !== '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img alt="image" src={expenseReport?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container direction="column" spacing={2}>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              {expenseReport?.label}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Référence : <b>{expenseReport?.number}</b>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems:'center'}}>
              <Typography variant="subtitle1" color="textSecondary">
                Montant total : <b>{formatCurrencyAmount(expenseReport?.totalAmount)}</b>
              </Typography>
              <Alert sx={{marginLeft: 2}} severity={expenseReport?.isAmountAccurate ? "success" : "warning"}>{expenseReport?.isAmountAccurate ? "Montant précis" : "Montant non précis"}</Alert>
              <Alert sx={{marginLeft: 2}} severity="info">{expenseReport?.isPlannedInBudget ? "Prévu au budget" : "Non prévu au budget"}</Alert>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Créé le :</b> {getFormatDateTime(expenseReport?.createdAt)} <br />
              <b>Dernière modification :</b> {getFormatDateTime(expenseReport?.updatedAt)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Status :</b>
            </Typography>
            <ExpenseReportStatusLabelMenu expenseReport={expenseReport} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function ExpenseReportOtherInfos({ expenseReport }) {
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
          {expenseReport?.establishment && (
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Structure concernée
              </Typography>
              <EstablishmentChip establishment={expenseReport.establishment} />
            </Paper>
          )}
          {expenseReport?.employee && (
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Demandé par :
              </Typography>
              <EmployeeChip employee={expenseReport?.employee} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

function ExpenseReportItems({ expenseReport }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      {expenseReport?.expenseReportItems.length > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            Détail des notes de frais
          </Typography>
          <List sx={{ width: '100%' }}>
            {expenseReport?.expenseReportItems?.map((expenseReportItem, index) => (
              <ListItem key={index} sx={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <ListItemText
                  primary={expenseReportItem?.accountingNature?.name}
                  secondary={`${formatCurrencyAmount(expenseReportItem?.amount)} / Quantité: ${expenseReportItem?.quantity} / ${expenseReportItem?.description}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Aucun article de note de frais ajouté.
        </Typography>
      )}
    </Paper>
  );
}
