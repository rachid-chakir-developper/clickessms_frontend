import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import MaterialItemCard from './MaterialItemCard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_MATERIAL,
  PUT_MATERIAL_STATE,
} from '../../../_shared/graphql/mutations/MaterialMutations';
import { GET_MATERIALS } from '../../../_shared/graphql/queries/MaterialQueries';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import MaterialFilter from './MaterialFilter';
import PaginationControlled from '../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListMaterials() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
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
  const [deleteMaterial, { loading: loadingDelete }] = useMutation(
    DELETE_MATERIAL,
    {
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
            message: `Non Supprimé ! ${datas.deleteMaterial.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteMaterial } }) {
        console.log('Updating cache after deletion:', deleteMaterial);

        const deletedMaterialId = deleteMaterial.id;

        cache.modify({
          fields: {
            materials(
              existingMaterials = { totalCount: 0, nodes: [] },
              { readField },
            ) {
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
          message: 'Non Supprimé ! Veuillez réessayer.',
          type: 'error',
        });
      },
    },
  );

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
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/materiels/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un matériel
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <MaterialFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingMaterials && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {materialsData?.materials?.nodes?.length < 1 &&
              !loadingMaterials && (
                <Alert severity="warning">Aucun matériel trouvé.</Alert>
              )}
            {materialsData?.materials?.nodes?.map((material, index) => (
              <Grid xs={2} sm={4} md={3} key={index}>
                <Item>
                  <MaterialItemCard
                    material={material}
                    onDeleteMaterial={onDeleteMaterial}
                    onUpdateMaterialState={onUpdateMaterialState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={materialsData?.materials?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
