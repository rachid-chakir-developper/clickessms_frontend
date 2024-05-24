
import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_EVENT } from '../../../../../_shared/graphql/mutations/EventMutations';
import { GET_EVENTS } from '../../../../../_shared/graphql/queries/EventQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TableListEvents from '../../../activities/events/TableListEvents';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryEvents({beneficiary}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [eventFilter, setEventFilter] =
    React.useState({beneficiaries: [beneficiary?.id]});
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
    variables: {
      eventFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getEvents();
  }, [eventFilter, paginator]);

  const [deleteEvent, { loading: loadingDelete }] = useMutation(
    DELETE_EVENT,
    {
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
            events(
              existingEvents = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEvents =
                existingEvents.nodes.filter(
                  (event) =>
                    readField('id', event) !==
                    deletedEventId,
                );

              console.log(
                'Updated events:',
                updatedEvents,
              );

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
    },
  );

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

  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <TableListEvents
          loading={loadingEvents}
          rows={eventsData?.events?.nodes || []}
          onDeleteEvent={onDeleteEvent}
        />
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
