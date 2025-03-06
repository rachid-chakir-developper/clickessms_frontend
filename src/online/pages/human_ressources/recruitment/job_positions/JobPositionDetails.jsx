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
import { getFormatDate, getFormatDateTime } from '../../../../../_shared/tools/functions';
import { Edit } from '@mui/icons-material';

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
              <Typography variant="subtitle1" component="div">
                <b>Nom:</b> {jobPosition?.title}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="h6" sx={{textDecoration: 'underline'}} gutterBottom>
                  Infos sur la carte:
                </Typography>
                <Box sx={{paddingLeft: 4}}>
                  <Typography variant="subtitle1" component="div">
                    <b>Nom sur la carte:</b> {jobPosition?.cardholderName}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Numéro de carte:</b> {jobPosition?.cardNumber}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>Date d'expiration:</b> {getFormatDate(jobPosition?.expirationDate, 'MM/YYYY')}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <b>CVV:</b> {jobPosition?.cvv}
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
      {jobPosition?.bankAccount?.establishment && (
        <>
          <Paper sx={{ padding: 2, marginTop:2 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Structure Associés
            </Typography>
            <EstablishmentChip establishment={jobPosition?.bankAccount?.establishment} />
          </Paper>
        </>
      )}
    </Paper>
  );
}
