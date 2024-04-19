import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import UndesirableEventItemCard from './UndesirableEventItemCard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_UDESIRABLE_EVENT,
  PUT_UDESIRABLE_EVENT_STATE,
} from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import { GET_UDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import UndesirableEventFilter from './UndesirableEventFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListUndesirableEvents from './TableListUndesirableEvents';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListUndesirableEvents() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [undesirableEventFilter, setUndesirableEventFilter] =
    React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setUndesirableEventFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getUndesirableEvents,
    {
      loading: loadingUndesirableEvents,
      data: undesirableEventsData,
      error: undesirableEventsError,
      fetchMore: fetchMoreUndesirableEvents,
    },
  ] = useLazyQuery(GET_UDESIRABLE_EVENTS, {
    variables: {
      undesirableEventFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getUndesirableEvents();
  }, [undesirableEventFilter, paginator]);

  const [deleteUndesirableEvent, { loading: loadingDelete }] = useMutation(
    DELETE_UDESIRABLE_EVENT,
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
            message: `Non Supprimé ! ${datas.deleteUndesirableEvent.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteUndesirableEvent } }) {
        console.log('Updating cache after deletion:', deleteUndesirableEvent);

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

  const [updateUndesirableEventState, { loading: loadingPutState }] =
    useMutation(PUT_UDESIRABLE_EVENT_STATE, {
      onCompleted: (datas) => {
        if (datas.updateUndesirableEventState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateUndesirableEventState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_UDESIRABLE_EVENTS }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    });

  const onUpdateUndesirableEventState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateUndesirableEventState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
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
      <Grid item="true" xs={12}>
        <UndesirableEventFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item="true" xs={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {loadingUndesirableEvents && <Grid key={'pgrs'}  item="true" xs={2} sm={4} md={3}><ProgressService type="mediaCard" /></Grid>}
              {undesirableEventsData?.undesirableEvents?.nodes?.length < 1 && !loadingUndesirableEvents && <Alert severity="warning">Aucun événement indésirable trouvé.</Alert>}
              {undesirableEventsData?.undesirableEvents?.nodes?.map((undesirableEvent, index) => (
                <Grid xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <UndesirableEventItemCard 
                                        undesirableEvent={undesirableEvent}
                                        onDeleteUndesirableEvent={onDeleteUndesirableEvent}
                                        onUpdateUndesirableEventState={onUpdateUndesirableEventState}
                    />
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid> */}
      <Grid item="true" xs={12}>
        <TableListUndesirableEvents
          loading={loadingUndesirableEvents}
          rows={undesirableEventsData?.undesirableEvents?.nodes || []}
          onDeleteUndesirableEvent={onDeleteUndesirableEvent}
          onUpdateUndesirableEventState={onUpdateUndesirableEventState}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={undesirableEventsData?.undesirableEvents?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
