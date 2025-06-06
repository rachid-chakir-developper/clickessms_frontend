import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Stack, Button, ListItem, ListItemIcon, ListItemText, List, Avatar } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { MEETING_RECAP } from '../../../../_shared/graphql/queries/MeetingQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';
import { Check, CheckBoxOutlineBlank, Done, Edit, Note } from '@mui/icons-material';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function MeetingDetails() {
  let { idMeeting } = useParams();
  const [
    getMeeting,
    { loading: loadingMeeting, data: meetingData, error: meetingError },
  ] = useLazyQuery(MEETING_RECAP);
  React.useEffect(() => {
    if (idMeeting) {
      getMeeting({ variables: { id: idMeeting } });
    }
  }, [idMeeting]);

  if (loadingMeeting) return <ProgressService type="form" />;
  return (
    <>
      <Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
          <Link
            to="/online/ressources-humaines/cr-entretiens/liste"
            className="no_style"
          >
            <Button variant="outlined" startIcon={<ArrowBack />}>
              Retour à la liste
            </Button>
          </Link>
          <Link
            to={`/online/ressources-humaines/cr-entretiens/modifier/${meetingData?.meeting?.id}`}
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Edit />}>
              Modifier
            </Button>
          </Link>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <MeetingMiniInfos meeting={meetingData?.meeting} />
          </Grid>
          <Grid item xs={5}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  margin: 'auto',
                  marginTop: 2,
                  flexGrow: 1,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
              >
                <Typography gutterBottom variant="subtitle3" component="h3">
                  Type de entretien
                </Typography>
                {meetingData?.meeting?.meetingTypes?.map((meetingType, index) => (
                  <Chip
                    color="info"
                    key={index}
                    label={meetingType?.name}
                    sx={{ marginRight: 1 }}
                  />
                ))}
              </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <MeetingParticipantsInfos meeting={meetingData?.meeting} />
          </Grid>
          <Grid item xs={6}>
            <MeetingOtherInfos meeting={meetingData?.meeting} />
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider sx={{ marginY: 3 }}/>
            <Typography gutterBottom variant="subtitle3" component="h1">
              Le compte rendu
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Les notes prises
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {meetingData?.meeting?.notes}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <MeetingDecisions meeting={meetingData?.meeting} />
          </Grid>
          <Grid item xs={6}>
            <MeetingReviewPoints meeting={meetingData?.meeting} />
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function MeetingMiniInfos({ meeting }) {
  return (
    <>
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
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  Réference : <b>{meeting?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {meeting?.topics}
                </Typography>
                {meeting?.videoCallLink && (
                  <Typography gutterBottom variant="subtitle1" component="div">
                    Lien visioconférence : <Link to={meeting?.videoCallLink} target="_blank" rel="noopener noreferrer">{meeting?.videoCallLink}</Link>
                  </Typography>
                )}
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Date début: </b>{' '}
                  {`${getFormatDateTime(meeting?.startingDateTime)}`} <br />
                  <b>Date fin: </b>{' '}
                  {`${getFormatDateTime(meeting?.endingDateTime)}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}


function MeetingParticipantsInfos({ meeting }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {meeting?.participants.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
            Personnes invités
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {meeting?.participants?.map((participant, index) => (
                <EmployeeChip key={index} employee={participant.employee} />
              ))}
            </Stack>
          </Paper>
      )}
      {meeting?.absentParticipants?.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Personnes absentes
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {meeting?.absentParticipants?.map((participant, index) => (
                <EmployeeChip key={index} employee={participant} />
              ))}
            </Stack>
          </Paper>
      )}
    </Paper>
  );
}


function MeetingOtherInfos({ meeting }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {meeting?.establishments.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les structures concernées
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {meeting?.establishments?.map((establishment, index) => (
                <EstablishmentChip key={index} establishment={establishment.establishment} />
              ))}
            </Stack>
          </Paper>
      )}
      {meeting?.beneficiaries?.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Personnes accompagnées concernés
            </Typography>
            <Stack direction="row" flexWrap='wrap' spacing={1}>
              {meeting?.beneficiaries?.map((beneficiary, index) => (
                <BeneficiaryChip key={index} beneficiary={beneficiary?.beneficiary} />
              ))}
            </Stack>
          </Paper>
      )}
    </Paper>
  );
}

function MeetingDecisions({ meeting }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {meeting?.meetingDecisions.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les décisions
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {meeting?.meetingDecisions?.map((meetingDecision, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText
                      primary={meetingDecision?.decision}
                      secondary={meetingDecision?.dueDate ? `Échéance: ${getFormatDate(meetingDecision?.dueDate)}` : ''}
                    />
                  </ListItem>
                  {meetingDecision?.employees?.length > 0 && (
                      <>
                        <Typography variant="p" gutterBottom sx={{fontSize: 12, fontStyle: 'italic'}}>
                          Personnes concernées
                        </Typography>
                        <Stack direction="row" flexWrap='wrap' spacing={1}>
                          {meetingDecision?.employees?.map((employee, index) => (
                            <EmployeeChip key={index} employee={employee} />
                          ))}
                        </Stack>
                      </>
                    )}
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}

function MeetingReviewPoints({ meeting }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {meeting?.meetingReviewPoints.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les points à revoir
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {meeting?.meetingReviewPoints?.map((meetingReviewPoint, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText
                      primary={meetingReviewPoint?.pointToReview}
                    />
                  </ListItem>
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}