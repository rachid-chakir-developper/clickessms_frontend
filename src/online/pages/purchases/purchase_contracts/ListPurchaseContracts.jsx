import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import {
  DELETE_PURCHASE_CONTRACT,
  PUT_PURCHASE_CONTRACT_STATE,
} from '../../../../_shared/graphql/mutations/PurchaseContractMutations';
import { GET_PURCHASE_CONTRACTS } from '../../../../_shared/graphql/queries/PurchaseContractQueries';
import PurchaseContractFilter from './PurchaseContractFilter';
import PaginationControlled from '../../../../_shared/components/helpers/PaginationControlled';
import TableListPurchaseContracts from './TableListPurchaseContracts';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

export default function ListPurchaseContracts() {
  const authorizationSystem = useAuthorizationSystem();
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 20 });
  const [purchaseContractFilter, setPurchaseContractFilter] = React.useState(null);
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
    variables: { purchaseContractFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getPurchaseContracts();
  }, [purchaseContractFilter, paginator]);

  const [deletePurchaseContract, { loading: loadingDelete }] = useMutation(DELETE_PURCHASE_CONTRACT, {
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
          message: `Non supprimé ! ${datas.deletePurchaseContract.message}.`,
          type: 'error',
        });
      }
    },
    update(cache, { data: { deletePurchaseContract } }) {
      console.log('Updating cache after deletion:', deletePurchaseContract);

      const deletedPurchaseContractId = deletePurchaseContract.id;

      cache.modify({
        fields: {
          purchaseContracts(existingPurchaseContracts = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedPurchaseContracts = existingPurchaseContracts.nodes.filter(
              (purchaseContract) => readField('id', purchaseContract) !== deletedPurchaseContractId,
            );

            console.log('Updated purchaseContracts:', updatedPurchaseContracts);

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
        message: 'Non supprimé ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });

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

  const [updatePurchaseContractState, { loading: loadingPutState }] = useMutation(
    PUT_PURCHASE_CONTRACT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updatePurchaseContractState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updatePurchaseContractState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_PURCHASE_CONTRACTS }],
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

  const onUpdatePurchaseContractState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePurchaseContractState({ variables: { id: id } });
      },
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/achats/base-contrats/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter une contrat
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PurchaseContractFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <TableListPurchaseContracts
          loading={loadingPurchaseContracts}
          rows={purchaseContractsData?.purchaseContracts?.nodes || []}
          onDeletePurchaseContract={onDeletePurchaseContract}
          onFilterChange={(newFilter) => handleFilterChange({ ...purchaseContractFilter, ...newFilter })}
          paginator={paginator}
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
