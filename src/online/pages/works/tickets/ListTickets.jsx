import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import TicketItemCard from './TicketItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { DELETE_TICKET } from '../../../../_shared/graphql/mutations/TicketMutations';
import { GET_TICKETS } from '../../../../_shared/graphql/queries/TicketQueries';
import TicketFilter from './TicketFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListTickets from './TableListTickets';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListTickets() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [ticketFilter, setTicketFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setTicketFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getTickets,
    {
      loading: loadingTickets,
      data: ticketsData,
      error: ticketsError,
      fetchMore: fetchMoreTickets,
    },
  ] = useLazyQuery(GET_TICKETS, {
    variables: { ticketFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getTickets();
  }, [ticketFilter, paginator]);

  const [deleteTicket, { loading: loadingDelete }] = useMutation(
    DELETE_TICKET,
    {
      onCompleted: (datas) => {
        if (datas.deleteTicket.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteTicket.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteTicket } }) {
        console.log('Updating cache after deletion:', deleteTicket);

        const deletedTicketId = deleteTicket.id;

        cache.modify({
          fields: {
            tickets(
              existingTickets = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedTickets = existingTickets.nodes.filter(
                (ticket) => readField('id', ticket) !== deletedTicketId,
              );

              console.log('Updated tickets:', updatedTickets);

              return {
                totalCount: existingTickets.totalCount - 1,
                nodes: updatedTickets,
              };
            },
          },
        });
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onDeleteTicket = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteTicket({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/qualites/plan-action/tickets/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un objectif
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TicketFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingTickets && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {ticketsData?.tickets?.nodes?.length < 1 && !loadingTickets && (
              <Alert severity="warning">Aucun ticket trouvé.</Alert>
            )}
            {ticketsData?.tickets?.nodes?.map((ticket, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <Item>
                  <TicketItemCard
                    ticket={ticket}
                    onDeleteTicket={onDeleteTicket}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListTickets
          loading={loadingTickets}
          rows={ticketsData?.tickets?.nodes || []}
          onDeleteTicket={onDeleteTicket}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={ticketsData?.tickets?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
