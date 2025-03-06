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

import { JOB_CANDIDATE_RECAP } from '../../../../../_shared/graphql/queries/JobCandidateQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import JobPositionChip from '../job_positions/JobPositionChip';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit } from '@mui/icons-material';
import EmployeeChip from '../../employees/EmployeeChip';

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
        <Link to={`/online/ressources-humaines/recrutement/vivier-candidats/modifier/${jobCandidateData?.jobCandidate?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
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
              <Img alt="Bank Card" src={jobCandidate?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                <b>Réference:</b> {jobCandidate?.number}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="h6" sx={{textDecoration: 'underline'}} gutterBottom>
                  Infos sur le candidat:
                </Typography>
                <Box sx={{paddingLeft: 4}}>
                  <Typography variant="subtitle1" component="div">
                    <b>Nom:</b> {jobCandidate?.firstName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Prénom:</b> {jobCandidate?.lastName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Métier:</b> {jobCandidate?.jobTitle}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Disponible le:</b> {getFormatDate(jobCandidate?.availabilityDate, 'MM/YYYY')}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>E-mail:</b> {jobCandidate?.email}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Tél:</b> {jobCandidate?.mobile}
                  </Typography>
                </Box>
              </Paper>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(jobCandidate?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(jobCandidate?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function JobCandidateOtherInfos({ jobCandidate }) {
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
      {jobCandidate?.jobPosition && (
        <>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Fiche besoin postulée
            </Typography>
            <JobPositionChip jobPosition={jobCandidate?.jobPosition} />
          </Paper>
        </>
      )}
      {jobCandidate?.employee && (
        <>
          <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Ajouté par
            </Typography>
            <EmployeeChip employee={jobCandidate?.employee} />
          </Paper>
        </>
      )}<>
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Note
        </Typography>
        <Rating value={jobCandidate?.rating} readOnly />
      </Paper>
    </>
    </Paper>
  );
}
