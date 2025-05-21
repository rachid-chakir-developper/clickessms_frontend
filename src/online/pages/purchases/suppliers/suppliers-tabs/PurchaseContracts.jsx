import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_PURCHASE_CONTRACT } from '../../../../../_shared/graphql/mutations/PurchaseContractMutations';
import { GET_PURCHASE_CONTRACTS } from '../../../../../_shared/graphql/queries/PurchaseContractQueries';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';
import TableListPurchaseContracts from '../../../purchases/purchase_contracts/TableListPurchaseContracts';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function PurchaseContracts({supplier}) {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [purchaseContractFilter, setPurchaseContractFilter] =
    React.useState({suppliers: [supplier?.id]});
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setPurchaseContractFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getPurchaseContracts,
    {
      loading: loadingPurchaseContracts,
      data: purchaseContractsData,
      error: purchaseContractsError,
      fetchMore: fetchMorePurchaseContracts,
    },
  ] = useLazyQuery(GET_PURCHASE_CONTRACTS, {
    variables: {
      purchaseContractFilter,
      page: paginator.page,
      limit: paginator.limit,
    },
  });

  React.useEffect(() => {
    getPurchaseContracts();
  }, [purchaseContractFilter, paginator]);

  const [deletePurchaseContract, { loading: loadingDelete }] = useMutation(
    DELETE_PURCHASE_CONTRACT,
    {
      onCompleted: (datas) => {
        if (datas.deletePurchaseContract.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deletePurchaseContract.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deletePurchaseContract } }) {
        console.log('Updating cache after deletion:', deletePurchaseContract);

        const deletedPurchaseContractId = deletePurchaseContract.id;

        cache.modify({
          fields: {
            purchaseContracts(
              existingPurchaseContracts = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedPurchaseContracts =
                existingPurchaseContracts.nodes.filter(
                  (purchaseContract) =>
                    readField('id', purchaseContract) !==
                    deletedPurchaseContractId,
                );

              console.log(
                'Updated purchaseContracts:',
                updatedPurchaseContracts,
              );

              return {
                totalCount: existingPurchaseContracts.totalCount - 1,
                nodes: updatedPurchaseContracts,
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

  const onDeletePurchaseContract = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deletePurchaseContract({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TableListPurchaseContracts
          loading={loadingPurchaseContracts}
          rows={purchaseContractsData?.purchaseContracts?.nodes || []}
          onDeletePurchaseContract={onDeletePurchaseContract}
        />
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={purchaseContractsData?.purchaseContracts?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
