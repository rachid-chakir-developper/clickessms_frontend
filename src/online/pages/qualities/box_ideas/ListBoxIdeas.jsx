import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_BOX_IDEA,
  PUT_BOX_IDEA_STATE,
} from '../../../../_shared/graphql/mutations/BoxIdeaMutations';
import { GET_BOX_IDEAS } from '../../../../_shared/graphql/queries/BoxIdeaQueries';
import BoxIdeaFilter from './BoxIdeaFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListBoxIdeas from './TableListBoxIdeas';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListBoxIdeas() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [boxIdeaFilter, setBoxIdeaFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBoxIdeaFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBoxIdeas,
    {
      loading: loadingBoxIdeas,
      data: boxIdeasData,
      error: boxIdeasError,
      fetchMore: fetchMoreBoxIdeas,
    },
  ] = useLazyQuery(GET_BOX_IDEAS, {
    variables: { boxIdeaFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBoxIdeas();
  }, [boxIdeaFilter, paginator]);

  const [deleteBoxIdea, { loading: loadingDelete }] = useMutation(DELETE_BOX_IDEA, {
    onCompleted: (datas) => {
      if (datas.deleteBoxIdea.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteBoxIdea.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteBoxIdea } }) {
      console.log('Updating cache after deletion:', deleteBoxIdea);

      const deletedBoxIdeaId = deleteBoxIdea.id;

      cache.modify({
        fields: {
          boxIdeas(existingBoxIdeas = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedBoxIdeas = existingBoxIdeas.nodes.filter(
              (boxIdea) => readField('id', boxIdea) !== deletedBoxIdeaId,
            );

            console.log('Updated boxIdeas:', updatedBoxIdeas);

            return {
              totalCount: existingBoxIdeas.totalCount - 1,
              nodes: updatedBoxIdeas,
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

  const onDeleteBoxIdea = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBoxIdea({ variables: { id: id } });
      },
    });
  };

  const [updateBoxIdeaState, { loading: loadingPutState }] = useMutation(
    PUT_BOX_IDEA_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBoxIdeaState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBoxIdeaState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BOX_IDEAS }],
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

  const onUpdateBoxIdeaState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBoxIdeaState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/qualites/boite-idees/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un idée
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BoxIdeaFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListBoxIdeas
          loading={loadingBoxIdeas}
          rows={boxIdeasData?.boxIdeas?.nodes || []}
          onDeleteBoxIdea={onDeleteBoxIdea}
          onFilterChange={(newFilter) => handleFilterChange({ ...boxIdeaFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={boxIdeasData?.boxIdeas?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
