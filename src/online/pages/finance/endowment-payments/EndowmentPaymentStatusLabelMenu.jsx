import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack, styled } from '@mui/material';
import { Cancel, Done, Euro, HourglassTop } from '@mui/icons-material';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { PUT_ENDOWMENT_PAYMENT_FIELDS } from '../../../../_shared/graphql/mutations/EndowmentPaymentMutations';
import { useSession } from '../../../../_shared/context/SessionProvider';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { PAYMENT_METHOD } from '../../../../_shared/tools/constants';
import { GET_CASH_REGISTERS } from '../../../../_shared/graphql/queries/CashRegisterQueries';
import { GET_BANK_CARDS } from '../../../../_shared/graphql/queries/BankCardQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EndowmentPaymentStatusLabelMenu({endowmentPayment}) {
  const { user } = useSession();
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;

  const canChangeStatus = ()=>{
    const workerIds = endowmentPayment?.workers?.map(w => w?.employee?.id)
    if(!workerIds?.includes(user?.employee?.id)) return false
    return endowmentPayment?.status === 'PAID' || endowmentPayment?.status === 'UNPAID'
  }
  const ALL_ENDOWMENT_PAYMENT_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success',},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info'},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'success'},
  ];
  
  const ENDOWMENT_PAYMENT_STATUS = [
    // { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default', hidden: true},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default', hidden: true},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success', hidden: true},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning', hidden: true},
    { value: "PAID", label: "Payé", icon: <Euro />, color: 'info', hidden: !canChangeStatus()},
    { value: "UNPAID", label: "Non payé", icon: <Cancel />, color: 'warning', hidden: !canChangeStatus()},
  ];
    const [updateEndowmentPaymentFields, { loading: loadingPut }] = useMutation(PUT_ENDOWMENT_PAYMENT_FIELDS, {
      onCompleted: (data) => {
        console.log(data);
        if(data.updateEndowmentPaymentFields.success){
          if(!openDialog) setOpenDialog(true);
          else handleCloseDialog()
        }
      },
      update(cache, { data: { updateEndowmentPaymentFields } }) {
        const updatedEndowmentPayment = updateEndowmentPaymentFields.endowmentPayment;
  
        cache.modify({
          fields: {
            endowmentPayments(
              existingEndowmentPayments = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedEndowmentPayments = existingEndowmentPayments.nodes.map((endowmentPayment) =>
                readField('id', endowmentPayment) === updatedEndowmentPayment.id
                  ? updatedEndowmentPayment
                  : endowmentPayment,
              );
  
              return {
                totalCount: existingEndowmentPayments.totalCount,
                nodes: updatedEndowmentPayments,
              };
            },
          },
        });
      },
    });

    const [openDialog, setOpenDialog] = React.useState(false);
      const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenChangeReason(false)
      };
  
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <CustomizedStatusLabelMenu
            options={canManageFinance ? ALL_ENDOWMENT_PAYMENT_STATUS : ENDOWMENT_PAYMENT_STATUS}
            status={endowmentPayment?.status}
            type="endowmentPayment"
            loading={loadingPut}
            onChange={(status)=> {updateEndowmentPaymentFields({ variables: {id: endowmentPayment?.id, endowmentPaymentData: {status}} })}}
            disabled={!canManageFinance && !canChangeStatus()}
        />
      </Box>
      <DialogPaymentMethod 
        endowmentPayment={endowmentPayment} 
        updateEndowmentPaymentFields={updateEndowmentPaymentFields}
        loading={loadingPut}
        onClose={handleCloseDialog}
        open={openDialog}
      />
    </Box>
  );
}


