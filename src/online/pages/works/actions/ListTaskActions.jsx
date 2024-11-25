import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_TASK_ACTION, PUT_TASK_ACTION } from '../../../../_shared/graphql/mutations/TaskActionMutations';
import { GET_TASK_ACTIONS } from '../../../../_shared/graphql/queries/TaskActionQueries';
import TaskActionFilter from './TaskActionFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListTaskActions from './TableListTaskActions';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import { GET_TICKETS } from '../../../../_shared/graphql/queries/TicketQueries';

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
        if(deleteTaskAction?.success){
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
        }
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

  const [updateTaskAction, { loading: loadingPut }] = useMutation(PUT_TASK_ACTION, {
    refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }, { query: GET_TICKETS }],
    update(cache, { data: { updateTaskAction } }) {
      const updatedTaskAction = updateTaskAction.taskAction;
      cache.modify({
        fields: {
          taskActions(
            existingTaskActions = { totalCount: 0, nodes: [] },
            { readField, storeFieldName }
          ) {
            // Vérifie si l'action mise à jour existe déjà dans les nodes
            const taskExists = existingTaskActions.nodes.some(
              (taskAction) => readField('id', taskAction) === updatedTaskAction.id
            );
      
            // Filtrer et mettre à jour la liste existante
            let updatedTaskActions = existingTaskActions.nodes.filter((taskAction) => {
              const taskId = readField('id', taskAction);
              const isArchived = readField('isArchived', taskAction);
      
              // Vérifie si la tâche correspond à celle qui a été mise à jour
              if (taskId === updatedTaskAction.id) {
                // Si l'action est archivée, l'ajoute dans TASK_ACTION_ARCHIVED et la retire des autres
                if (updatedTaskAction.isArchived) {
                  return storeFieldName.includes('TASK_ACTION_ARCHIVED');
                } else {
                  // Si l'action n'est pas archivée, l'ajoute dans ALL et la retire de TASK_ACTION_ARCHIVED
                  return !storeFieldName.includes('TASK_ACTION_ARCHIVED');
                }
              }
              // Si la tâche ne correspond pas à celle mise à jour, la garde dans la liste existante
              return true;
            });
      
            // Si l'action mise à jour n'existe pas, l'ajouter à la liste appropriée
            if (!taskExists) {
              // Vérifier où l'ajouter : dans TASK_ACTION_ARCHIVED ou ALL
              if (
                (updatedTaskAction.isArchived && storeFieldName.includes('TASK_ACTION_ARCHIVED')) ||
                (!updatedTaskAction.isArchived && !storeFieldName.includes('TASK_ACTION_ARCHIVED'))
              ) {
                updatedTaskActions = [updatedTaskAction, ...updatedTaskActions];
              }
            }
      
            // Mettre à jour le total et la liste des nœuds
            return {
              ...existingTaskActions,
              totalCount: updatedTaskActions.length,
              nodes: updatedTaskActions,
            };
          },
        },
      });
    },
  });

  const onUpdateTaskAction = (input={}) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez êtes sûr ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTaskAction(input);
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <TaskActionFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListTaskActions
          loading={loadingTaskActions}
          rows={taskActionsData?.taskActions?.nodes || []}
          onDeleteTaskAction={onDeleteTaskAction}
          onUpdateTaskAction={onUpdateTaskAction}
          onFilterChange={(newFilter) => handleFilterChange({ ...taskActionFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
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
