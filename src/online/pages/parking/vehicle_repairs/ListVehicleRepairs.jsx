import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import VehicleRepairItemCard from './VehicleRepairItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_VEHICLE_REPAIR } from '../../../../_shared/graphql/mutations/VehicleRepairMutations';
import { GET_VEHICLE_REPAIRS } from '../../../../_shared/graphql/queries/VehicleRepairQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import VehicleRepairFilter from './VehicleRepairFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListVehicleRepairs from './TableListVehicleRepairs';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListVehicleRepairs() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [vehicleRepairFilter, setVehicleRepairFilter] =
    React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setVehicleRepairFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
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
  }, [paginator]);

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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/parc-automobile/reparations/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une réparation
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <VehicleRepairFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingVehicleRepairs && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {vehicleRepairsData?.vehicleRepairs?.nodes?.length < 1 &&
              !loadingVehicleRepairs && (
                <Alert severity="warning">Aucune réparation trouvé.</Alert>
              )}
            {vehicleRepairsData?.vehicleRepairs?.nodes?.map(
              (vehicleRepair, index) => (
                <Grid item xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <VehicleRepairItemCard
                      vehicleRepair={vehicleRepair}
                      onDeleteVehicleRepair={onDeleteVehicleRepair}
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListVehicleRepairs
          loading={loadingVehicleRepairs}
          rows={vehicleRepairsData?.vehicleRepairs?.nodes || []}
          onDeleteVehicleRepair={onDeleteVehicleRepair}
          onFilterChange={(newFilter) => handleFilterChange({ ...vehicleRepairFilter, ...newFilter })}
          paginator={paginator}
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
