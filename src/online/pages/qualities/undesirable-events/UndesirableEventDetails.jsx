import { useLazyQuery, useMutation } from '@apollo/client';
import * as React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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

import { GET_UNDESIRABLE_EVENTS, UNDESIRABLE_EVENT_RECAP } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';
import { Done, Edit } from '@mui/icons-material';
import UndesirableEventTabs from './undesirable-events-tabs/UndesirableEventTabs';
import { POST_UNDESIRABLE_EVENT_TICKET } from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import UndesirableEventStatusLabelMenu from './UndesirableEventStatusLabelMenu';
import CircularProgressWithLabel from '../../../../_shared/components/feedbacks/CircularProgressWithLabel';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function UndesirableEventDetails() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageQuality = authorizationSystem.requestAuthorization({
    type: 'manageQuality',
  }).authorized;
  const navigate = useNavigate();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  let { idUndesirableEvent } = useParams();
  const [
    getUndesirableEvent,
    {
      loading: loadingUndesirableEvent,
      data: undesirableEventData,
      error: undesirableEventError,
    },
  ] = useLazyQuery(UNDESIRABLE_EVENT_RECAP);
  React.useEffect(() => {
    if (idUndesirableEvent) {
      getUndesirableEvent({ variables: { id: idUndesirableEvent } });
    }
  }, [idUndesirableEvent]);

  const [createUndesirableEventTicket, { loading: loadingPostTicket }] =
  useMutation(POST_UNDESIRABLE_EVENT_TICKET, {
    onCompleted: (datas) => {
      if (datas.createUndesirableEventTicket.done) {
        let ticket = datas.createUndesirableEventTicket?.undesirableEvent?.ticket
        navigate(`/online/qualites/plan-action/tickets/modifier/${ticket?.id}`);
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non analysé ! ${datas.createUndesirableEventTicket.message}.`,
          type: 'error',
        });
      }
    },
    refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }],
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non changée ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onCreateUndesirableEventTicket = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment analyser ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        createUndesirableEventTicket({ variables: { id: id } });
      },
    });
  };

  if (loadingUndesirableEvent) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1}}>
        {canManageQuality && <Button variant="contained" endIcon={<Done />}
        sx={{mx: 2}}
        onClick={() => {
          onCreateUndesirableEventTicket(undesirableEventData?.undesirableEvent?.id);
        }}>
          Analyser
        </Button>}
        <Link
          to={`/online/qualites/evenements-indesirables/modifier/${undesirableEventData?.undesirableEvent?.id}`}
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
            <UndesirableEventMiniInfos
              undesirableEvent={undesirableEventData?.undesirableEvent}
            />
          </Grid>
          <Grid item xs={5}>
            <UndesirableEventOtherInfos
              undesirableEvent={undesirableEventData?.undesirableEvent}
            />
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
                {undesirableEventData?.undesirableEvent?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {undesirableEventData?.undesirableEvent?.observation}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 2 }}>
              <UndesirableEventTabs undesirableEvent={undesirableEventData?.undesirableEvent}/>
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

function UndesirableEventMiniInfos({ undesirableEvent }) {
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
        {undesirableEvent?.image && undesirableEvent?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={undesirableEvent?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{undesirableEvent?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {undesirableEvent?.title}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b>
                {`${getFormatDateTime(undesirableEvent?.createdAt)}`} <br />
                <b>Dernière modification: </b>
                {`${getFormatDateTime(undesirableEvent?.updatedAt)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Date début : </b>
                {`${getFormatDateTime(undesirableEvent?.startingDateTime)}`}
                <br />
                <b>Date fin: </b>
                {`${getFormatDateTime(undesirableEvent?.endingDateTime)}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Type d'événement: </b>
                {`${undesirableEvent?.undesirableEventType}`}
                <br />
                <b>Sévérité: </b>
                {`${undesirableEvent?.severity}`}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Progression: </b>
                <CircularProgressWithLabel value={undesirableEvent?.completionPercentage}/>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Status: </b>
              </Typography>
              <UndesirableEventStatusLabelMenu  undesirableEvent={undesirableEvent}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function UndesirableEventOtherInfos({ undesirableEvent }) {
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
        {undesirableEvent?.beneficiaries?.map((beneficiary, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Item>
              <BeneficiaryItemCard beneficiary={beneficiary?.beneficiary} />
            </Item>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Typography gutterBottom variant="subtitle3" component="h3">
        Informations Supplémentaires
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <b>Fréquence: </b>{undesirableEvent?.frequency}<br />
        <b>Actions prises: </b>{undesirableEvent?.actionsTakenText}<br />
        <b>Date des faits: </b>{getFormatDateTime(undesirableEvent?.courseFactsDateTime)}<br />
        <b>Lieu des faits: </b>{undesirableEvent?.courseFactsPlace}<br />
        <b>Circumstances de l'événement: </b>{undesirableEvent?.circumstanceEventText}<br />
        <b>Personnes notifiées: </b>{undesirableEvent?.notifiedPersons?.map(person => person.name).join(', ')}<br />
        <b>Autres personnes notifiées: </b>{undesirableEvent?.otherNotifiedPersons}<br />
        <b>Établissements: </b>{undesirableEvent?.establishments?.map(establishment => establishment.name).join(', ')}<br />
        <b>Employés: </b>{undesirableEvent?.employees?.map(employee => employee.name).join(', ')}<br />
        <b>Employé en charge: </b>{undesirableEvent?.employee?.name}
      </Typography>
    </Paper>
  );
}
