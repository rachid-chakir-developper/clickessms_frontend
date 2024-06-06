import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BALANCE } from '../../../../../_shared/graphql/queries/BalanceQueries';
import {
  POST_BALANCE,
  PUT_BALANCE,
} from '../../../../../_shared/graphql/mutations/BalanceMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_BANK_ACCOUNTS } from '../../../../../_shared/graphql/queries/BankAccountQueries';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBalanceForm({ idBalance, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      document: undefined,
      number: '',
      name: '',
      date: dayjs(new Date()),
      amount: 0,
      bankAccount: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...balanceCopy } = values;
      balanceCopy.bankAccount = balanceCopy.bankAccount
        ? balanceCopy.bankAccount.id
        : null;
      balanceCopy.amount = Number(balanceCopy.amount).toFixed(2);
      console.log(balanceCopy);
      if (idBalance && idBalance != '') {
        onUpdateBalance({
          id: balanceCopy.id,
          balanceData: balanceCopy,
          document: document,
        });
      } else
        createBalance({
          variables: {
            balanceData: balanceCopy,
            document: document,
          },
        });
    },
  });
  const {
    loading: loadingBankAccounts,
    data: bankAccountsData,
    error: bankAccountsError,
    fetchMore: fetchMoreBankAccounts,
  } = useQuery(GET_BANK_ACCOUNTS, {
    fetchPolicy: 'network-only',
  });

  const [createBalance, { loading: loadingPost }] = useMutation(POST_BALANCE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...balanceCopy } = data.createBalance.balance;
      //   formik.setValues(balanceCopy);
      navigate('/online/finance/tresorerie/soldes/liste');
    },
    update(cache, { data: { createBalance } }) {
      const newBalance = createBalance.balance;

      cache.modify({
        fields: {
          balances(existingBalances = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingBalances.totalCount + 1,
              nodes: [newBalance, ...existingBalances.nodes],
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non ajouté ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const [updateBalance, { loading: loadingPut }] = useMutation(PUT_BALANCE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...balanceCopy } = data.updateBalance.balance;
      //   formik.setValues(balanceCopy);
      navigate('/online/finance/tresorerie/soldes/liste');
    },
    update(cache, { data: { updateBalance } }) {
      const updatedBalance = updateBalance.balance;

      cache.modify({
        fields: {
          balances(
            existingBalances = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedBalances = existingBalances.nodes.map((balance) =>
              readField('id', balance) === updatedBalance.id
                ? updatedBalance
                : balance,
            );

            return {
              totalCount: existingBalances.totalCount,
              nodes: updatedBalances,
            };
          },
        },
      });
    },
    onError: (err) => {
      console.log(err);
      setNotifyAlert({
        isOpen: true,
        message: 'Non modifié ! Veuillez réessayer.',
        type: 'error',
      });
    },
  });
  const onUpdateBalance = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBalance({ variables });
      },
    });
  };
  const [getBalance, { loading: loadingBalance }] = useLazyQuery(GET_BALANCE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...balanceCopy1 } = data.balance;
      let { folder, ...balanceCopy } = balanceCopy1;
      balanceCopy.date = balanceCopy.date ? dayjs(balanceCopy.date) : null;
      formik.setValues(balanceCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idBalance) {
      getBalance({ variables: { id: idBalance } });
    }
  }, [idBalance]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingBalance && <ProgressService type="form" />}
      {!loadingBalance && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheDesktopDatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(date) => formik.setFieldValue('date', date)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheAutocomplete
                  options={bankAccountsData?.bankAccounts?.nodes}
                  label="Compte banciare"
                  placeholder="Choisissez un compte banciare ?"
                  multiple={false}
                  value={formik.values.bankAccount}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('bankAccount', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Solde"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  value={formik.values.amount}
                  onChange={(e) =>
                    formik.setFieldValue(`amount`, e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheFileField
                  variant="outlined"
                  label="Document de solde"
                  fileValue={formik.values.document}
                  onChange={(file) => formik.setFieldValue('document', file)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/finance/tresorerie/soldes/liste"
                  className="no_style"
                >
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPost || loadingPut}
                >
                  Valider
                </Button>
              </Item>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
}
