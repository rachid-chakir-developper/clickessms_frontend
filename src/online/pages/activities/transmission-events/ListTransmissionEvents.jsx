import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_TRANSMISSION_EVENT,
  PUT_TRANSMISSION_EVENT_STATE,
} from '../../../../_shared/graphql/mutations/TransmissionEventMutations';
import { GET_TRANSMISSION_EVENTS } from '../../../../_shared/graphql/queries/TransmissionEventQueries';
import TransmissionEventFilter from './TransmissionEventFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListTransmissionEvents from './TableListTransmissionEvents';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListTransmissionEvents() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [transmissionEventFilter, setTransmissionEventFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setTransmissionEventFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getTransmissionEvents,
    {
      loading: loadingTransmissionEvents,
      data: transmissionEventsData,
      error: transmissionEventsError,
      fetchMore: fetchMoreTransmissionEvents,
    },
  ] = useLazyQuery(GET_TRANSMISSION_EVENTS, {
    variables: { transmissionEventFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getTransmissionEvents();
  }, [transmissionEventFilter, paginator]);

  const [deleteTransmissionEvent, { loading: loadingDelete }] = useMutation(DELETE_TRANSMISSION_EVENT, {
    onCompleted: (datas) => {
      if (datas.deleteTransmissionEvent.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteTransmissionEvent.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteTransmissionEvent } }) {
      console.log('Updating cache after deletion:', deleteTransmissionEvent);

      const deletedTransmissionEventId = deleteTransmissionEvent.id;

      cache.modify({
        fields: {
          transmissionEvents(existingTransmissionEvents = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedTransmissionEvents = existingTransmissionEvents.nodes.filter(
              (transmissionEvent) => readField('id', transmissionEvent) !== deletedTransmissionEventId,
            );

            console.log('Updated transmissionEvents:', updatedTransmissionEvents);

            return {
              totalCount: existingTransmissionEvents.totalCount - 1,
              nodes: updatedTransmissionEvents,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onDeleteTransmissionEvent = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteTransmissionEvent({ variables: { id: id } });
      },
    });
  };

  const [updateTransmissionEventState, { loading: loadingPutState }] = useMutation(
    PUT_TRANSMISSION_EVENT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateTransmissionEventState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateTransmissionEventState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_TRANSMISSION_EVENTS }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

  const onUpdateTransmissionEventState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTransmissionEventState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/activites/evenements/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un événement
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TransmissionEventFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListTransmissionEvents
          loading={loadingTransmissionEvents}
          rows={transmissionEventsData?.transmissionEvents?.nodes || []}
          onDeleteTransmissionEvent={onDeleteTransmissionEvent}
          onFilterChange={(newFilter) => handleFilterChange({ ...transmissionEventFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={transmissionEventsData?.transmissionEvents?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
