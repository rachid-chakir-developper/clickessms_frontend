import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_UNDESIRABLE_EVENT,
  POST_UNDESIRABLE_EVENT_TICKET,
  PUT_UNDESIRABLE_EVENT_STATE,
} from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import UndesirableEventFilter from './UndesirableEventFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListUndesirableEvents from './TableListUndesirableEvents';
import { ON_UNDESIRABLE_EVENT_ADDED, ON_UNDESIRABLE_EVENT_DELETED, ON_UNDESIRABLE_EVENT_UPDATED } from '../../../../_shared/graphql/subscriptions/UndesirableEventSubscriptions';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListUndesirableEvents() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [undesirableEventFilter, setUndesirableEventFilter] =
    React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setUndesirableEventFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getUndesirableEvents,
    {
      loading: loadingUndesirableEvents,
      data: undesirableEventsData,
      subscribeToMore: subscribeToMoreUndesirableEvent,
      error: undesirableEventsError,
      fetchMore: fetchMoreUndesirableEvents,
    },
  ] = useLazyQuery(GET_UNDESIRABLE_EVENTS, {
    variables: {
      undesirableEventFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  // Souscription pour l'ajout d'un événement indésirable
  subscribeToMoreUndesirableEvent({
    document: ON_UNDESIRABLE_EVENT_ADDED,
    updateQuery: (prev, { subscriptionData }) => {
      console.log('Event Added:', subscriptionData);
      if (!subscriptionData.data) return prev;
  
      const newUndesirableEvent = subscriptionData.data.onUndesirableEventAdded.undesirableEvent;
  
      // Si l'événement existe déjà, ne pas l'ajouter
      if (prev.undesirableEvents.nodes.map(e => e.id).includes(newUndesirableEvent.id)) return prev;
  
      return {
        undesirableEvents: {
          totalCount: prev.undesirableEvents.totalCount + 1,
          nodes: [newUndesirableEvent, ...prev.undesirableEvents.nodes]
        }
      };
    }
  });
  
  // Souscription pour la mise à jour d'un événement indésirable
  subscribeToMoreUndesirableEvent({
    document: ON_UNDESIRABLE_EVENT_UPDATED,
    updateQuery: (prev, { subscriptionData }) => {
      console.log('Event Updated:', subscriptionData);
      if (!subscriptionData.data) return prev;
  
      const updatedUndesirableEvent = subscriptionData.data.onUndesirableEventUpdated.undesirableEvent;
      const eventIndex = prev.undesirableEvents.nodes.findIndex(e => e.id === updatedUndesirableEvent.id);
  
      // Si l'événement existe dans la liste, le mettre à jour
      if (eventIndex >= 0) {
        const updatedUndesirableEvents = [...prev.undesirableEvents.nodes];
        updatedUndesirableEvents[eventIndex] = updatedUndesirableEvent;
  
        return {
          undesirableEvents: {
            totalCount: prev.undesirableEvents.totalCount,
            nodes: updatedUndesirableEvents
          }
        };
      }
  
      return prev;
    }
  });
  
  // Souscription pour la suppression d'un événement indésirable
  subscribeToMoreUndesirableEvent({
    document: ON_UNDESIRABLE_EVENT_DELETED,
    updateQuery: (prev, { subscriptionData }) => {
      console.log('Event Deleted:', subscriptionData);
      if (!subscriptionData.data) return prev;
  
      const deletedUndesirableEvent = subscriptionData.data.onUndesirableEventDeleted.undesirableEvent;
  
      return {
        undesirableEvents: {
          totalCount: prev.undesirableEvents.totalCount - 1,
          nodes: prev.undesirableEvents.nodes.filter(e => e.id !== deletedUndesirableEvent.id)
        }
      };
    }
  });
  

  React.useEffect(() => {
    getUndesirableEvents();
  }, [paginator]);

  const [deleteUndesirableEvent, { loading: loadingDelete }] = useMutation(
    DELETE_UNDESIRABLE_EVENT,
    {
      onCompleted: (datas) => {
        if (datas.deleteUndesirableEvent.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteUndesirableEvent.message}`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteUndesirableEvent } }) {
        console.log('Updating cache after deletion:', deleteUndesirableEvent);
        if(!deleteUndesirableEvent?.deleted) return
        const deletedUndesirableEventId = deleteUndesirableEvent.id;
        cache.modify({
          fields: {
            undesirableEvents(
              existingUndesirableEvents = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedUndesirableEvents =
                existingUndesirableEvents.nodes.filter(
                  (undesirableEvent) =>
                    readField('id', undesirableEvent) !==
                    deletedUndesirableEventId,
                );

              console.log(
                'Updated undesirableEvents:',
                updatedUndesirableEvents,
              );

              return {
                totalCount: existingUndesirableEvents.totalCount - 1,
                nodes: updatedUndesirableEvents,
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

  const onDeleteUndesirableEvent = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteUndesirableEvent({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/qualites/evenements-indesirables/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un événement indésirable
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <UndesirableEventFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {loadingUndesirableEvents && <Grid key={'pgrs'}  item xs={2} sm={4} md={3}><ProgressService type="mediaCard" /></Grid>}
              {undesirableEventsData?.undesirableEvents?.nodes?.length < 1 && !loadingUndesirableEvents && <Alert severity="warning">Aucun événement indésirable trouvé.</Alert>}
              {undesirableEventsData?.undesirableEvents?.nodes?.map((undesirableEvent, index) => (
                <Grid item xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <UndesirableEventItemCard 
                                        undesirableEvent={undesirableEvent}
                                        onDeleteUndesirableEvent={onDeleteUndesirableEvent}
                                        onCreateUndesirableEventTicket={onCreateUndesirableEventTicket}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid> */}
      <Grid item xs={12}>
        <TableListUndesirableEvents
          loading={loadingUndesirableEvents}
          rows={undesirableEventsData?.undesirableEvents?.nodes || []}
          onDeleteUndesirableEvent={onDeleteUndesirableEvent}
          onFilterChange={(newFilter) => handleFilterChange({ ...undesirableEventFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={undesirableEventsData?.undesirableEvents?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
