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
  Tooltip,
} from '@mui/material';

import { GET_BENEFICIARY_ADMISSION_RECAP } from '../../../../_shared/graphql/queries/BeneficiaryAdmissionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import {
  formatCurrencyAmount,
  getFormatDate,
  getFormatDateTime,
  getGenderLabel,
} from '../../../../_shared/tools/functions';
import BeneficiaryAdmissionStatusLabelMenu from './BeneficiaryAdmissionStatusLabelMenu';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import { Edit } from '@mui/icons-material';
import BeneficiaryAdmissionTabs from './beneficiary_admissions-tabs/BeneficiaryAdmissionTabs';
import FinancierChip from '../../partnerships/financiers/FinancierChip';

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
          {beneficiaryAdmissionData?.beneficiaryAdmission && <Grid item xs={12} sm={7}>
            <BeneficiaryAdmissionMiniInfos beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
          </Grid>}

          {/* Other Information Section */}
          <Grid item xs={12} sm={5}>
            <BeneficiaryAdmissionOtherInfos beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
          </Grid>

          {beneficiaryAdmissionData?.beneficiaryAdmission && <Grid item xs={12} sm={12}>
            <BeneficiaryAdmissionInfosPerso beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
          </Grid>}

          {/* Description Section */}
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 3, marginBottom: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle2" component="h3">
                Description de la demande
              </Typography>
              <Typography variant="body1" component="div">
                {beneficiaryAdmissionData?.beneficiaryAdmission?.description || ''}
              </Typography>
            </Paper>
          </Grid>

          {/* Comments and Tabs Section */}
          <Grid item xs={12}>
            <Paper sx={{ padding: 3 }}>
              <BeneficiaryAdmissionTabs beneficiaryAdmission={beneficiaryAdmissionData?.beneficiaryAdmission} />
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

function BeneficiaryAdmissionMiniInfos({ beneficiaryAdmission }) {
  const {
    id,
    number,
    statusReason,
    receptionDate,
    responseDate,
    createdAt,
    updatedAt
  } = beneficiaryAdmission;
  const [openChangeReason, setOpenChangeReason] = React.useState(false);
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
        <Grid item xs={12} sm container direction="column" spacing={2}>
          <Grid item xs>
            <Typography variant="subtitle1" color="textSecondary">
              Référence : <b>{number}</b>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Date de réception de la demande d’admission :</b> {getFormatDate(receptionDate)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <b>Créé le :</b> {getFormatDateTime(createdAt)} <br />
              <b>Dernière modification :</b> {getFormatDateTime(updatedAt)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="textSecondary">
              <b>Status :</b>
            </Typography>
            <BeneficiaryAdmissionStatusLabelMenu beneficiaryAdmission={beneficiaryAdmission} openChangeReason={openChangeReason} setOpenChangeReason={setOpenChangeReason}/>
            <Tooltip title="Cliquez pour modifier" placement="top-start">
              <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }} onClick={()=>setOpenChangeReason(true)}>
                <b>Date de réponse :</b> {getFormatDate(responseDate)}
              </Typography>
              <Typography variant="body2" color="textSecondary" onClick={()=>setOpenChangeReason(true)}>
                <b>Motif de réponse :</b> {statusReason}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function BeneficiaryAdmissionInfosPerso({ beneficiaryAdmission }) {
  const {
    id,
    number,
    firstName,
    lastName,
    preferredName,
    gender,
    birthDate,
    age,
    birthCity,
    birthCountry,
    nationality,
    professionalStatus,
    latitude,
    longitude,
    city,
    zipCode,
    address,
    additionalAddress,
    mobile,
    fix,
    fax,
    email,
    webSite,
    otherContacts,
    createdAt,
    updatedAt
  } = beneficiaryAdmission;

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
        <Grid item xs={4}>
          <Typography variant="body1" color="textSecondary">
            <b>Informations personnelles :</b>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary">
            <b>Prénom :</b> {firstName || '-'} <br />
            <b>Nom de naissance :</b> {lastName || '-'} <br />
            <b>Nom d’usage :</b> {preferredName || '-'} <br />
            <b>Genre :</b> {getGenderLabel(gender) || '-'} <br />
            <b>Date de naissance :</b> {getFormatDate(birthDate) || '-'}<br />
            <b>Âge :</b> {age || '-'}<br />
            <b>Ville de naissance :</b> {birthCity || '-'} <br />
            <b>Pays de naissance :</b> {birthCountry || '-'} <br />
            <b>Nationnalité :</b> {nationality || '-'} <br />
            <b>Statut professionnel :</b> {professionalStatus?.name || '-'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="textSecondary">
            <b>Adresse :</b>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary">
            {address || '-'}, {additionalAddress || '-'} <br />
            {city || '-'}, {zipCode || '-'} <br />
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="textSecondary">
            <b>Contacts :</b>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" color="textSecondary">
            <b>Mobile :</b> {mobile || '-'} <br />
            <b>Fix :</b> {fix || '-'} <br />
            <b>Fax :</b> {fax || '-'} <br />
            <b>Email :</b> {email || '-'} <br />
            <b>Site Web :</b> {webSite || '-'} <br />
            <b>Autres Contacts :</b> {otherContacts || '-'}
          </Typography>
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
          {beneficiaryAdmission?.employee && (
            <Paper sx={{ padding: 1, display: 'flex' }} variant="outlined">
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Ajoutée par :
              </Typography>
              <EmployeeChip employee={beneficiaryAdmission?.employee} />
            </Paper>
          )}
          {beneficiaryAdmission?.financier && (
            <Paper sx={{ padding: 1, marginY:1, display: 'flex' }} variant="outlined">
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Financeur :
              </Typography>
              <FinancierChip financier={beneficiaryAdmission?.financier} />
            </Paper>
          )}
          {beneficiaryAdmission?.establishments.length > 0 && (
              <Paper sx={{ padding: 1 }} variant="outlined">
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  Les structures concernées
                </Typography>
                <Stack direction="row" flexWrap='wrap' spacing={1}>
                  {beneficiaryAdmission?.establishments?.map((establishment, index) => (
                    <EstablishmentChip key={index} establishment={establishment} />
                  ))}
                </Stack>
              </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
