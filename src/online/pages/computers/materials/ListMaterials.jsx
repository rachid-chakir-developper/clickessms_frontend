import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_MATERIAL,
  PUT_MATERIAL_STATE,
} from '../../../../_shared/graphql/mutations/MaterialMutations';
import { GET_MATERIALS } from '../../../../_shared/graphql/queries/MaterialQueries';
import MaterialFilter from './MaterialFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListMaterials from './TableListMaterials';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListMaterials() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [materialFilter, setMaterialFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setMaterialFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getMaterials,
    {
      loading: loadingMaterials,
      data: materialsData,
      error: materialsError,
      fetchMore: fetchMoreMaterials,
    },
  ] = useLazyQuery(GET_MATERIALS, {
    variables: { materialFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getMaterials();
  }, [materialFilter, paginator]);

  const [deleteMaterial, { loading: loadingDelete }] = useMutation(DELETE_MATERIAL, {
    onCompleted: (datas) => {
      if (datas.deleteMaterial.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteMaterial.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteMaterial } }) {
      console.log('Updating cache after deletion:', deleteMaterial);

      const deletedMaterialId = deleteMaterial.id;

      cache.modify({
        fields: {
          materials(existingMaterials = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedMaterials = existingMaterials.nodes.filter(
              (material) => readField('id', material) !== deletedMaterialId,
            );

            console.log('Updated materials:', updatedMaterials);

            return {
              totalCount: existingMaterials.totalCount - 1,
              nodes: updatedMaterials,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

  const onDeleteMaterial = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteMaterial({ variables: { id: id } });
      },
    });
  };

  const [updateMaterialState, { loading: loadingPutState }] = useMutation(
    PUT_MATERIAL_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateMaterialState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateMaterialState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_MATERIALS }],
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

  const onUpdateMaterialState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateMaterialState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/informatique/materiels/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un matériel
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <MaterialFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListMaterials
          loading={loadingMaterials}
          rows={materialsData?.materials?.nodes || []}
          onDeleteMaterial={onDeleteMaterial}
          onFilterChange={(newFilter) => handleFilterChange({ ...materialFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={materialsData?.materials?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
