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

import { JOB_CANDIDATE_INFORMATION_SHEET_RECAP } from '../../../../../_shared/graphql/queries/JobCandidateInformationSheetQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import JobPositionChip from '../job_positions/JobPositionChip';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit } from '@mui/icons-material';
import EmployeeChip from '../../employees/EmployeeChip';
import FileViewer from '../../../../../_shared/components/media/FileViewer';
import GenerateEmployeeButton from './GenerateEmployeeButton';
import { JOB_CANDIDATE_INFORMATION_SHEET_STATUS } from '../../../../../_shared/tools/constants';
import JobCandidateInformationSheetStatusLabelMenu from './JobCandidateInformationSheetStatusLabelMenu';
import JobCandidateChip from '../job_candidates/JobCandidateChip';

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

export default function JobCandidateInformationSheetDetails() {
  let { idJobCandidateInformationSheet } = useParams();

  const [
    getJobCandidateInformationSheet,
    { loading: loadingJobCandidateInformationSheet, data: jobCandidateInformationSheetData, error: jobCandidateInformationSheetError },
  ] = useLazyQuery(JOB_CANDIDATE_INFORMATION_SHEET_RECAP);

  React.useEffect(() => {
    if (idJobCandidateInformationSheet) {
      getJobCandidateInformationSheet({ variables: { id: idJobCandidateInformationSheet } });
    }
  }, [idJobCandidateInformationSheet]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/ressources-humaines/recrutement/fiches-renseignement/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/ressources-humaines/recrutement/fiches-renseignement/modifier/${jobCandidateInformationSheetData?.jobCandidateInformationSheet?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      {loadingJobCandidateInformationSheet ? (
        <ProgressService type="form" />
      ) : (
        jobCandidateInformationSheetData?.jobCandidateInformationSheet && <JobCandidateInformationSheetDetailsPage jobCandidateInformationSheet={jobCandidateInformationSheetData.jobCandidateInformationSheet} />
      )}
    </Stack>
  );
}

const JobCandidateInformationSheetDetailsPage = ({ jobCandidateInformationSheet }) => {
  const {
    description,
    observation
  } = jobCandidateInformationSheet;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <JobCandidateInformationSheetMiniInfos jobCandidateInformationSheet={jobCandidateInformationSheet} />
        </Grid>
        <Grid item xs={6}>
          <JobCandidateInformationSheetOtherInfos jobCandidateInformationSheet={jobCandidateInformationSheet} />
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

function JobCandidateInformationSheetMiniInfos({ jobCandidateInformationSheet }) {
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
        {jobCandidateInformationSheet?.image && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="Bank Card" src={jobCandidateInformationSheet?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                <b>Réference:</b> {jobCandidateInformationSheet?.number}
              </Typography>
              {jobCandidateInformationSheet?.jobCandidate && (
                <>
                  <Paper sx={{ padding: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Candidat
                    </Typography>
                    <JobCandidateChip jobCandidate={jobCandidateInformationSheet?.jobCandidate} />
                  </Paper>
                </>
              )}
              {jobCandidateInformationSheet?.jobPosition && (
                <>
                  <Paper sx={{ padding: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Fiche besoin postulée
                    </Typography>
                    <JobPositionChip jobPosition={jobCandidateInformationSheet?.jobPosition} />
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
                    <b>Nom:</b> {jobCandidateInformationSheet?.firstName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Prénom:</b> {jobCandidateInformationSheet?.lastName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Métier:</b> {jobCandidateInformationSheet?.jobTitle}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>E-mail:</b> {jobCandidateInformationSheet?.email}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Tél:</b> {jobCandidateInformationSheet?.mobile}
                  </Typography>
                  {jobCandidateInformationSheet?.status===JOB_CANDIDATE_INFORMATION_SHEET_STATUS.ACCEPTED && <GenerateEmployeeButton size="small" jobCandidateInformationSheet={jobCandidateInformationSheet}/>}
                </Box>
              </Paper>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(jobCandidateInformationSheet?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(jobCandidateInformationSheet?.updatedAt)}`}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary">
                <b>Status :</b>
              </Typography>
              <JobCandidateInformationSheetStatusLabelMenu jobCandidateInformationSheet={jobCandidateInformationSheet} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function JobCandidateInformationSheetOtherInfos({ jobCandidateInformationSheet }) {
  const {firstName, lastName,  cv, coverLetter} = jobCandidateInformationSheet
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
      {jobCandidateInformationSheet?.employee && (
        <>
          <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Ajouté par
            </Typography>
            <EmployeeChip employee={jobCandidateInformationSheet?.employee} />
          </Paper>
        </>
      )}<>
    </>
    </Paper>
  );
}
