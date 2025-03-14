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
  Rating,
} from '@mui/material';

import { JOB_CANDIDATE_RECAP } from '../../../../../_shared/graphql/queries/JobCandidateQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import JobPositionChip from '../job_positions/JobPositionChip';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit, ArrowBack, Description, Note, Person, Work, Email, Phone, Event, Star, Link as LinkIcon, InsertDriveFile } from '@mui/icons-material';
import EmployeeChip from '../../employees/EmployeeChip';
import FileViewer from '../../../../../_shared/components/media/FileViewer';

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

export default function JobCandidateDetails() {
  let { idJobCandidate } = useParams();

  const [
    getJobCandidate,
    { loading: loadingJobCandidate, data: jobCandidateData, error: jobCandidateError },
  ] = useLazyQuery(JOB_CANDIDATE_RECAP);

  React.useEffect(() => {
    if (idJobCandidate) {
      getJobCandidate({ variables: { id: idJobCandidate } });
    }
  }, [idJobCandidate]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/ressources-humaines/recrutement/vivier-candidats/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/ressources-humaines/recrutement/vivier-candidats/modifier/${jobCandidateData?.jobCandidate?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      {loadingJobCandidate ? (
        <ProgressService type="form" />
      ) : (
        jobCandidateData?.jobCandidate && <JobCandidateDetailsPage jobCandidate={jobCandidateData.jobCandidate} />
      )}
    </Stack>
  );
}

const JobCandidateDetailsPage = ({ jobCandidate }) => {
  const {
    description,
    observation
  } = jobCandidate;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <JobCandidateMiniInfos jobCandidate={jobCandidate} />
        </Grid>
        <Grid item xs={6}>
          <JobCandidateOtherInfos jobCandidate={jobCandidate} />
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
      </Grid>
    </Box>
  );
}

function JobCandidateMiniInfos({ jobCandidate }) {
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
        {jobCandidate?.image && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="Photo du candidat" src={jobCandidate?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                <b>Référence:</b> {jobCandidate?.number}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="h6" sx={{textDecoration: 'underline'}} gutterBottom>
                  Infos sur le candidat:
                </Typography>
                <Box sx={{paddingLeft: 4}}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Person fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Prénom:</b> {jobCandidate?.firstName}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Person fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Nom:</b> {jobCandidate?.lastName}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Work fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Métier:</b> {jobCandidate?.jobTitle}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Event fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Disponible le:</b> {getFormatDate(jobCandidate?.availabilityDate) || "Non définie"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Email fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>E-mail:</b> {jobCandidate?.email || "Non renseigné"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Phone fontSize="small" />
                    <Typography variant="subtitle1" component="div">
                      <b>Tél:</b> {jobCandidate?.mobile || jobCandidate?.phone || "Non renseigné"}
                    </Typography>
                  </Stack>
                  {jobCandidate?.jobPlatform && (
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <LinkIcon fontSize="small" />
                      <Typography variant="subtitle1" component="div">
                        <b>Source:</b> {jobCandidate?.jobPlatform?.name || "Non renseignée"}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Paper>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Créé le:</b> {getFormatDateTime(jobCandidate?.createdAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <b>Dernière modification:</b> {getFormatDateTime(jobCandidate?.updatedAt)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function JobCandidateOtherInfos({ jobCandidate }) {
  const {firstName, lastName, cv, coverLetter} = jobCandidate
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
      {jobCandidate?.employee && (
        <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
          <Typography variant="h6" gutterBottom>
            Ajouté par
          </Typography>
          <EmployeeChip employee={jobCandidate?.employee} />
        </Paper>
      )}
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Star sx={{ mr: 1 }} />Note
        </Typography>
        <Rating value={jobCandidate?.rating} readOnly />
      </Paper>
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <InsertDriveFile sx={{ mr: 1 }} />CV
        </Typography>
        <FileViewer title="CV" fileUrl={cv} fileName={`cv-${firstName}-${lastName}`} />
      </Paper>
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        {/* <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <InsertDriveFile sx={{ mr: 1 }} />Lettre de motivation
        </Typography> */}
        <FileViewer title="Lettre de motivation" fileUrl={coverLetter} fileName={`Lettre-de-motivation-${firstName}-${lastName}`} />
      </Paper>
    </Paper>
  );
}
