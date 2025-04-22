import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Stack, Button, ListItem, ListItemIcon, ListItemText, List, Avatar } from '@mui/material';

import { TICKET_RECAP } from '../../../../_shared/graphql/queries/TicketQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime, getPriorityLabel } from '../../../../_shared/tools/functions';
import EstablishmentItemCard from '../../companies/establishments/EstablishmentItemCard';
import { AssignmentInd, Check, Edit, ArrowBack } from '@mui/icons-material';
import TicketStatusLabelMenu from './TicketStatusLabelMenu';
import TicketTabs from './tickets-tabs/TicketTabs';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TicketDetails({ ticketId }) {
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
    else if (ticketId) {
      getTicket({ variables: { id: ticketId } });
    }
  }, [idTicket, ticketId]);

  if (loadingTicket) return <ProgressService type="form" />;
  return (
    <>
      <Stack>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
          <Link
            to="/online/informatique/tickets/liste"
            className="no_style"
          >
            <Button variant="outlined" startIcon={<ArrowBack />}>
              Retour à la liste
            </Button>
          </Link>
          <Box>
            {canManageQuality &&
              <Link
                to={`/online/informatique/tickets/modifier/${ticketData?.ticket?.id}`}
                className="no_style"
              >
                <Button variant="outlined" endIcon={<Edit />}>
                  Modifier
                </Button>
              </Link>
            }
          </Box>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <TicketMiniInfos ticket={ticketData?.ticket} />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Analyse
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {ticketData?.ticket?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper sx={{ padding: 2 }}>
              <TicketTabs ticket={ticketData?.ticket} />
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
                <Typography gutterBottom variant="h6" component="div">
                  {ticket?.title}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Crée le: </b> {`${getFormatDateTime(ticket?.createdAt)}`}{' '}
                  <br />
                  <b>Dernière modification: </b>
                  {`${getFormatDateTime(ticket?.updatedAt)}`}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Priorité de ticket</b>
                  <Chip
                    color="info"
                    label={getPriorityLabel(ticket?.priority)}
                    sx={{ marginLeft: 1 }}
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Status: </b>
                  <TicketStatusLabelMenu ticket={ticket} />
                </Typography>
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
    {ticket?.establishments.length > 0 && (
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
        <Paper sx={{ padding: 1, marginY: 1 }} variant="outlined">
          <Typography variant="h6" gutterBottom>
            Les structures concernées
          </Typography>
          <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
            {ticket?.establishments?.map((establishment, index) => (
              <Grid item xs={12} sm={12} md={12} key={index} sx={{ marginY: 1 }}>
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

