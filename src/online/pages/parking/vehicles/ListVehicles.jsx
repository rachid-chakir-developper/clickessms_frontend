import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import VehicleItemCard from './VehicleItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_VEHICLE,
  PUT_VEHICLE_STATE,
} from '../../../../_shared/graphql/mutations/VehicleMutations';
import { GET_VEHICLES } from '../../../../_shared/graphql/queries/VehicleQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import VehicleFilter from './VehicleFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListVehicles from './TableListVehicles';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListVehicles() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 12 });
  const [vehicleFilter, setVehicleFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setVehicleFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getVehicles,
    {
      loading: loadingVehicles,
      data: vehiclesData,
      error: vehiclesError,
      fetchMore: fetchMoreVehicles,
    },
  ] = useLazyQuery(GET_VEHICLES, {
    variables: { vehicleFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getVehicles();
  }, [vehicleFilter, paginator]);
  const [deleteVehicle, { loading: loadingDelete }] = useMutation(
    DELETE_VEHICLE,
    {
      onCompleted: (datas) => {
        if (datas.deleteVehicle.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteVehicle.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteVehicle } }) {
        console.log('Updating cache after deletion:', deleteVehicle);

        const deletedVehicleId = deleteVehicle.id;

        cache.modify({
          fields: {
            vehicles(
              existingVehicles = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedVehicles = existingVehicles.nodes.filter(
                (vehicle) => readField('id', vehicle) !== deletedVehicleId,
              );

              console.log('Updated vehicles:', updatedVehicles);

              return {
                totalCount: existingVehicles.totalCount - 1,
                nodes: updatedVehicles,
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

  const onDeleteVehicle = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteVehicle({ variables: { id: id } });
      },
    });
  };
  const [updateVehicleState, { loading: loadingPutState }] = useMutation(
    PUT_VEHICLE_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateVehicleState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateVehicleState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_VEHICLES }],
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

  const onUpdateVehicleState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateVehicleState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/parc-automobile/vehicules/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un véhicule
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <VehicleFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingVehicles && (
              <Grid key={'pgrs'} item="true" xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {vehiclesData?.vehicles?.nodes?.length < 1 && !loadingVehicles && (
              <Alert severity="warning">Aucun véhicule trouvé.</Alert>
            )}
            {vehiclesData?.vehicles?.nodes?.map((vehicle, index) => (
              <Grid xs={12} sm={6} md={4} key={index}>
                <Item>
                  <VehicleItemCard
                    vehicle={vehicle}
                    onDeleteVehicle={onDeleteVehicle}
                    onUpdateVehicleState={onUpdateVehicleState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item="true" xs={12}>
        <TableListVehicles
          loading={loadingVehicles}
          rows={vehiclesData?.vehicles?.nodes || []}
          onDeleteVehicle={onDeleteVehicle}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={vehiclesData?.vehicles?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
