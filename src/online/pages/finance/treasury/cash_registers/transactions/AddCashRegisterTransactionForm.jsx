import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_CR_TRANSACTION } from '../../../../../../_shared/graphql/queries/CashRegisterTransactionQueries';
import {
  POST_CR_TRANSACTION,
  PUT_CR_TRANSACTION,
} from '../../../../../../_shared/graphql/mutations/CashRegisterTransactionMutations';
import ProgressService from '../../../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_CASH_REGISTERS } from '../../../../../../_shared/graphql/queries/CashRegisterQueries';
import TheDesktopDatePicker from '../../../../../../_shared/components/form-fields/TheDesktopDatePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddCashRegisterTransactionForm({ idCashRegisterTransaction, title }) {
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
      cashRegister: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...cashRegisterTransactionCopy } = values;
      cashRegisterTransactionCopy.cashRegister = cashRegisterTransactionCopy.cashRegister
        ? cashRegisterTransactionCopy.cashRegister.id
        : null;
      cashRegisterTransactionCopy.amount = Number(cashRegisterTransactionCopy.amount).toFixed(2);
      console.log(cashRegisterTransactionCopy);
      if (idCashRegisterTransaction && idCashRegisterTransaction != '') {
        onUpdateCashRegisterTransaction({
          id: cashRegisterTransactionCopy.id,
          cashRegisterTransactionData: cashRegisterTransactionCopy,
          document: document,
        });
      } else
        createCashRegisterTransaction({
          variables: {
            cashRegisterTransactionData: cashRegisterTransactionCopy,
            document: document,
          },
        });
    },
  });
  const {
    loading: loadingCashRegisters,
    data: cashRegistersData,
    error: cashRegistersError,
    fetchMore: fetchMoreCashRegisters,
  } = useQuery(GET_CASH_REGISTERS, {
    fetchPolicy: 'network-only',
  });

  const [createCashRegisterTransaction, { loading: loadingPost }] = useMutation(POST_CR_TRANSACTION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...cashRegisterTransactionCopy } = data.createCashRegisterTransaction.cashRegisterTransaction;
      //   formik.setValues(cashRegisterTransactionCopy);
      navigate('/online/finance/tresorerie/caisses/mouvements/liste');
    },
    update(cache, { data: { createCashRegisterTransaction } }) {
      const newCashRegisterTransaction = createCashRegisterTransaction.cashRegisterTransaction;

      cache.modify({
        fields: {
          cashRegisterTransactions(existingCashRegisterTransactions = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingCashRegisterTransactions.totalCount + 1,
              nodes: [newCashRegisterTransaction, ...existingCashRegisterTransactions.nodes],
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
  const [updateCashRegisterTransaction, { loading: loadingPut }] = useMutation(PUT_CR_TRANSACTION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...cashRegisterTransactionCopy } = data.updateCashRegisterTransaction.cashRegisterTransaction;
      //   formik.setValues(cashRegisterTransactionCopy);
      navigate('/online/finance/tresorerie/caisses/mouvements/liste');
    },
    update(cache, { data: { updateCashRegisterTransaction } }) {
      const updatedCashRegisterTransaction = updateCashRegisterTransaction.cashRegisterTransaction;

      cache.modify({
        fields: {
          cashRegisterTransactions(
            existingCashRegisterTransactions = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedCashRegisterTransactions = existingCashRegisterTransactions.nodes.map((cashRegisterTransaction) =>
              readField('id', cashRegisterTransaction) === updatedCashRegisterTransaction.id
                ? updatedCashRegisterTransaction
                : cashRegisterTransaction,
            );

            return {
              totalCount: existingCashRegisterTransactions.totalCount,
              nodes: updatedCashRegisterTransactions,
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
  const onUpdateCashRegisterTransaction = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateCashRegisterTransaction({ variables });
      },
    });
  };
  const [getCashRegisterTransaction, { loading: loadingCashRegisterTransaction }] = useLazyQuery(GET_CR_TRANSACTION, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...cashRegisterTransactionCopy1 } = data.cashRegisterTransaction;
      let { folder, ...cashRegisterTransactionCopy } = cashRegisterTransactionCopy1;
      cashRegisterTransactionCopy.date = cashRegisterTransactionCopy.date ? dayjs(cashRegisterTransactionCopy.date) : null;
      formik.setValues(cashRegisterTransactionCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idCashRegisterTransaction) {
      getCashRegisterTransaction({ variables: { id: idCashRegisterTransaction } });
    }
  }, [idCashRegisterTransaction]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingCashRegisterTransaction && <ProgressService type="form" />}
      {!loadingCashRegisterTransaction && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDesktopDatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(date) => formik.setFieldValue('date', date)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheAutocomplete
                  options={cashRegistersData?.cashRegisters?.nodes}
                  label="Compte banciare"
                  placeholder="Choisissez un compte banciare ?"
                  multiple={false}
                  value={formik.values.cashRegister}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('cashRegister', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Mouvement"
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
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheFileField
                  variant="outlined"
                  label="Document de mouvement"
                  fileValue={formik.values.document}
                  onChange={(file) => formik.setFieldValue('document', file)}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/finance/tresorerie/caisses/mouvements/liste"
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
