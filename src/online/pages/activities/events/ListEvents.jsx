import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import EventItemCard from './EventItemCard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_EVENT,
  PUT_EVENT_STATE,
} from '../../../../_shared/graphql/mutations/EventMutations';
import { GET_EVENTS } from '../../../../_shared/graphql/queries/EventQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import EventFilter from './EventFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListEvents() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [eventFilter, setEventFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEventFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEvents,
    {
      loading: loadingEvents,
      data: eventsData,
      error: eventsError,
      fetchMore: fetchMoreEvents,
    },
  ] = useLazyQuery(GET_EVENTS, {
    variables: { eventFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getEvents();
  }, [eventFilter, paginator]);

  const [deleteEvent, { loading: loadingDelete }] = useMutation(DELETE_EVENT, {
    onCompleted: (datas) => {
      if (datas.deleteEvent.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non Supprimé ! ${datas.deleteEvent.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteEvent } }) {
      console.log('Updating cache after deletion:', deleteEvent);

      const deletedEventId = deleteEvent.id;

      cache.modify({
        fields: {
          events(existingEvents = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedEvents = existingEvents.nodes.filter(
              (event) => readField('id', event) !== deletedEventId,
            );

            console.log('Updated events:', updatedEvents);

            return {
              totalCount: existingEvents.totalCount - 1,
              nodes: updatedEvents,
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
  });

  const onDeleteEvent = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteEvent({ variables: { id: id } });
      },
    });
  };

  const [updateEventState, { loading: loadingPutState }] = useMutation(
    PUT_EVENT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateEventState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateEventState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_EVENTS }],
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

  const onUpdateEventState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEventState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/activites/evenements/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un événement
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <EventFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingEvents && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {eventsData?.events?.nodes?.length < 1 && !loadingEvents && (
              <Alert severity="warning">Aucun événement trouvé.</Alert>
            )}
            {eventsData?.events?.nodes?.map((event, index) => (
              <Grid xs={2} sm={4} md={3} key={index}>
                <Item>
                  <EventItemCard
                    event={event}
                    onDeleteEvent={onDeleteEvent}
                    onUpdateEventState={onUpdateEventState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={eventsData?.events?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
