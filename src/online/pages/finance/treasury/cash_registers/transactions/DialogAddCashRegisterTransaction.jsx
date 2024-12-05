import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheTextField from '../../../../../../_shared/components/form-fields/TheTextField';
import TheDateTimePicker from '../../../../../../_shared/components/form-fields/TheDateTimePicker';
import dayjs from 'dayjs';
import { POST_CR_TRANSACTION, PUT_CR_TRANSACTION } from '../../../../../../_shared/graphql/mutations/CashRegisterTransactionMutations';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_CASH_REGISTER } from '../../../../../../_shared/graphql/queries/CashRegisterQueries';
import { GET_ESTABLISHMENTS } from '../../../../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_EMPLOYEES } from '../../../../../../_shared/graphql/queries/EmployeeQueries';
import TheDesktopDatePicker from '../../../../../../_shared/components/form-fields/TheDesktopDatePicker';

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

export default function DialogAddCashRegisterTransaction({ open, onClose, onConfirm, cashRegister, creditNote }) {
    const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
    const validationSchema = yup.object({});
    const formik = useFormik({
      initialValues: {
        number: '',
        name: '',
        description: '',
        openingDate: dayjs(new Date()),
        closingDate: null,
        establishments: [],
        managers: [],
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let { document, ...cashRegisterCopy } = values;
        cashRegisterCopy.establishments = cashRegisterCopy.establishments.map((i) => i?.id);
        cashRegisterCopy.managers = cashRegisterCopy.managers.map((i) => i?.id);
        if (cashRegister?.id && cashRegister?.id != '') {
          onUpdateCashRegister({
            id: cashRegisterCopy.id,
            cashRegisterData: cashRegisterCopy
          });
        } else
          createCashRegister({
            variables: {
              cashRegisterData: cashRegisterCopy
            },
          });
      },
    });
  
    
    const [createCashRegister, { loading: loadingPost }] = useMutation(POST_CR_TRANSACTION, {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...cashRegisterCopy } = data.createCashRegister.cashRegister;
      },
      update(cache, { data: { createCashRegister } }) {
        const newCashRegister = createCashRegister.cashRegister;
  
        cache.modify({
          fields: {
            cashRegisters(existingCashRegisters = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingCashRegisters.totalCount + 1,
                nodes: [newCashRegister, ...existingCashRegisters.nodes],
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
    const [updateCashRegister, { loading: loadingPut }] = useMutation(PUT_CR_TRANSACTION, {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...cashRegisterCopy } = data.updateCashRegister.cashRegister;
      },
      update(cache, { data: { updateCashRegister } }) {
        const updatedCashRegister = updateCashRegister.cashRegister;
  
        cache.modify({
          fields: {
            cashRegisters(
              existingCashRegisters = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedCashRegisters = existingCashRegisters.nodes.map((cashRegister) =>
                readField('id', cashRegister) === updatedCashRegister.id
                  ? updatedCashRegister
                  : cashRegister,
              );
  
              return {
                totalCount: existingCashRegisters.totalCount,
                nodes: updatedCashRegisters,
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
    const onUpdateCashRegister = (variables) => {
      setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: 'Voulez vous vraiment modifier ?',
        onConfirm: () => {
          setConfirmDialog({ isOpen: false });
          updateCashRegister({ variables });
        },
      });
    };
    const {
      loading: loadingEstablishments,
      data: establishmentsData,
      error: establishmentsError,
      fetchMore: fetchMoreEstablishments,
    } = useQuery(GET_ESTABLISHMENTS, {
      fetchPolicy: 'network-only',
    });
  
    
    const [getEmployees, {
      loading: loadingEmployees,
      data: employeesData,
      error: employeesError,
      fetchMore: fetchMoreEmployees,
    }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
  
    const onGetEmployees = (keyword)=>{
      getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }
  
    const [getCashRegister, { loading: loadingCashRegister }] = useLazyQuery(GET_CASH_REGISTER, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, balance, ...cashRegisterCopy } = data.cashRegister;
        cashRegisterCopy.openingDate = cashRegisterCopy.openingDate ? dayjs(cashRegisterCopy.openingDate) : null;
        cashRegisterCopy.closingDate = cashRegisterCopy.closingDate ? dayjs(cashRegisterCopy.closingDate) : null;
        cashRegisterCopy.establishments =
        cashRegisterCopy.establishments
          ? cashRegisterCopy.establishments.map((i) => i?.establishment)
          : [];
        cashRegisterCopy.managers = cashRegisterCopy.managers
          ? cashRegisterCopy.managers.map((i) => i?.employee)
          : [];
        formik.setValues(cashRegisterCopy);
      },
      onError: (err) => console.log(err),
    });
  
    React.useEffect(() => {
      if (cashRegister) {
        getCashRegister({ variables: { id: cashRegister?.id } });
      }
    }, [cashRegister?.id]);

  const handleOk = (cashRegisterTransactionData) => {
    if (cashRegisterTransactionData.id) {
      // Mise à jour du mouvement existant
      setConfirmDialog({
        isOpen: true,
        title: 'ATTENTION',
        subTitle: 'Voulez-vous vraiment modifier ce mouvement ?',
        onConfirm: () => {
          setConfirmDialog({ isOpen: false });
          updateCashRegisterTransaction({ variables: { id: cashRegisterTransactionData.id, cashRegisterTransactionData } });
        },
      });
    } else {
      // Création d'un nouveau mouvement
      createCashRegisterTransaction({ variables: { cashRegisterTransactionData } });
    }
  };

  React.useEffect(() => {
    if (open) {}
  }, [open]);

  return (
    <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Enregistrer un mouvement
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
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" disabled={!formik.isValid}>
            Valider
          </Button>
        </DialogActions>
      </form>
    </BootstrapDialog>
  );
}