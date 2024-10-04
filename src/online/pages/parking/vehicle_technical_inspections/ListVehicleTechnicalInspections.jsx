import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import VehicleTechnicalInspectionItemCard from './VehicleTechnicalInspectionItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_VEHICLE_TECH_INSPECTION } from '../../../../_shared/graphql/mutations/VehicleTechnicalInspectionMutations';
import { GET_VEHICLE_TECH_INSPECTIONS } from '../../../../_shared/graphql/queries/VehicleTechnicalInspectionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import VehicleTechnicalInspectionFilter from './VehicleTechnicalInspectionFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListVehicleTechnicalInspections from './TableListVehicleTechnicalInspections';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListVehicleTechnicalInspections() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [vehicleTechnicalInspectionFilter, setVehicleTechnicalInspectionFilter] =
    React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setVehicleTechnicalInspectionFilter(newFilter);
    setPaginator({ ...paginator, page: 1 });
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getVehicleTechnicalInspections,
    {
      loading: loadingVehicleTechnicalInspections,
      data: vehicleTechnicalInspectionsData,
      error: vehicleTechnicalInspectionsError,
      fetchMore: fetchMoreVehicleTechnicalInspections,
    },
  ] = useLazyQuery(GET_VEHICLE_TECH_INSPECTIONS, {
    variables: {
      vehicleTechnicalInspectionFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getVehicleTechnicalInspections();
  }, [paginator]);

  const [deleteVehicleTechnicalInspection, { loading: loadingDelete }] = useMutation(
    DELETE_VEHICLE_TECH_INSPECTION,
    {
      onCompleted: (datas) => {
        if (datas.deleteVehicleTechnicalInspection.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteVehicleTechnicalInspection.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteVehicleTechnicalInspection } }) {
        console.log('Updating cache after deletion:', deleteVehicleTechnicalInspection);

        const deletedVehicleTechnicalInspectionId = deleteVehicleTechnicalInspection.id;

        cache.modify({
          fields: {
            vehicleTechnicalInspections(
              existingVehicleTechnicalInspections = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedVehicleTechnicalInspections =
                existingVehicleTechnicalInspections.nodes.filter(
                  (vehicleTechnicalInspection) =>
                    readField('id', vehicleTechnicalInspection) !==
                    deletedVehicleTechnicalInspectionId,
                );

              console.log(
                'Updated vehicleTechnicalInspections:',
                updatedVehicleTechnicalInspections,
              );

              return {
                totalCount: existingVehicleTechnicalInspections.totalCount - 1,
                nodes: updatedVehicleTechnicalInspections,
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

  const onDeleteVehicleTechnicalInspection = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteVehicleTechnicalInspection({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/parc-automobile/controles-techniques/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un contrôle technique
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <VehicleTechnicalInspectionFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingVehicleTechnicalInspections && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {vehicleTechnicalInspectionsData?.vehicleTechnicalInspections?.nodes?.length < 1 &&
              !loadingVehicleTechnicalInspections && (
                <Alert severity="warning">Aucun contrôle technique trouvé.</Alert>
              )}
            {vehicleTechnicalInspectionsData?.vehicleTechnicalInspections?.nodes?.map(
              (vehicleTechnicalInspection, index) => (
                <Grid item xs={2} sm={4} md={3} key={index}>
                  <Item>
                    <VehicleTechnicalInspectionItemCard
                      vehicleTechnicalInspection={vehicleTechnicalInspection}
                      onDeleteVehicleTechnicalInspection={onDeleteVehicleTechnicalInspection}
                    />
                  </Item>
                </Grid>
              ),
            )}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item xs={12}>
        <TableListVehicleTechnicalInspections
          loading={loadingVehicleTechnicalInspections}
          rows={vehicleTechnicalInspectionsData?.vehicleTechnicalInspections?.nodes || []}
          onDeleteVehicleTechnicalInspection={onDeleteVehicleTechnicalInspection}
          onFilterChange={(newFilter) => handleFilterChange({ ...vehicleTechnicalInspectionFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={vehicleTechnicalInspectionsData?.vehicleTechnicalInspections?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
