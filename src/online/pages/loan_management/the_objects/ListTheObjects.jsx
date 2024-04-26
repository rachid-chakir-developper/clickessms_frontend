import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import TheObjectItemCard from './TheObjectItemCard';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_THE_OBJECT,
  PUT_THE_OBJECT_STATE,
} from '../../../../_shared/graphql/mutations/TheObjectMutations';
import { GET_THE_OBJECTS } from '../../../../_shared/graphql/queries/TheObjectQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheObjectFilter from './TheObjectFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListTheObjects() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [theObjectFilter, setTheObjectFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setTheObjectFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getTheObjects,
    {
      loading: loadingTheObjects,
      data: theObjectsData,
      error: theObjectsError,
      fetchMore: fetchMoreTheObjects,
    },
  ] = useLazyQuery(GET_THE_OBJECTS, {
    variables: {
      theObjectFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getTheObjects();
  }, [theObjectFilter, paginator]);

  const [deleteTheObject, { loading: loadingDelete }] = useMutation(
    DELETE_THE_OBJECT,
    {
      onCompleted: (datas) => {
        if (datas.deleteTheObject.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteTheObject.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteTheObject } }) {
        console.log('Updating cache after deletion:', deleteTheObject);

        const deletedTheObjectId = deleteTheObject.id;

        cache.modify({
          fields: {
            theObjects(
              existingTheObjects = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedTheObjects = existingTheObjects.nodes.filter(
                (theObject) =>
                  readField('id', theObject) !== deletedTheObjectId,
              );

              console.log('Updated theObjects:', updatedTheObjects);

              return {
                totalCount: existingTheObjects.totalCount - 1,
                nodes: updatedTheObjects,
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

  const onDeleteTheObject = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteTheObject({ variables: { id: id } });
      },
    });
  };

  const [updateTheObjectState, { loading: loadingPutState }] = useMutation(
    PUT_THE_OBJECT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateTheObjectState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateTheObjectState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_THE_OBJECTS }],
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

  const onUpdateTheObjectState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTheObjectState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/recuperations/objets/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un objet
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <TheObjectFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingTheObjects && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {theObjectsData?.theObjects?.nodes?.length < 1 &&
              !loadingTheObjects && (
                <Alert severity="warning">Aucun objet trouvé.</Alert>
              )}
            {theObjectsData?.theObjects?.nodes?.map((theObject, index) => (
              <Grid xs={2} sm={4} md={3} key={index}>
                <Item>
                  <TheObjectItemCard
                    theObject={theObject}
                    onDeleteTheObject={onDeleteTheObject}
                    onUpdateTheObjectState={onUpdateTheObjectState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={theObjectsData?.theObjects?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