function DialogPaymentMethod({open, onClose, endowmentPayment, updateEndowmentPaymentFields, loading=false}){
  const validationSchema = yup.object({});
  const formik = useFormik({
      initialValues: {
        paymentMethod: endowmentPayment?.paymentMethod,
        bankCard: endowmentPayment?.bankCard,
        cashRegister: endowmentPayment?.cashRegister,
        checkNumber: endowmentPayment?.checkNumber,
        bankName: endowmentPayment?.bankName,
        description: endowmentPayment?.description,
        observation: endowmentPayment?.observation,
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let valuesCopy = {...values};
        valuesCopy.bankCard = valuesCopy.bankCard && valuesCopy.paymentMethod===PAYMENT_METHOD.CREDIT_CARD ? valuesCopy.bankCard.id : null;
        valuesCopy.cashRegister = valuesCopy.cashRegister && valuesCopy.paymentMethod===PAYMENT_METHOD.CASH ? valuesCopy.cashRegister.id : null;
        updateEndowmentPaymentFields({ 
          variables: {
            id: endowmentPayment?.id,
            endowmentPaymentData: valuesCopy
          } })
      },
    });

  const [getCashRegisters, {
      loading: loadingCashRegisters,
      data: cashRegistersData,
      error: cashRegistersError,
      fetchMore: fetchMoreCashRegisters,
    }] = useLazyQuery(GET_CASH_REGISTERS, { variables: { cashRegisterFilter : null, page: 1, limit: 10 } });
  
    const onGetCashRegisters = (keyword)=>{
      getCashRegisters({ variables: { cashRegisterFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
  }
  const [getBankCards, {
    loading: loadingBankCards,
    data: bankCardsData,
    error: bankCardsError,
    fetchMore: fetchMoreBankCards,
  }] = useLazyQuery(GET_BANK_CARDS, { variables: { bankCardFilter : null, page: 1, limit: 10 } });
  
  const onGetBankCards = (keyword)=>{
    getBankCards({ variables: { bankCardFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
}


  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Ajouter un motif de réponse</DialogTitle>
        <DialogContent>
          <Box style={{  marginTop: 20 }}>
            <Grid container>
              <Grid item xs={12} sm={4} md={4} >
                <Item>
                  <FormControl fullWidth>
                      <InputLabel>Methode du paiement</InputLabel>
                      <Select
                          value={formik.values.paymentMethod}
                          onChange={(e) => formik.setFieldValue('paymentMethod', e.target.value)}
                          disabled={loading}
                      >
                          {PAYMENT_METHOD.ALL.map((state, index )=>{
                              return <MenuItem key={index} value={state.value}>{state.label}</MenuItem>
                          })}
                      </Select>
                  </FormControl>
                </Item>
                {formik.values.paymentMethod===PAYMENT_METHOD.CREDIT_CARD && <Item>
                  <TheAutocomplete
                    options={bankCardsData?.bankCards?.nodes}
                    onInput={(e) => {
                      onGetBankCards(e.target.value)
                    }}
                    onFocus={(e) => {
                      onGetBankCards(e.target.value)
                    }}
                    label="Carte bancaire"
                    placeholder="Choisissez une carte"
                    limitTags={2}
                    multiple={false}
                    value={formik.values.bankCard}
                    onChange={(e, newValue) => {
                      formik.setFieldValue('bankCard', newValue);
                    }}
                    disabled={loading}
                  />
                </Item>}
                {formik.values.paymentMethod===PAYMENT_METHOD.CASH && <Item>
                  <TheAutocomplete
                    options={cashRegistersData?.cashRegisters?.nodes}
                    onInput={(e) => {
                      onGetCashRegisters(e.target.value)
                    }}
                    onFocus={(e) => {
                      onGetCashRegisters(e.target.value)
                    }}
                    label="Caisse"
                    placeholder="Choisissez une caisse"
                    limitTags={2}
                    multiple={false}
                    value={formik.values.cashRegister}
                    onChange={(e, newValue) => {
                      formik.setFieldValue('cashRegister', newValue);
                    }}
                    disabled={loading}
                  />
                </Item>}
                {formik.values.paymentMethod === PAYMENT_METHOD.CHECK && <>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Numéro du chèque"
                      value={formik.values.checkNumber}
                      onChange={(e) =>
                        formik.setFieldValue('checkNumber', e.target.value)
                      }
                      disabled={loading}
                    />
                  </Item>
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Nom de la banque"
                      value={formik.values.bankName}
                      onChange={(e) =>
                        formik.setFieldValue('bankName', e.target.value)
                      }
                      disabled={loading}
                    />
                  </Item>
                </>}
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Description"
                    multiline
                    rows={4}
                    value={formik.values.description}
                    onChange={(e) =>
                      formik.setFieldValue('description', e.target.value)
                    }
                    disabled={loading}
                  />
                </Item>
                <Item>
                  <TheTextField
                    variant="outlined"
                    label="Observation"
                    multiline
                    rows={4}
                    value={formik.values.observation}
                    onChange={(e) =>
                      formik.setFieldValue('observation', e.target.value)
                    }
                    disabled={loading}
                  />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
            <Button color="inherit" onClick={onClose}>Annuler</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!formik.isValid || loading}
            >
              Valider
            </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};