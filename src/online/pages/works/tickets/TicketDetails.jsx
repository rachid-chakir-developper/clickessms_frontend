import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Stack, Button, List, ListItem, ListItemIcon, ListItemText, Avatar, Card, CardContent } from '@mui/material';

import { TICKET_RECAP } from '../../../../_shared/graphql/queries/TicketQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime, getPriorityLabel } from '../../../../_shared/tools/functions';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';
import { 
  AssignmentInd, 
  Check, 
  Edit, 
  Event, 
  Person, 
  Business, 
  Flag, 
  FactCheck, 
  Description, 
  DateRange, 
  Assignment,
  FolderOpen,
  InsertDriveFile,
  Group,
  ArrowForward,
  Warning,
  ArrowBack,
  List as ListIcon
} from '@mui/icons-material';
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
          <Link
            to="/online/qualites/plan-action/tickets/liste"
            className="no_style"
          >
            <Button variant="outlined" startIcon={<ArrowBack />}>
              Retour à la liste
            </Button>
          </Link>
          <Box>
            {canManageQuality && 
              <Link
                to={`/online/qualites/plan-action/tickets/modifier/${ticketData?.ticket?.id}`}
                className="no_style"
              >
                <Button variant="outlined" endIcon={<Edit />}>
                  Modifier
                </Button>
              </Link>
            }
          </Box>
        </Box>
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
              <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} /> Analyse
              </Typography>
              <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, mt: 1 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {ticketData?.ticket?.description || "Aucune analyse disponible"}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          {ticketData?.ticket?.isHaveEfcReport && ticketData?.ticket?.efcReports && ticketData?.ticket?.efcReports.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                  <FactCheck sx={{ mr: 1 }} /> CREX et déclarations aux autorités compétentes
                </Typography>
                {ticketData?.ticket?.efcReports.map((report, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff', borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <AssignmentInd sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                          <Typography variant="body1">
                            <strong>Intitulé CREX:</strong> {report.title || "Non spécifié"}
                          </Typography>
                        </Box>
                        {report.efcDate && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <Event sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                            <Typography variant="body1">
                              <strong>Date:</strong> {getFormatDate(report.efcDate)}
                            </Typography>
                          </Box>
                        )}
                        {report.document && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <InsertDriveFile sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                            <Typography variant="body1">
                              <strong>Document:</strong> <Link to={report.document} target="_blank" rel="noopener">Voir le document</Link>
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {report.declarationDate && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <DateRange sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                            <Typography variant="body1">
                              <strong>Date de déclaration:</strong> {getFormatDate(report.declarationDate)}
                            </Typography>
                          </Box>
                        )}
                        {report.employees && report.employees.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <Group sx={{ mr: 1, mt: 0.5, color: 'primary.main' }} />
                            <Box>
                              <Typography variant="body1">
                                <strong>Participants:</strong>
                              </Typography>
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
                            </Box>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Paper>
            </Grid>
          )}
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 1 }} /> Actions
              </Typography>
              {ticketData?.ticket?.actions && ticketData?.ticket?.actions.length > 0 ? (
                ticketData?.ticket?.actions.map((action, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff', borderRadius: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                          <Description sx={{ mr: 1, mt: 0.5, color: 'secondary.main' }} />
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                            <strong>Description:</strong> {action.description}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {action.dueDate && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DateRange sx={{ mr: 1, color: 'secondary.main' }} />
                            <Typography variant="body1">
                              <strong>Échéance:</strong> {getFormatDate(action.dueDate)}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Flag sx={{ mr: 1, color: 'secondary.main' }} />
                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <strong>Statut:</strong> 
                            <Box sx={{ ml: 1 }}>
                              <TaskActionStatusLabelMenu taskAction={action} />
                            </Box>
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        {action.employees && action.employees.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Person sx={{ mr: 1, mt: 0.5, color: 'secondary.main' }} />
                            <Box>
                              <Typography variant="body1">
                                <strong>Personnes concernées:</strong>
                              </Typography>
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
                            </Box>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, mt: 1 }}>
                  <Typography variant="body1">Aucune action associée</Typography>
                </Box>
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
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  Réference : <b>{ticket?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {ticket?.title}
                </Typography>
                
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                  <Flag sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <b>Priorité:</b>
                    <Chip
                      color="info"
                      label={getPriorityLabel(ticket?.priority)}
                      sx={{ marginLeft: 1 }}
                    />
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                  <Assignment sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <b>Status:</b>
                    <Box sx={{ ml: 1 }}>
                      <TicketStatusLabelMenu ticket={ticket} />
                    </Box>
                  </Typography>
                </Box>
                
                {ticket?.ticketType && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <FactCheck sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      <b>Type de ticket:</b> {ticket.ticketType}
                    </Typography>
                  </Box>
                )}
                
                {ticket?.employee && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <b>Employé responsable:</b> 
                      <Chip
                        avatar={<Avatar>{ticket.employee.firstName?.charAt(0)}{ticket.employee.lastName?.charAt(0)}</Avatar>}
                        label={`${ticket.employee.firstName} ${ticket.employee.lastName}`}
                        variant="outlined"
                        size="small"
                        sx={{ marginLeft: 1 }}
                      />
                    </Typography>
                  </Box>
                )}
                
                {ticket?.folder && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <FolderOpen sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      <b>Dossier:</b> {ticket.folder.number} - <b> </b>{ticket.folder.name}
                    </Typography>
                  </Box>
                )}
                
                {ticket?.undesirableEvent && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
                    <Warning sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      <b>Événement indésirable:</b> {ticket.undesirableEvent.title}
                    </Typography>
                  </Box>
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
  return (
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
      {/* Structures concernées */}
      {ticket?.establishments && ticket?.establishments.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle3" component="h3" sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ mr: 1 }} /> Structures concernées
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
        </>
      )}
    </Paper>
  );
}

