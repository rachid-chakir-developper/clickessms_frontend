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
  List,
  Stack,
  Rating,
} from '@mui/material';

import { JOB_CANDIDATE_APPLICATION_RECAP } from '../../../../../_shared/graphql/queries/JobCandidateApplicationQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import JobPositionChip from '../job_positions/JobPositionChip';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit } from '@mui/icons-material';
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

export default function JobCandidateApplicationDetails() {
  let { idJobCandidateApplication } = useParams();

  const [
    getJobCandidateApplication,
    { loading: loadingJobCandidateApplication, data: jobCandidateApplicationData, error: jobCandidateApplicationError },
  ] = useLazyQuery(JOB_CANDIDATE_APPLICATION_RECAP);

  React.useEffect(() => {
    if (idJobCandidateApplication) {
      getJobCandidateApplication({ variables: { id: idJobCandidateApplication } });
    }
  }, [idJobCandidateApplication]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/ressources-humaines/recrutement/vivier-candidats/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/ressources-humaines/recrutement/vivier-candidats/modifier/${jobCandidateApplicationData?.jobCandidateApplication?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      {loadingJobCandidateApplication ? (
        <ProgressService type="form" />
      ) : (
        jobCandidateApplicationData?.jobCandidateApplication && <JobCandidateApplicationDetailsPage jobCandidateApplication={jobCandidateApplicationData.jobCandidateApplication} />
      )}
    </Stack>
  );
}

const JobCandidateApplicationDetailsPage = ({ jobCandidateApplication }) => {
  const {
    description,
    observation
  } = jobCandidateApplication;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <JobCandidateApplicationMiniInfos jobCandidateApplication={jobCandidateApplication} />
        </Grid>
        <Grid item xs={6}>
          <JobCandidateApplicationOtherInfos jobCandidateApplication={jobCandidateApplication} />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {/* Description */}
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Description
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
            <Typography variant="h6" gutterBottom>
              Observation
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

function JobCandidateApplicationMiniInfos({ jobCandidateApplication }) {
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
        {jobCandidateApplication?.image && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="Bank Card" src={jobCandidateApplication?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                <b>Réference:</b> {jobCandidateApplication?.number}
              </Typography>
              {jobCandidateApplication?.jobPosition && (
                <>
                  <Paper sx={{ padding: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Fiche besoin postulée
                    </Typography>
                    <JobPositionChip jobPosition={jobCandidateApplication?.jobPosition} />
                  </Paper>
                </>
              )}
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="h6" sx={{textDecoration: 'underline'}} gutterBottom>
                  Infos sur le candidat:
                </Typography>
                <Box sx={{paddingLeft: 4}}>
                  <Typography variant="subtitle1" component="div">
                    <b>Nom:</b> {jobCandidateApplication?.firstName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Prénom:</b> {jobCandidateApplication?.lastName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Métier:</b> {jobCandidateApplication?.jobTitle}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Disponible le:</b> {getFormatDate(jobCandidateApplication?.availabilityDate)}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>E-mail:</b> {jobCandidateApplication?.email}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Tél:</b> {jobCandidateApplication?.mobile}
                  </Typography>
                </Box>
              </Paper>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(jobCandidateApplication?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(jobCandidateApplication?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function JobCandidateApplicationOtherInfos({ jobCandidateApplication }) {
  const {firstName, lastName,  cv, coverLetter} = jobCandidateApplication
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
      {jobCandidateApplication?.employee && (
        <>
          <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Ajouté par
            </Typography>
            <EmployeeChip employee={jobCandidateApplication?.employee} />
          </Paper>
        </>
      )}<>
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Note
        </Typography>
        <Rating value={jobCandidateApplication?.rating} readOnly />
      </Paper>
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        <FileViewer title="CV" fileUrl={cv} fileName={`cv-${firstName}-${lastName}`} />
      </Paper>
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        <FileViewer title="Lettre de motivation" fileUrl={coverLetter} fileName={`Lettre-de-motivation-${firstName}-${lastName}`} />
      </Paper>
    </>
    </Paper>
  );
}
