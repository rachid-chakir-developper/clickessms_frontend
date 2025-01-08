import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Alert, Button, Stack } from '@mui/material';
import BankAccountItemCard from './BankAccountItemCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import {
  DELETE_BANK_ACCOUNT,
  PUT_BANK_ACCOUNT_STATE,
} from '../../../../../_shared/graphql/mutations/BankAccountMutations';
import { GET_BANK_ACCOUNTS } from '../../../../../_shared/graphql/queries/BankAccountQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import BankAccountFilter from './BankAccountFilter';
import PaginationControlled from '../../../../../_shared/components/helpers/PaginationControlled';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ListBankAccounts() {
  const [paginator, setPaginator] = React.useState({ page: 1, limit: 10 });
  const [bankAccountFilter, setBankAccountFilter] = React.useState(null);
  const handleFilterChange = (newFilter) => {
    console.log('newFilter', newFilter);
    setBankAccountFilter(newFilter);
  };

  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [
    getBankAccounts,
    {
      loading: loadingBankAccounts,
      data: bankAccountsData,
      error: bankAccountsError,
      fetchMore: fetchMoreBankAccounts,
    },
  ] = useLazyQuery(GET_BANK_ACCOUNTS, {
    variables: { bankAccountFilter, page: paginator.page, limit: paginator.limit },
  });

  React.useEffect(() => {
    getBankAccounts();
  }, [bankAccountFilter, paginator]);
  const [deleteBankAccount, { loading: loadingDelete }] = useMutation(
    DELETE_BANK_ACCOUNT,
    {
      onCompleted: (datas) => {
        if (datas.deleteBankAccount.deleted) {
          setNotifyAlert({
            isOpen: true,
            message: 'Supprimé avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non Supprimé ! ${datas.deleteBankAccount.message}.`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { deleteBankAccount } }) {
        console.log('Updating cache after deletion:', deleteBankAccount);

        const deletedBankAccountId = deleteBankAccount.id;

        cache.modify({
          fields: {
            bankAccounts(
              existingBankAccounts = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedBankAccounts = existingBankAccounts.nodes.filter(
                (bankAccount) => readField('id', bankAccount) !== deletedBankAccountId,
              );

              console.log('Updated bankAccounts:', updatedBankAccounts);

              return {
                totalCount: existingBankAccounts.totalCount - 1,
                nodes: updatedBankAccounts,
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

  const onDeleteBankAccount = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment supprimer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        deleteBankAccount({ variables: { id: id } });
      },
    });
  };
  const [updateBankAccountState, { loading: loadingPutState }] = useMutation(
    PUT_BANK_ACCOUNT_STATE,
    {
      onCompleted: (datas) => {
        if (datas.updateBankAccountState.done) {
          setNotifyAlert({
            isOpen: true,
            message: 'Changée avec succès',
            type: 'success',
          });
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non changée ! ${datas.updateBankAccountState.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_BANK_ACCOUNTS }],
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

  const onUpdateBankAccountState = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment changer ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBankAccountState({ variables: { id: id } });
      },
    });
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 3 }}>
          <Link to="/online/finance/tresorerie/comptes-bancaires/ajouter" className="no_style">
            <Button variant="contained" endIcon={<Add />}>
              Ajouter un compte bancaire
            </Button>
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <BankAccountFilter onFilterChange={handleFilterChange} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            {loadingBankAccounts && (
              <Grid key={'pgrs'} item xs={12} sm={6} md={4}>
                <ProgressService type="mediaCard" />
              </Grid>
            )}
            {bankAccountsData?.bankAccounts?.nodes?.length < 1 && !loadingBankAccounts && (
              <Alert severity="warning">Aucun compte bancaire trouvé.</Alert>
            )}
            {bankAccountsData?.bankAccounts?.nodes?.map((bankAccount, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item>
                  <BankAccountItemCard
                    bankAccount={bankAccount}
                    onDeleteBankAccount={onDeleteBankAccount}
                    onUpdateBankAccountState={onUpdateBankAccountState}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <PaginationControlled
          totalItems={bankAccountsData?.bankAccounts?.totalCount} // Nombre total d'éléments
          itemsPerPage={paginator.limit} // Nombre d'éléments par page
          currentPage={paginator.page}
          onChange={(page) => setPaginator({ ...paginator, page })}
        />
      </Grid>
    </Grid>
  );
}
