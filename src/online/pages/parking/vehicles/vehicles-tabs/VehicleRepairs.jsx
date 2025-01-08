import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_VEHICLE_REPAIR } from '../../../../../_shared/graphql/mutations/VehicleRepairMutations';
import { GET_VEHICLE_REPAIRS } from '../../../../../_shared/graphql/queries/VehicleRepairQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListVehicleRepairs from '../../vehicle_repairs/TableListVehicleRepairs';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function VehicleRepairs({vehicle}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [vehicleRepairFilter, setVehicleRepairFilter] =
    React.useState({vehicles: [vehicle?.id]});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setVehicleRepairFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getVehicleRepairs,
    {
      loading: loadingVehicleRepairs,
      data: vehicleRepairsData,
      error: vehicleRepairsError,
      fetchMore: fetchMoreVehicleRepairs,
    },
  ] = useLazyQuery(GET_VEHICLE_REPAIRS, {
    variables: {
      vehicleRepairFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getVehicleRepairs();
  }, [vehicleRepairFilter, paginator]);

  const [deleteVehicleRepair, { loading: loadingDelete }] = useMutation(
    DELETE_VEHICLE_REPAIR,
    {
      onCompleted: (datas) => {
        if (datas.deleteVehicleRepair.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteVehicleRepair.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteVehicleRepair } }) {
        console.log('Updating cache after deletion:', deleteVehicleRepair);

        const deletedVehicleRepairId = deleteVehicleRepair.id;

        cache.modify({
          fields: {
            vehicleRepairs(
              existingVehicleRepairs = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedVehicleRepairs =
                existingVehicleRepairs.nodes.filter(
                  (vehicleRepair) =>
                    readField('id', vehicleRepair) !==
                    deletedVehicleRepairId,
                );

              console.log(
                'Updated vehicleRepairs:',
                updatedVehicleRepairs,
              );

              return {
                totalCount: existingVehicleRepairs.totalCount - 1,
                nodes: updatedVehicleRepairs,
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

  const onDeleteVehicleRepair = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteVehicleRepair({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListVehicleRepairs
          loading={loadingVehicleRepairs}
          rows={vehicleRepairsData?.vehicleRepairs?.nodes || []}
          onDeleteVehicleRepair={onDeleteVehicleRepair}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={vehicleRepairsData?.vehicleRepairs?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
