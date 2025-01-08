import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import TaskItemCard from './TaskItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_TASK,
  PUT_TASK_STATE,
} from '../../../../_shared/graphql/mutations/TaskMutations';
import { GET_TASKS } from '../../../../_shared/graphql/queries/TaskQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TaskFilter from './TaskFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListTasks from './TableListTasks';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListTasks() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFacility = authorizationSystem.requestAuthorization({
    type: 'manageFacility',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [taskFilter, setTaskFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setTaskFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getTasks,
    {
      loading: loadingTasks,
      data: tasksData,
      error: tasksError,
      fetchMore: fetchMoreTasks,
    },
  ] = useLazyQuery(GET_TASKS, {
    variables: { taskFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getTasks();
  }, [taskFilter, paginator]);

  const [deleteTask, { loading: loadingDelete }] = useMutation(DELETE_TASK, {
    onCompleted: (datas) => {
      if (datas.deleteTask.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteTask.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteTask } }) {
      console.log('Updating cache after deletion:', deleteTask);

      const deletedTaskId = deleteTask.id;

      cache.modify({
        fields: {
          tasks(existingTasks = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedTasks = existingTasks.nodes.filter(
              (task) => readField('id', task) !== deletedTaskId,
            );

            console.log('Updated tasks:', updatedTasks);

            return {
              totalCount: existingTasks.totalCount - 1,
              nodes: updatedTasks,
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

  const onDeleteTask = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteTask({ variables: { id: id } });
      },
    });
  };

  const [updateTaskState, { loading: loadingPutState }] = useMutation(
    PUT_TASK_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateTaskState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateTaskState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_TASKS }],
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

  const onUpdateTaskState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTaskState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          {!canManageFacility && <Link
            to="/online/travaux/interventions/ajouter?type=REQUEST"
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Add />}
            sx={{ mx: 3 }}>
              Demander une intervention
            </Button>
          </Link>}
          {
          canManageFacility && <Link to="/online/travaux/interventions/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une intervention
            </Button>
          </Link>}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TaskFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListTasks
          loading={loadingTasks}
          rows={tasksData?.tasks?.nodes || []}
          onDeleteTask={onDeleteTask}
          onFilterChange={(newFilter) => handleFilterChange({ ...taskFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={tasksData?.tasks?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
