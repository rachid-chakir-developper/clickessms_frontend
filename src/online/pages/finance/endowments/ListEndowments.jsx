import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_ENDOWMENT,
  PUT_ENDOWMENT_STATE,
} from '../../../../_shared/graphql/mutations/EndowmentMutations';
import { GET_ENDOWMENTS } from '../../../../_shared/graphql/queries/EndowmentQueries';
import EndowmentFilter from './EndowmentFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListEndowments from './TableListEndowments';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add, Money } from '@mui/icons-material';

export default function ListEndowments() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [endowmentFilter, setEndowmentFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setEndowmentFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getEndowments,
    {
      loading: loadingEndowments,
      data: endowmentsData,
      error: endowmentsError,
      fetchMore: fetchMoreEndowments,
    },
  ] = useLazyQuery(GET_ENDOWMENTS, {
    variables: { endowmentFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getEndowments();
  }, [endowmentFilter, paginator]);

  const [deleteEndowment, { loading: loadingDelete }] = useMutation(DELETE_ENDOWMENT, {
    onCompleted: (datas) => {
      if (datas.deleteEndowment.deleted) {
        setNotifyAlert({
          isOpen: true,
          message: 'Supprimé avec succès',
          type: 'success',
        });
      } else {
        setNotifyAlert({
          isOpen: true,
          message: `Non supprimé ! ${datas.deleteEndowment.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deleteEndowment } }) {
      console.log('Updating cache after deletion:', deleteEndowment);

      const deletedEndowmentId = deleteEndowment.id;

      cache.modify({
        fields: {
          endowments(existingEndowments = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedEndowments = existingEndowments.nodes.filter(
              (endowment) => readField('id', endowment) !== deletedEndowmentId,
            );

            console.log('Updated endowments:', updatedEndowments);

            return {
              totalCount: existingEndowments.totalCount - 1,
              nodes: updatedEndowments,
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

  const onDeleteEndowment = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteEndowment({ variables: { id: id } });
      },
    });
  };

  const [updateEndowmentState, { loading: loadingPutState }] = useMutation(
    PUT_ENDOWMENT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateEndowmentState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateEndowmentState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_ENDOWMENTS }],
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

  const onUpdateEndowmentState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEndowmentState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          {canManageFinance && <Link
            to="/online/finance/dotations-paiements/liste"
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Money />}
            sx={{ mx: 3 }}>
              Les paiements
            </Button>
          </Link>}
          <Link to="/online/finance/dotations/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une dotation
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <EndowmentFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListEndowments
          loading={loadingEndowments}
          rows={endowmentsData?.endowments?.nodes || []}
          onDeleteEndowment={onDeleteEndowment}
          onFilterChange={(newFilter) => handleFilterChange({ ...endowmentFilter, ...newFilter })}
          paginator={paginator}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={endowmentsData?.endowments?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
