import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import ActionPlanObjectiveItemCard from './ActionPlanObjectiveItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_ACTION_PLAN_OBJECTIVE } from '../../../../../_shared/graphql/mutations/ActionPlanObjectiveMutations';
import { GET_ACTION_PLAN_OBJECTIVES } from '../../../../../_shared/graphql/queries/ActionPlanObjectiveQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import ActionPlanObjectiveFilter from './ActionPlanObjectiveFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListActionPlanObjectives from './TableListActionPlanObjectives';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListActionPlanObjectives() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [actionPlanObjectiveFilter, setActionPlanObjectiveFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setActionPlanObjectiveFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getActionPlanObjectives,
    {
      loading: loadingActionPlanObjectives,
      data: actionPlanObjectivesData,
      error: actionPlanObjectivesError,
      fetchMore: fetchMoreActionPlanObjectives,
    },
  ] = useLazyQuery(GET_ACTION_PLAN_OBJECTIVES, {
    variables: { actionPlanObjectiveFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getActionPlanObjectives();
  }, [actionPlanObjectiveFilter, paginator]);

  const [deleteActionPlanObjective, { loading: loadingDelete }] = useMutation(
    DELETE_ACTION_PLAN_OBJECTIVE,
    {
      onCompleted: (datas) => {
        if (datas.deleteActionPlanObjective.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteActionPlanObjective.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteActionPlanObjective } }) {
        console.log('Updating cache after deletion:', deleteActionPlanObjective);

        const deletedActionPlanObjectiveId = deleteActionPlanObjective.id;

        cache.modify({
          fields: {
            actionPlanObjectives(
              existingActionPlanObjectives = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedActionPlanObjectives = existingActionPlanObjectives.nodes.filter(
                (actionPlanObjective) => readField('id', actionPlanObjective) !== deletedActionPlanObjectiveId,
              );

              console.log('Updated actionPlanObjectives:', updatedActionPlanObjectives);

              return {
                totalCount: existingActionPlanObjectives.totalCount - 1,
                nodes: updatedActionPlanObjectives,
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

  const onDeleteActionPlanObjective = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteActionPlanObjective({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/qualites/plan-action/objectifs/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un objectif
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <ActionPlanObjectiveFilter onFilterChange={handleFilterChange} />
      </Grid>
      {/* <Grid item="true" xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingActionPlanObjectives && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {actionPlanObjectivesData?.actionPlanObjectives?.nodes?.length < 1 && !loadingActionPlanObjectives && (
              <Alert severity="warning">Aucun objectif trouvé.</Alert>
            )}
            {actionPlanObjectivesData?.actionPlanObjectives?.nodes?.map((actionPlanObjective, index) => (
              <Grid xs={2} sm={4} md={3} key={index}>
                <Item>
                  <ActionPlanObjectiveItemCard
                    actionPlanObjective={actionPlanObjective}
                    onDeleteActionPlanObjective={onDeleteActionPlanObjective}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid> */}
      <Grid item="true" xs={12}>
        <TableListActionPlanObjectives
          loading={loadingActionPlanObjectives}
          rows={actionPlanObjectivesData?.actionPlanObjectives?.nodes || []}
          onDeleteActionPlanObjective={onDeleteActionPlanObjective}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={actionPlanObjectivesData?.actionPlanObjectives?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
