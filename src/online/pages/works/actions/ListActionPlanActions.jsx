import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { DELETE_ACTION_PLAN_ACTION } from '../../../../_shared/graphql/mutations/ActionPlanActionMutations';
import { GET_ACTION_PLAN_ACTIONS } from '../../../../_shared/graphql/queries/ActionPlanActionQueries';
import ActionPlanActionFilter from './ActionPlanActionFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListActionPlanActions from './TableListActionPlanActions';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListActionPlanActions() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [actionPlanActionFilter, setActionPlanActionFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setActionPlanActionFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getActionPlanActions,
    {
      loading: loadingActionPlanActions,
      data: actionPlanActionsData,
      error: actionPlanActionsError,
      fetchMore: fetchMoreActionPlanActions,
    },
  ] = useLazyQuery(GET_ACTION_PLAN_ACTIONS, {
    variables: {
      actionPlanActionFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getActionPlanActions();
  }, [actionPlanActionFilter, paginator]);

  const [deleteActionPlanAction, { loading: loadingDelete }] = useMutation(
    DELETE_ACTION_PLAN_ACTION,
    {
      onCompleted: (datas) => {
        if (datas.deleteActionPlanAction.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteActionPlanAction.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteActionPlanAction } }) {
        console.log('Updating cache after deletion:', deleteActionPlanAction);

        const deletedActionPlanActionId = deleteActionPlanAction.id;

        cache.modify({
          fields: {
            actionPlanActions(
              existingActionPlanActions = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedActionPlanActions = existingActionPlanActions.nodes.filter(
                (actionPlanAction) =>
                  readField('id', actionPlanAction) !== deletedActionPlanActionId,
              );

              console.log('Updated actionPlanActions:', updatedActionPlanActions);

              return {
                totalCount: existingActionPlanActions.totalCount - 1,
                nodes: updatedActionPlanActions,
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

  const onDeleteActionPlanAction = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteActionPlanAction({ variables: { id: id } });
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
        <ActionPlanActionFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item="true" xs={12}>
        <TableListActionPlanActions
          loading={loadingActionPlanActions}
          rows={actionPlanActionsData?.actionPlanActions?.nodes || []}
          onDeleteActionPlanAction={onDeleteActionPlanAction}
        />
      </Grid>
      <Grid item="true" xs={12}>
        <PaginationControlled
          totalItems={actionPlanActionsData?.actionPlanActions?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
