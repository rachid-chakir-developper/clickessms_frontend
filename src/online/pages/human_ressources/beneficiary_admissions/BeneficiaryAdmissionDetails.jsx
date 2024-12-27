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

import { GET_BENEFICIARY_ADMISSION_RECAP } from '../../../../_shared/graphql/queries/BeneficiaryAdmissionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  formatCurrencyAmount,
  getFormatDateTime,
} from '../../../../_shared/tools/functions';
import BeneficiaryAdmissionStatusLabelMenu from './BeneficiaryAdmissionStatusLabelMenu';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryAdmissionDetails() {
  let { idBeneficiaryAdmission } = useParams();
  const [getBeneficiaryAdmission, { loading: loadingBeneficiaryAdmission, data: beneficiaryAdmissionData, error: beneficiaryAdmissionError }] =
    useLazyQuery(GET_BENEFICIARY_ADMISSION_RECAP);
  React.useEffect(() => {
    if (idBeneficiaryAdmission) {
      getBeneficiaryAdmission({ variables: { id: idBeneficiaryAdmission } });
    }
  }, [idBeneficiaryAdmission]);

  if (loadingBeneficiaryAdmission) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{ marginX: 2 }}>
          <Link
            to={`/online/ressources-humaines/admissions-beneficiaires/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />} size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link
          to={`/online/ressources-humaines/admissions-beneficiaires/modifier/${beneficiaryAdmissionData?.beneficiaryAdmission.id}`}
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
            <BeneficiaryAdmissionMiniInfos beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
          </Grid>

          {/* Other Information Section */}
          <Grid item xs={12} sm={5}>
            <BeneficiaryAdmissionOtherInfos beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
          </Grid>

          {/* BeneficiaryAdmission Items Section */}
          <Grid item xs={12}>
            <BeneficiaryAdmissionItems beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
          </Grid>

          <Grid item xs={12} sx={{ my: 3 }}>
            <Divider />
          </Grid>

          {/* Description Section */}
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 3, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle2" component="h3">
                Description de la admission
              </Typography>
              <Typography variant="body1" component="div">
                {beneficiaryAdmissionData?.beneficiaryAdmission?.description || ''}
              </Typography>
            </Paper>
          </Grid>

          {/* Comments and Tabs Section */}
          {/* <Grid item xs={12}>
            <Paper sx={{ padding: 3 }}>
              <BeneficiaryAdmissionTabs beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
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

function BeneficiaryAdmissionMiniInfos({ beneficiaryAdmission }) {
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
        {beneficiaryAdmission?.image && beneficiaryAdmission?.image !== '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Img alt="image" src={beneficiaryAdmission?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container direction="column" spacing={2}>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              {beneficiaryAdmission?.label}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Référence : <b>{beneficiaryAdmission?.number}</b>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems:'center'}}>
              <Typography variant="subtitle1" color="textSecondary">
                Montant total : <b>{formatCurrencyAmount(beneficiaryAdmission?.totalAmount)}</b>
              </Typography>
              <Alert sx={{marginLeft: 2}} severity={beneficiaryAdmission?.isAmountAccurate ? "success" : "warning"}>{beneficiaryAdmission?.isAmountAccurate ? "Montant précis" : "Montant non précis"}</Alert>
              <Alert sx={{marginLeft: 2}} severity="info">{beneficiaryAdmission?.isPlannedInBudget ? "Prévu au budget" : "Non prévu au budget"}</Alert>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Créé le :</b> {getFormatDateTime(beneficiaryAdmission?.createdAt)} <br />
              <b>Dernière modification :</b> {getFormatDateTime(beneficiaryAdmission?.updatedAt)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Status :</b>
            </Typography>
            <BeneficiaryAdmissionStatusLabelMenu beneficiaryAdmission={beneficiaryAdmission} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function BeneficiaryAdmissionOtherInfos({ beneficiaryAdmission }) {
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
          {beneficiaryAdmission?.establishment && (
            <Paper sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Structure concernée
              </Typography>
              <EstablishmentChip establishment={beneficiaryAdmission.establishment} />
            </Paper>
          )}
          {beneficiaryAdmission?.employee && (
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="h6" gutterBottom>
                Demandé par :
              </Typography>
              <EmployeeChip employee={beneficiaryAdmission?.employee} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

function BeneficiaryAdmissionItems({ beneficiaryAdmission }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      {beneficiaryAdmission?.beneficiaryAdmissionItems.length > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            Détail des admissions
          </Typography>
          <List sx={{ width: '100%' }}>
            {beneficiaryAdmission?.beneficiaryAdmissionItems?.map((beneficiaryAdmissionItem, index) => (
              <ListItem key={index} sx={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                <ListItemText
                  primary={beneficiaryAdmissionItem?.accountingNature?.name}
                  secondary={`${formatCurrencyAmount(beneficiaryAdmissionItem?.amount)} / Quantité: ${beneficiaryAdmissionItem?.quantity} / ${beneficiaryAdmissionItem?.description}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Aucun article de admission ajouté.
        </Typography>
      )}
    </Paper>
  );
}
