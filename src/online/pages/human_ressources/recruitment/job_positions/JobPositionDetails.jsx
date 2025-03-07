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
} from '@mui/material';

import { JOB_POSITION_RECAP } from '../../../../../_shared/graphql/queries/JobPositionQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import EstablishmentChip from '../../../companies/establishments/EstablishmentChip';
import { getContractTypeLabel, getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit } from '@mui/icons-material';
import EmployeeChip from '../../employees/EmployeeChip';
import JobPositionTabs from './job_position-tabs/JobPositionTabs';

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/ressources-humaines/recrutement/fiches-besoin/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/ressources-humaines/recrutement/fiches-besoin/modifier/${jobPositionData?.jobPosition?.id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
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
                <b>Réference:</b> {jobPosition?.number}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="h6" sx={{textDecoration: 'underline'}} gutterBottom>
                  Infos sur le poste demandé:
                </Typography>
                <Box sx={{paddingLeft: 4}}>
                  <Typography variant="subtitle1" component="div">
                    <b>Titre:</b> {jobPosition?.title}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Secteur:</b> {jobPosition?.sector}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Type du contrat:</b> {getContractTypeLabel(jobPosition?.contractType)}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Date d'embauche prévue:</b> {getFormatDate(jobPosition?.hiringDate)}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Duré:</b> {jobPosition?.duration}
                  </Typography>
                </Box>
              </Paper>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>{' '}
                {`${getFormatDateTime(jobPosition?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(jobPosition?.updatedAt)}`}
              </Typography>
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
              Structures associés
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
