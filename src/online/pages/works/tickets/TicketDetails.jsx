import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Stack, Button, ListItem, ListItemIcon, ListItemText, List, Avatar } from '@mui/material';

import { TICKET_RECAP } from '../../../../_shared/graphql/queries/TicketQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime, getPriorityLabel } from '../../../../_shared/tools/functions';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';
import { AssignmentInd, Check, Edit, Event, Person, Business, Flag, FactCheck, Description, DateRange, Assignment } from '@mui/icons-material';
import TicketStatusLabelMenu from './TicketStatusLabelMenu';
import TaskActionStatusLabelMenu from '../actions/TaskActionStatusLabelMenu';
import TicketTabs from './tickets-tabs/TicketTabs';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TicketDetails({ticketId}) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageQuality = authorizationSystem.requestAuthorization({
    type: 'manageQuality',
  }).authorized;
  let { idTicket } = useParams();
  const [
    getTicket,
    { loading: loadingTicket, data: ticketData, error: ticketError },
  ] = useLazyQuery(TICKET_RECAP);
  React.useEffect(() => {
    if (idTicket) {
      getTicket({ variables: { id: idTicket } });
    }
    else if(ticketId){
      getTicket({ variables: { id: ticketId } });
    }
  }, [idTicket, ticketId]);

  if (loadingTicket) return <ProgressService type="form" />;
  return (
    <>
      <Stack>
        {canManageQuality && <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
          <Link
            to={`/online/qualites/plan-action/tickets/modifier/${ticketData?.ticket?.id}`}
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Edit />}>
              Modifier
            </Button>
          </Link>
        </Box>}
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <TicketMiniInfos ticket={ticketData?.ticket} />
          </Grid>
          <Grid item xs={6}>
            <TicketOtherInfos ticket={ticketData?.ticket} />
          </Grid>
          <Grid item xs={12} sx={{ marginY: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Analyse
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {ticketData?.ticket?.description || "Aucune analyse disponible"}
              </Typography>
            </Paper>
          </Grid>
          {ticketData?.ticket?.isHaveEfcReport && ticketData?.ticket?.efcReports && ticketData?.ticket?.efcReports.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography gutterBottom variant="subtitle3" component="h3">
                  CREX et déclarations aux autorités compétentes
                </Typography>
                {ticketData?.ticket?.efcReports.map((report, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1">
                          <strong>Intitulé CREX:</strong> {report.title || "Non spécifié"}
                        </Typography>
                        {report.efcDate && (
                          <Typography variant="body1">
                            <strong>Date:</strong> {getFormatDate(report.efcDate)}
                          </Typography>
                        )}
                        {report.document && (
                          <Typography variant="body1">
                            <strong>Document:</strong> <Link to={report.document} target="_blank" rel="noopener">Voir le document</Link>
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {report.declarationDate && (
                          <Typography variant="body1">
                            <strong>Date de déclaration:</strong> {getFormatDate(report.declarationDate)}
                          </Typography>
                        )}
                        {report.employees && report.employees.length > 0 && (
                          <Typography variant="body1">
                            <strong>Participants:</strong>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                              {report.employees.map((employee, i) => (
                                <Chip 
                                  key={i} 
                                  avatar={<Avatar>{employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}</Avatar>} 
                                  label={`${employee.firstName} ${employee.lastName}`} 
                                  variant="outlined" 
                                  size="small"
                                />
                              ))}
                            </Stack>
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Paper>
            </Grid>
          )}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }}>
              <Typography gutterBottom variant="subtitle3" component="h3">
                Actions
              </Typography>
              {ticketData?.ticket?.actions && ticketData?.ticket?.actions.length > 0 ? (
                ticketData?.ticket?.actions.map((action, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <strong>Description:</strong> {action.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {action.dueDate && (
                          <Typography variant="body1">
                            <strong>Échéance:</strong> {getFormatDate(action.dueDate)}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body1">
                          <strong>Statut:</strong> <TaskActionStatusLabelMenu taskAction={action} />
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {action.employees && action.employees.length > 0 && (
                          <Typography variant="body1">
                            <strong>Personnes concernées:</strong>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                              {action.employees.map((employee, i) => (
                                <Chip 
                                  key={i} 
                                  avatar={<Avatar>{employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}</Avatar>} 
                                  label={`${employee.firstName} ${employee.lastName}`} 
                                  variant="outlined" 
                                  size="small"
                                />
                              ))}
                            </Stack>
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">Aucune action associée</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 2 }}>
              <TicketTabs ticket={ticketData?.ticket}/>
            </Paper>
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

function TicketMiniInfos({ ticket }) {
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
                  Réference : <b>{ticket?.number}</b>
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <b>Priorité de ticket</b>
                  <Chip
                    color="info"
                    label={getPriorityLabel(ticket?.priority)}
                    sx={{ marginLeft: 1 }}
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <b>Status: </b>
                  <TicketStatusLabelMenu ticket={ticket} />
                </Typography>
                {ticket?.employee && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <b>Employé responsable: </b> 
                    <Chip
                      avatar={<Avatar>{ticket.employee.firstName?.charAt(0)}{ticket.employee.lastName?.charAt(0)}</Avatar>}
                      label={`${ticket.employee.firstName} ${ticket.employee.lastName}`}
                      variant="outlined"
                      size="small"
                      sx={{ marginLeft: 1 }}
                    />
                  </Typography>
                )}
                {ticket?.folder && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <b>Dossier: </b> {ticket.folder.number} - <b> </b>{ticket.folder.name}
                  </Typography>
                )}
                {ticket?.undesirableEvent && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    <b>Événement indésirable: </b> {ticket.undesirableEvent.title}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

function TicketOtherInfos({ ticket }) {
  return (<>
      {ticket?.establishments && ticket?.establishments.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            margin: 'auto',
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1A2027' : '#ffffff',
          }}
        >
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les structures concernées
            </Typography>
              <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                {ticket?.establishments?.map((establishment, index) => (
                  <Grid item xs={12} sm={12} md={12} key={index} sx={{marginY: 1}}>
                    <Item>
                      <EstablishmentItemCard establishment={establishment} />
                    </Item>
                  </Grid>
                ))}
              </Grid>
          </Paper>
        </Paper>
      )}
      </>
  );
}

