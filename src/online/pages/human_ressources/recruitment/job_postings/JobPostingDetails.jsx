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

import { JOB_POSTING_RECAP } from '../../../../../_shared/graphql/queries/JobPostingQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import JobPositionChip from '../job_positions/JobPositionChip';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit, ArrowBack, Description, Note, Work, Event, Link as LinkIcon } from '@mui/icons-material';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/ressources-humaines/recrutement/annonces/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/ressources-humaines/recrutement/annonces/modifier/${jobPostingData?.jobPosting?.id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
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
    title,
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
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Work sx={{ mr: 1 }} />Titre de l'annonce
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="h6" component="div">
                {title || "Aucun titre défini"}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1 }} />Description
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography
                gutterBottom
                component="div"
                dangerouslySetInnerHTML={{ __html: description || "Aucune description pour l'instant" }}
              />
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
                <b>Référence:</b> {jobPosting?.number}
              </Typography>
              {jobPosting?.jobPosition && (
                <>
                  <Paper sx={{ padding: 2, marginTop: 2 }} variant="outlined">
                    <Typography variant="h6" gutterBottom>
                      Fiche besoin postulée
                    </Typography>
                    <JobPositionChip jobPosition={jobPosting?.jobPosition} />
                  </Paper>
                </>
              )}
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  <b>Publiée le:</b> {getFormatDate(jobPosting?.publicationDate) || "Non définie"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  <b>Expire le:</b> {getFormatDate(jobPosting?.expirationDate) || "Non définie"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function JobPostingOtherInfos({ jobPosting }) {
  const { publicationDate, expirationDate, employee, jobPlatforms } = jobPosting;

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
      {employee && (
        <Paper sx={{ padding: 2, marginTop: 2 }} variant="outlined">
          <Typography variant="h6" gutterBottom>
            Ajouté par
          </Typography>
          <EmployeeChip employee={employee} />
        </Paper>
      )}

      {jobPlatforms?.length > 0 && (
        <Paper sx={{ padding: 2, marginTop: 2 }} variant="outlined">
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LinkIcon sx={{ mr: 1 }} />Plateformes de diffusion
          </Typography>
          {jobPlatforms.map((jobPlatform, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                {jobPlatform?.jobPlatform?.name}:
              </Typography>
              <a href={jobPlatform.postLink} target="_blank" rel="noopener noreferrer">
                {jobPlatform.postLink}
              </a>
            </Box>
          ))}
        </Paper>
      )}
    </Paper>
  );
}

