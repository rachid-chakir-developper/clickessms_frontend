
import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_UNDESIRABLE_EVENT } from '../../../../../_shared/graphql/mutations/UndesirableEventMutations';
import { GET_UNDESIRABLE_EVENTS } from '../../../../../_shared/graphql/queries/UndesirableEventQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListUndesirableEvents from '../../../qualities/undesirable-events/TableListUndesirableEvents';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryUndesirableEvents({establishment}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [undesirableEventFilter, setUndesirableEventFilter] =
    React.useState({establishments: [establishment?.id]});
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
  ] = useLazyQuery(GET_UNDESIRABLE_EVENTS, {
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListUndesirableEvents
          loading={loadingUndesirableEvents}
          rows={undesirableEventsData?.undesirableEvents?.nodes || []}
          onDeleteUndesirableEvent={onDeleteUndesirableEvent}
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
