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
  Button,
} from '@mui/material';

import { TRANSMISSION_EVENT_RECAP } from '../../../../_shared/graphql/queries/TransmissionEventQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';
import { Edit } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TransmissionEventDetails() {
  let { idTransmissionEvent } = useParams();
  const [
    getTransmissionEvent,
    { loading: loadingTransmissionEvent, data: transmissionEventData, error: transmissionEventError },
  ] = useLazyQuery(TRANSMISSION_EVENT_RECAP);
  React.useEffect(() => {
    if (idTransmissionEvent) {
      getTransmissionEvent({ variables: { id: idTransmissionEvent } });
    }
  }, [idTransmissionEvent]);

  if (loadingTransmissionEvent) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
        <Link
          to={`/online/activites/evenements/modifier/${transmissionEventData?.transmissionEvent?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <TransmissionEventMiniInfos transmissionEvent={transmissionEventData?.transmissionEvent} />
          </Grid>
          <Grid item xs={5}>
            <TransmissionEventOtherInfos transmissionEvent={transmissionEventData?.transmissionEvent} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {transmissionEventData?.transmissionEvent?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {transmissionEventData?.transmissionEvent?.observation}
              </Typography>
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

function TransmissionEventMiniInfos({ transmissionEvent }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        //maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        {transmissionEvent?.image && transmissionEvent?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={transmissionEvent?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{transmissionEvent?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {transmissionEvent?.title}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(transmissionEvent?.createdAt)}`}{' '}
                <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(transmissionEvent?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b>{' '}
                {`${getFormatDateTime(transmissionEvent?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b>{' '}
                {`${getFormatDateTime(transmissionEvent?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function TransmissionEventOtherInfos({ transmissionEvent }) {
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
      <Typography gutterBottom variant="subtitle3" component="h3">
        Les Bénificiaires
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {transmissionEvent?.beneficiaries?.map((beneficiary, index) => (
          <Grid xs={12} sm={12} md={12} key={index}>
            <Item>
              <BeneficiaryItemCard beneficiary={beneficiary?.beneficiary} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
