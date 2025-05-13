import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import ValidationWorkflowItemCard from './ValidationWorkflowItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, List } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_VALIDATION_WORKFLOW,
  PUT_VALIDATION_WORKFLOW_STATE,
} from '../../../../_shared/graphql/mutations/ValidationWorkflowMutations';
import { GET_VALIDATION_WORKFLOWS } from '../../../../_shared/graphql/queries/ValidationWorkflowQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import ValidationWorkflowFilter from './ValidationWorkflowFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListValidationWorkflows() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 18 });
  const [validationWorkflowFilter, setValidationWorkflowrFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setValidationWorkflowrFilter(newFilter);
  };
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getValidationWorkflows,
    {
      loading: loadingValidationWorkflows,
      data: validationWorkflowsData,
      error: validationWorkflowsError,
      fetchMore: fetchMoreValidationWorkflows,
    },
  ] = useLazyQuery(GET_VALIDATION_WORKFLOWS, {
    variables: { validationWorkflowFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getValidationWorkflows();
  }, [validationWorkflowFilter, paginator]);

  const [deleteValidationWorkflow, { loading: loadingDelete }] = useMutation(
    DELETE_VALIDATION_WORKFLOW,
    {
      onCompleted: (datas) => {
        if (datas.deleteValidationWorkflow.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteValidationWorkflow.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteValidationWorkflow } }) {
        console.log('Updating cache after deletion:', deleteValidationWorkflow);

        const deletedValidationWorkflowId = deleteValidationWorkflow.id;

        cache.modify({
          fields: {
            validationWorkflows(
              existingValidationWorkflows = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedValidationWorkflows = existingValidationWorkflows.nodes.filter(
                (validationWorkflow) => readField('id', validationWorkflow) !== deletedValidationWorkflowId,
              );

              console.log('Updated validationWorkflows:', updatedValidationWorkflows);

              return {
                totalCount: existingValidationWorkflows.totalCount - 1,
                nodes: updatedValidationWorkflows,
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

  const onDeleteValidationWorkflow = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteValidationWorkflow({ variables: { id: id } });
      },
    });
  };

  const [updateValidationWorkflowState, { loading: loadingPutState }] = useMutation(
    PUT_VALIDATION_WORKFLOW_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateValidationWorkflowState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateValidationWorkflowState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_VALIDATION_WORKFLOWS }],
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

  const onUpdateValidationWorkflowState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateValidationWorkflowState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link
            to="/online/parametres/workflows/ajouter"
            className="no_style"
          >
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un workflow
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ValidationWorkflowFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1, paddingY: 4 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingValidationWorkflows && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {validationWorkflowsData?.validationWorkflows?.nodes?.length < 1 &&
              !loadingValidationWorkflows && (
                <Alert severity="warning">Aucun workflow trouvé.</Alert>
              )}
            {validationWorkflowsData?.validationWorkflows?.nodes?.map((validationWorkflow, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <ValidationWorkflowItemCard
                    validationWorkflow={validationWorkflow}
                    onDeleteValidationWorkflow={onDeleteValidationWorkflow}
                    onUpdateValidationWorkflowState={onUpdateValidationWorkflowState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={validationWorkflowsData?.validationWorkflows?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
