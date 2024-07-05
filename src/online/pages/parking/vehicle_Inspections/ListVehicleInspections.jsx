import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import VehicleInspectionItemCard from './VehicleInspectionItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_VEHICLE_INSPECTION } from '../../../../_shared/graphql/mutations/VehicleInspectionMutations';
import { GET_VEHICLE_INSPECTIONS } from '../../../../_shared/graphql/queries/VehicleInspectionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import VehicleInspectionFilter from './VehicleInspectionFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListVehicleInspections from './TableListVehicleInspections';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListVehicleInspections() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [vehicleInspectionFilter, setVehicleInspectionFilter] =
    React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setVehicleInspectionFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getVehicleInspections,
    {
      loading: loadingVehicleInspections,
      data: vehicleInspectionsData,
      error: vehicleInspectionsError,
      fetchMore: fetchMoreVehicleInspections,
    },
  ] = useLazyQuery(GET_VEHICLE_INSPECTIONS, {
    variables: {
      vehicleInspectionFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getVehicleInspections();
  }, [paginator]);

  const [deleteVehicleInspection, { loading: loadingDelete }] = useMutation(
    DELETE_VEHICLE_INSPECTION,
    {
      onCompleted: (datas) => {
        if (datas.deleteVehicleInspection.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteVehicleInspection.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteVehicleInspection } }) {
        console.log('Updating cache after deletion:', deleteVehicleInspection);

        const deletedVehicleInspectionId = deleteVehicleInspection.id;

        cache.modify({
          fields: {
            vehicleInspections(
              existingVehicleInspections = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedVehicleInspections =
                existingVehicleInspections.nodes.filter(
                  (vehicleInspection) =>
                    readField('id', vehicleInspection) !==
                    deletedVehicleInspectionId,
                );

              console.log(
                'Updated vehicleInspections:',
                updatedVehicleInspections,
              );

              return {
                totalCount: existingVehicleInspections.totalCount - 1,
                nodes: updatedVehicleInspections,
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

  const onDeleteVehicleInspection = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteVehicleInspection({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/parc-automobile/controles-vehicules/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un contrôle véhicule
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <VehicleInspectionFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingVehicleInspections && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {vehicleInspectionsData?.vehicleInspections?.nodes?.length < 1 &&
              !loadingVehicleInspections && (
                <Alert severity="warning">Aucun contrôle véhicule trouvé.</Alert>
              )}
            {vehicleInspectionsData?.vehicleInspections?.nodes?.map(
              (vehicleInspection, index) => (
                <Grid item xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <VehicleInspectionItemCard
                      vehicleInspection={vehicleInspection}
                      onDeleteVehicleInspection={onDeleteVehicleInspection}
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListVehicleInspections
          loading={loadingVehicleInspections}
          rows={vehicleInspectionsData?.vehicleInspections?.nodes || []}
          onDeleteVehicleInspection={onDeleteVehicleInspection}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={vehicleInspectionsData?.vehicleInspections?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
