import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../../../_shared/components/form-fields/TheTextField';
import TheDateTimePicker from '../../../../../../_shared/components/form-fields/TheDateTimePicker';
import dayjs from 'dayjs';
import { POST_CR_TRANSACTION, PUT_CR_TRANSACTION } from '../../../../../../_shared/graphql/mutations/CashRegisterTransactionMutations';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_CASH_REGISTER, GET_CASH_REGISTERS } from '../../../../../../_shared/graphql/queries/CashRegisterQueries';
import { GET_ESTABLISHMENTS } from '../../../../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_EMPLOYEES } from '../../../../../../_shared/graphql/queries/EmployeeQueries';
import TheDesktopDatePicker from '../../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_CR_TRANSACTION } from '../../../../../../_shared/graphql/queries/CashRegisterTransactionQueries';
import { TRANSACTION_TYPE_CHOICES } from '../../../../../../_shared/tools/constants';
import { getTransactionTypeLabel } from '../../../../../../_shared/tools/functions';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogAddCashRegisterTransaction({ open, onClose, onConfirm, cashRegister, cashRegisterTransaction }) {
    
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      document: undefined,
      number: '',
      label: '',
      comment:'',
      date: dayjs(new Date()),
      amount: 0,
      cashRegister: cashRegister?.id || null,
      transactionType : null
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...cashRegisterTransactionCopy } = values;
      if(!values.transactionType) return
      cashRegisterTransactionCopy.cashRegister = cashRegister ? cashRegister.id : null;
      cashRegisterTransactionCopy.amount = Number(cashRegisterTransactionCopy.amount).toFixed(2);
      console.log(cashRegisterTransactionCopy);
      if (cashRegisterTransaction && cashRegisterTransaction.id && cashRegisterTransaction.id != '') {
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

  const [createCashRegisterTransaction, { loading: loadingPost }] = useMutation(POST_CR_TRANSACTION, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...cashRegisterTransactionCopy } = data.createCashRegisterTransaction.cashRegisterTransaction;
      onConfirm(data.createCashRegisterTransaction.cashRegisterTransaction);
      onClose();
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
      onConfirm(data.updateCashRegisterTransaction.cashRegisterTransaction);
      onClose();
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
    if (cashRegisterTransaction) {
      getCashRegisterTransaction({ variables: { id: cashRegisterTransaction.id } });
    }
  }, [open]);

  React.useEffect(() => {
    if (open && !cashRegisterTransaction) {
      formik.setFieldValue('transactionType', null)
    }
  }, [open]);

  return (
    <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        La caisse: <u><i>{cashRegister ? `${cashRegister?.name}` : ''}</i></u>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          {!loadingCashRegisterTransaction && <Box display="flex" justifyContent="space-around">
            {(!formik.values.transactionType || formik.values.transactionType===TRANSACTION_TYPE_CHOICES.CREDIT) && <Chip 
                  clickable 
                  onClick={()=> formik.setFieldValue('transactionType', TRANSACTION_TYPE_CHOICES.CREDIT)}
                  icon={<ArrowUpward />} label={getTransactionTypeLabel(TRANSACTION_TYPE_CHOICES.CREDIT)} 
                  variant="filled" color="primary" sx={{marginX: 1}} />}
            {(!formik.values.transactionType || formik.values.transactionType===TRANSACTION_TYPE_CHOICES.DEBIT) && <Chip 
                  clickabl
                  onClick={()=> formik.setFieldValue('transactionType', TRANSACTION_TYPE_CHOICES.DEBIT)}
                  icon={<ArrowDownward />} label={getTransactionTypeLabel(TRANSACTION_TYPE_CHOICES.DEBIT)}
                  variant="filled" color="info" sx={{marginX: 1}} />}
          </Box>}
          {formik.values.transactionType && <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={12} md={6}>
              <Item>
                <TheDesktopDatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(date) =>
                    formik.setFieldValue('date', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Montant"
                  id="amount"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  value={formik.values.amount}
                  required
                  onChange={(e) => formik.setFieldValue('amount', e.target.value)}
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)}
                  helperText={formik.touched.amount && formik.errors.amount}
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Commentaire"
                  multiline
                  rows={2}
                  value={formik.values.comment}
                  onChange={(e) =>
                    formik.setFieldValue('comment', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
          </Grid>}
        </DialogContent>
        <DialogActions>
          {formik.values.transactionType &&  <Button type="submit" variant="contained" disabled={!formik.isValid}>
            Valider
          </Button>}
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
}