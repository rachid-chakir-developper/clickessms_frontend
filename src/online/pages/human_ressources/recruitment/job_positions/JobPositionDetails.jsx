import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  ButtonBase,
  Button,
  Stack,
} from '@mui/material';

import { JOB_POSITION_RECAP } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { getContractTypeLabel, getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit, ArrowBack, Description, Note, Work, BusinessCenter, Event } from '@mui/icons-material';
import EmployeeChip from '../../employees/EmployeeChip';
import JobPositionTabs from './job_position-tabs/JobPositionTabs';
import JobPositionStatusLabelMenu from './JobPositionStatusLabelMenu';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

export default function JobPositionDetails() {
  let { idJobPosition } = useParams();

  const [
    getJobPosition,
    { loading: loadingJobPosition, data: jobPositionData, error: jobPositionError },
  ] = useLazyQuery(JOB_POSITION_RECAP);

  React.useEffect(() => {
    if (idJobPosition) {
      getJobPosition({ variables: { id: idJobPosition } });
    }
  }, [idJobPosition]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/ressources-humaines/recrutement/fiches-besoin/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/ressources-humaines/recrutement/fiches-besoin/modifier/${jobPositionData?.jobPosition?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      {loadingJobPosition ? (
        <ProgressService type="form" />
      ) : (
        jobPositionData?.jobPosition && <JobPositionDetailsPage jobPosition={jobPositionData.jobPosition} />
      )}
    </Stack>
  );
}

const JobPositionDetailsPage = ({ jobPosition }) => {
  const {
    description,
    observation
  } = jobPosition;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <JobPositionMiniInfos jobPosition={jobPosition} />
        </Grid>
        <Grid item xs={6}>
          <JobPositionOtherInfos jobPosition={jobPosition} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {/* Description */}
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1 }} />Description
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="body1">
                {description || "Aucune description pour l'instant"}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
  
        {/* Observation */}
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Note sx={{ mr: 1 }} />Observation
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="body1">
                {observation || "Aucune observation pour l'instant"}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper sx={{ padding: 2 }}>
            <JobPositionTabs jobPosition={jobPosition}/>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function JobPositionMiniInfos({ jobPosition }) {
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
        {jobPosition?.image && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="Bank Card" src={jobPosition?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                <b>Référence:</b> {jobPosition?.number}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="h6" sx={{textDecoration: 'underline'}} gutterBottom>
                  Infos sur le poste demandé:
                </Typography>
                <Box sx={{paddingLeft: 4}}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Work fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Titre:</b> {jobPosition?.title}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <BusinessCenter fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Secteur:</b> {jobPosition?.sector}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <BusinessCenter fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Type du contrat:</b> {getContractTypeLabel(jobPosition?.contractType)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Event fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Date d'embauche prévue:</b> {getFormatDate(jobPosition?.hiringDate) || "Non définie"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Event fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Durée:</b> {jobPosition?.duration || "Non définie"}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le:</b> {getFormatDateTime(jobPosition?.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Dernière modification:</b> {getFormatDateTime(jobPosition?.updatedAt)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary">
                <b>Status :</b>
              </Typography>
              <JobPositionStatusLabelMenu jobPosition={jobPosition} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function JobPositionOtherInfos({ jobPosition }) {
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
      {jobPosition?.establishment && (
        <>
          <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Structures associées
            </Typography>
            <EstablishmentChip establishment={jobPosition?.establishment} />
          </Paper>
        </>
      )}
      {jobPosition?.employee && (
        <>
          <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Ajouté par
            </Typography>
            <EmployeeChip employee={jobPosition?.employee} />
          </Paper>
        </>
      )}
    </Paper>
  );
}
