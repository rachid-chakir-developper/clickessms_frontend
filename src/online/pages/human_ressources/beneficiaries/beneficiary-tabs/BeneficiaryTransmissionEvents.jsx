
import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_TRANSMISSION_EVENT } from '../../../../../_shared/graphql/mutations/TransmissionEventMutations';
import { GET_TRANSMISSION_EVENTS } from '../../../../../_shared/graphql/queries/TransmissionEventQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TableListTransmissionEvents from '../../../activities/transmission-events/TableListTransmissionEvents';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BeneficiaryTransmissionEvents({beneficiary}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [transmissionEventFilter, setTransmissionEventFilter] =
    React.useState({beneficiaries: [beneficiary?.id]});
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
    variables: {
      transmissionEventFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getTransmissionEvents();
  }, [transmissionEventFilter, paginator]);

  const [deleteTransmissionEvent, { loading: loadingDelete }] = useMutation(
    DELETE_TRANSMISSION_EVENT,
    {
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
            message: `Non Supprimé ! ${datas.deleteTransmissionEvent.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteTransmissionEvent } }) {
        console.log('Updating cache after deletion:', deleteTransmissionEvent);

        const deletedTransmissionEventId = deleteTransmissionEvent.id;

        cache.modify({
          fields: {
            transmissionEvents(
              existingTransmissionEvents = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedTransmissionEvents =
                existingTransmissionEvents.nodes.filter(
                  (transmissionEvent) =>
                    readField('id', transmissionEvent) !==
                    deletedTransmissionEventId,
                );

              console.log(
                'Updated transmissionEvents:',
                updatedTransmissionEvents,
              );

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
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListTransmissionEvents
          loading={loadingTransmissionEvents}
          rows={transmissionEventsData?.transmissionEvents?.nodes || []}
          onDeleteTransmissionEvent={onDeleteTransmissionEvent}
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
