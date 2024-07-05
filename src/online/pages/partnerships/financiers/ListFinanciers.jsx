import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import FinancierItemCard from './FinancierItemCard';
import { useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_FINANCIER,
  PUT_FINANCIER_STATE,
} from '../../../../_shared/graphql/mutations/FinancierMutations';
import { GET_FINANCIERS } from '../../../../_shared/graphql/queries/FinancierQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import FinancierFilter from './FinancierFilter';
import { useLazyQuery } from '@apollo/client';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListFinanciers() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [financierFilter, setFinancierFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setFinancierFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getFinanciers,
    {
      loading: loadingFinanciers,
      data: financiersData,
      error: financiersError,
      fetchMore: fetchMoreFinanciers,
    },
  ] = useLazyQuery(GET_FINANCIERS, {
    variables: { financierFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getFinanciers();
  }, [financierFilter, paginator]);

  const [deleteFinancier, { loading: loadingDelete }] = useMutation(
    DELETE_FINANCIER,
    {
      onCompleted: (datas) => {
        if (datas.deleteFinancier.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteFinancier.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteFinancier } }) {
        console.log('Updating cache after deletion:', deleteFinancier);

        const deletedFinancierId = deleteFinancier.id;

        cache.modify({
          fields: {
            financiers(
              existingFinanciers = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedFinanciers = existingFinanciers.nodes.filter(
                (financier) => readField('id', financier) !== deletedFinancierId,
              );

              console.log('Updated financiers:', updatedFinanciers);

              return {
                totalCount: existingFinanciers.totalCount - 1,
                nodes: updatedFinanciers,
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

  const onDeleteFinancier = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteFinancier({ variables: { id: id } });
      },
    });
  };

  const [updateFinancierState, { loading: loadingPutState }] = useMutation(
    PUT_FINANCIER_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateFinancierState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateFinancierState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_FINANCIERS }],
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

  const onUpdateFinancierState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateFinancierState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/partenariats/financeurs/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un financeur
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <FinancierFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {loadingFinanciers && (
              <Grid key={'pgrs'} item xs={2} sm={4} md={3}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {financiersData?.financiers?.nodes.length < 1 &&
              !loadingFinanciers && (
                <Alert severity="warning">Aucun financeur trouvé.</Alert>
              )}
            {financiersData?.financiers?.nodes?.map((financier, index) => (
              <Grid item xs={2} sm={4} md={3} key={index}>
                <Item>
                  <FinancierItemCard
                    financier={financier}
                    onDeleteFinancier={onDeleteFinancier}
                    onUpdateFinancierState={onUpdateFinancierState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={financiersData?.financiers?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={1}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
