import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_VEHICLE_TECH_INSPECTION } from '../../../../../_shared/graphql/mutations/VehicleTechnicalInspectionMutations';
import { GET_VEHICLE_TECH_INSPECTIONS } from '../../../../../_shared/graphql/queries/VehicleTechnicalInspectionQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListVehicleTechnicalInspections from '../../vehicle_technical_inspections/TableListVehicleTechnicalInspections';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function VehicleTechnicalInspections({vehicle}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [vehicleTechnicalInspectionFilter, setVehicleTechnicalInspectionFilter] =
    React.useState({vehicles: [vehicle?.id]});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setVehicleTechnicalInspectionFilter(newFilter);
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
  }, [vehicleTechnicalInspectionFilter, paginator]);

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
      <Grid item="true" xs={12}>
        <TableListVehicleTechnicalInspections
          loading={loadingVehicleTechnicalInspections}
          rows={vehicleTechnicalInspectionsData?.vehicleTechnicalInspections?.nodes || []}
          onDeleteVehicleTechnicalInspection={onDeleteVehicleTechnicalInspection}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={vehicleTechnicalInspectionsData?.vehicleTechnicalInspections?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
