import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_TASK_ACTION } from '../../../../_shared/graphql/mutations/TaskActionMutations';
import { GET_TASK_ACTIONS } from '../../../../_shared/graphql/queries/TaskActionQueries';
import TaskActionFilter from './TaskActionFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListTaskActions from './TableListTaskActions';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListTaskActions() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [taskActionFilter, setTaskActionFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setTaskActionFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getTaskActions,
    {
      loading: loadingTaskActions,
      data: taskActionsData,
      error: taskActionsError,
      fetchMore: fetchMoreTaskActions,
    },
  ] = useLazyQuery(GET_TASK_ACTIONS, {
    variables: {
      taskActionFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getTaskActions();
  }, [taskActionFilter, paginator]);

  const [deleteTaskAction, { loading: loadingDelete }] = useMutation(
    DELETE_TASK_ACTION,
    {
      onCompleted: (datas) => {
        if (datas.deleteTaskAction.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteTaskAction.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteTaskAction } }) {
        console.log('Updating cache after deletion:', deleteTaskAction);

        const deletedTaskActionId = deleteTaskAction.id;

        cache.modify({
          fields: {
            taskActions(
              existingTaskActions = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedTaskActions = existingTaskActions.nodes.filter(
                (taskAction) =>
                  readField('id', taskAction) !== deletedTaskActionId,
              );

              console.log('Updated taskActions:', updatedTaskActions);

              return {
                totalCount: existingTaskActions.totalCount - 1,
                nodes: updatedTaskActions,
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

  const onDeleteTaskAction = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteTaskAction({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item="true" xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/travaux/actions/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une action
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item="true" xs={12}>
        <TaskActionFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <TableListTaskActions
          loading={loadingTaskActions}
          rows={taskActionsData?.taskActions?.nodes || []}
          onDeleteTaskAction={onDeleteTaskAction}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={taskActionsData?.taskActions?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
