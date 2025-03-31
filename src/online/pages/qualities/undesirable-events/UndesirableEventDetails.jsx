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
  Stack,
  Avatar,
  Chip,
} from '@mui/material';

import { GET_UNDESIRABLE_EVENTS, UNDESIRABLE_EVENT_RECAP } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime, getUndesirableEventSeverityLabel, getUndesirableEventTypeLabel } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';
import { 
  Done, 
  Edit, 
  Person, 
  Business, 
  Group, 
  Event, 
  Room, 
  Warning, 
  Assignment, 
  Description, 
  Attachment,
  Flag,
  ArrowBack
} from '@mui/icons-material';
import UndesirableEventTabs from './undesirable-events-tabs/UndesirableEventTabs';
import { POST_UNDESIRABLE_EVENT_TICKET } from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import UndesirableEventStatusLabelMenu from './UndesirableEventStatusLabelMenu';
import CircularProgressWithLabel from '../../../../_shared/components/feedbacks/CircularProgressWithLabel';
import FileCard from '../../../_shared/components/library/FileCard';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1}}>
        <Link
          to="/online/qualites/evenements-indesirables/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Box>
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
            <Button variant="outlined" endIcon={<Edit />} size="small">
              Modifier
            </Button>
          </Link>
        </Box>
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
          {undesirableEventData?.undesirableEvent?.files && undesirableEventData?.undesirableEvent?.files?.length > 0 && 
          <>
            <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
                <Typography gutterBottom variant="subtitle4" component="h4">
                  Pièces jointes
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={1}>
                    {undesirableEventData?.undesirableEvent?.files?.map((file, index) => (
                      <Box key={index} sx={{margin: 1}}>
                        <FileCard file={file} />
                      </Box>
                    ))}
                </Stack>
            </Grid>
          </>
          }
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
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
              <Typography gutterBottom variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                {undesirableEvent?.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                <Event sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Date de signalement :</b> {getFormatDateTime(undesirableEvent?.startingDateTime)}
                </Typography>
              </Box>
              
              {undesirableEvent?.employee && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                  <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    <b>Déclarant principal :</b> <EmployeeChip employee={undesirableEvent?.employee} /> 
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Progression: </b>
                <CircularProgressWithLabel value={undesirableEvent?.completionPercentage}/>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <b>Status: </b>
              </Typography>
              <UndesirableEventStatusLabelMenu undesirableEvent={undesirableEvent}/>
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
      {/* Structures concernées */}
      <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
        <Business sx={{ mr: 1 }} /> Structures concernées
      </Typography>
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {undesirableEvent?.establishments && undesirableEvent.establishments.length > 0 ? (
          undesirableEvent.establishments.map((establishment, index) => (
            <Grid item key={index}>
              <EstablishmentChip establishment={establishment?.establishment} />
            </Grid>
          ))
        ) : (
          <Grid item>
            <Typography variant="body2" color="text.secondary">
              Aucune structure spécifiée
            </Typography>
          </Grid>
        )}
      </Grid>
      
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      
      {/* Déclarants */}
      <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
        <Person sx={{ mr: 1 }} /> Déclarants
      </Typography>
      {undesirableEvent?.declarants && undesirableEvent.declarants.length > 0 ? (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {undesirableEvent.declarants.map((declarant, index) => (
            <Chip
              key={index}
              avatar={<Avatar>{declarant.firstName?.[0] || ''}{declarant.lastName?.[0] || ''}</Avatar>}
              label={`${declarant.firstName} ${declarant.lastName}`}
              variant="outlined"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Aucun autre déclarant
        </Typography>
      )}
      
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      
      {/* Personnes accompagnées */}
      <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
        <Group sx={{ mr: 1 }} /> Personnes accompagnées
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {undesirableEvent?.beneficiaries && undesirableEvent.beneficiaries.length > 0 ? (
          undesirableEvent.beneficiaries.map((beneficiary, index) => (
            <Grid item xs={12} sm={12} md={12} key={index}>
              
                <BeneficiaryChip beneficiary={beneficiary?.beneficiary} />
             
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Aucune personne accompagnée concernée
            </Typography>
          </Grid>
        )}
      </Grid>
      
      {/* Professionnels concernés */}
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
        <Person sx={{ mr: 1 }} /> Professionnels concernés
      </Typography>
      {undesirableEvent?.employees && undesirableEvent.employees.length > 0 ? (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {undesirableEvent.employees.map((employee, index) => (
            <EmployeeChip
              key={index}
              employee={employee?.employee}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Aucun professionnel concerné
        </Typography>
      )}
      
      {/* Familles concernées */}
      {undesirableEvent?.concernedFamilies && (
        <>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
            <Group sx={{ mr: 1 }} /> Familles concernées
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {undesirableEvent.concernedFamilies}
          </Typography>
        </>
      )}
      
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      
      {/* Déroulement des faits */}
      <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
        <Event sx={{ mr: 1 }} /> Déroulement des faits
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Event sx={{ mr: 1, fontSize: 'small' }} />
          <b>Date des faits:</b> {getFormatDateTime(undesirableEvent?.courseFactsDateTime)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Room sx={{ mr: 1, fontSize: 'small' }} />
          <b>Lieu des faits:</b> {undesirableEvent?.courseFactsPlace || 'Non spécifié'}
        </Typography>
      </Box>
      
      {undesirableEvent?.circumstanceEventText && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Description sx={{ mr: 1, fontSize: 'small', mt: 0.5 }} />
            <Box>
              <b>Circonstances de l'événement:</b>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
                {undesirableEvent.circumstanceEventText}
              </Typography>
            </Box>
          </Typography>
        </Box>
      )}
        
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      
      {/* Informations Supplémentaires */}
      <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
        <Assignment sx={{ mr: 1 }} /> Informations Supplémentaires
      </Typography>
      
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Warning sx={{ mr: 1, fontSize: 'small' }} />
          <b>Type d'événement: </b>{getUndesirableEventTypeLabel(undesirableEvent?.undesirableEventType)}
        </Typography>
        
        {undesirableEvent?.normalTypes && undesirableEvent.normalTypes.length > 0 && (
          <Box sx={{ ml: 3, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <b>Types spécifiques: </b>
              {undesirableEvent.normalTypes.map((type) => type.name).join(', ')}
            </Typography>
          </Box>
        )}
        
        {undesirableEvent?.seriousTypes && undesirableEvent.seriousTypes.length > 0 && (
          <Box sx={{ ml: 3, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <b>Types graves: </b>
              {undesirableEvent.seriousTypes.map((type) => type.name).join(', ')}
            </Typography>
          </Box>
        )}
        
        {undesirableEvent?.otherTypes && (
          <Box sx={{ ml: 3, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <b>Autres types: </b>
              {undesirableEvent.otherTypes}
            </Typography>
          </Box>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Flag sx={{ mr: 1, fontSize: 'small' }} />
          <b>Sévérité: </b>{getUndesirableEventSeverityLabel(undesirableEvent?.severity)}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Event sx={{ mr: 1, fontSize: 'small' }} />
          <b>Fréquence: </b>{undesirableEvent?.frequency?.name || 'Non spécifiée'}
        </Typography>
        
        {/* Personnes notifiées */}
        {undesirableEvent?.notifiedPersons && undesirableEvent.notifiedPersons.length > 0 && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <b>Personnes immédiatement prévenues: </b>
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ ml: 3 }}>
              {undesirableEvent.notifiedPersons.map((person, index) => (
                <Chip
                  key={index}
                  size="small"
                  label={`${person.firstName} ${person.lastName}`}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        )}
        
        {undesirableEvent?.otherNotifiedPersons && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <b>Autres personnes prévenues: </b>{undesirableEvent.otherNotifiedPersons}
          </Typography>
        )}
        
        {undesirableEvent?.actionsTakenText && (
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Assignment sx={{ mr: 1, fontSize: 'small', mt: 0.5 }} />
              <Box>
                <b>Actions prises: </b>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.5 }}>
                  {undesirableEvent.actionsTakenText}
                </Typography>
              </Box>
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
