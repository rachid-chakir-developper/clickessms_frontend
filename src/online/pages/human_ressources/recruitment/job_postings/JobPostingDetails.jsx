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

import { JOB_POSTING_RECAP } from '../../../../../_shared/graphql/queries/JobPostingQueries';
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

export default function JobPostingDetails() {
  let { idJobPosting } = useParams();

  const [
    getJobPosting,
    { loading: loadingJobPosting, data: jobPostingData, error: jobPostingError },
  ] = useLazyQuery(JOB_POSTING_RECAP);

  React.useEffect(() => {
    if (idJobPosting) {
      getJobPosting({ variables: { id: idJobPosting } });
    }
  }, [idJobPosting]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/ressources-humaines/recrutement/annonces/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/ressources-humaines/recrutement/annonces/modifier/${jobPostingData?.jobPosting?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      {loadingJobPosting ? (
        <ProgressService type="form" />
      ) : (
        jobPostingData?.jobPosting && <JobPostingDetailsPage jobPosting={jobPostingData.jobPosting} />
      )}
    </Stack>
  );
}

const JobPostingDetailsPage = ({ jobPosting }) => {
  const {
    description,
    observation
  } = jobPosting;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <JobPostingMiniInfos jobPosting={jobPosting} />
        </Grid>
        <Grid item xs={6}>
          <JobPostingOtherInfos jobPosting={jobPosting} />
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

function JobPostingMiniInfos({ jobPosting }) {
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
        {jobPosting?.image && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="Bank Card" src={jobPosting?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                <b>Réference:</b> {jobPosting?.number}
              </Typography>
              {jobPosting?.jobPosition && (
                <>
                  <Paper sx={{ padding: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Fiche besoin postulée
                    </Typography>
                    <JobPositionChip jobPosition={jobPosting?.jobPosition} />
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
                    <b>Nom:</b> {jobPosting?.firstName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Prénom:</b> {jobPosting?.lastName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Métier:</b> {jobPosting?.jobTitle}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Disponible le:</b> {getFormatDate(jobPosting?.availabilityDate)}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>E-mail:</b> {jobPosting?.email}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Tél:</b> {jobPosting?.mobile}
                  </Typography>
                </Box>
              </Paper>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(jobPosting?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(jobPosting?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function JobPostingOtherInfos({ jobPosting }) {
  const {firstName, lastName,  cv, coverLetter} = jobPosting
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
      {jobPosting?.employee && (
        <>
          <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Ajouté par
            </Typography>
            <EmployeeChip employee={jobPosting?.employee} />
          </Paper>
        </>
      )}<>
      <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Note
        </Typography>
        <Rating value={jobPosting?.rating} readOnly />
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
