import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import {
  Stack,
  Box,
  Typography,
  InputAdornment,
  Button,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_PURCHASE_ORDER } from '../../../../_shared/graphql/queries/PurchaseOrderQueries';
import {
  POST_PURCHASE_ORDER,
  PUT_PURCHASE_ORDER,
} from '../../../../_shared/graphql/mutations/PurchaseOrderMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { Close } from '@mui/icons-material';
import { PURCHASE_ORDER_STATUS_CHOICES, PAYMENT_METHOD } from '../../../../_shared/tools/constants';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { GET_ALL_ACCOUNTING_NATURES } from '../../../../_shared/graphql/queries/DataQueries';
import MultiFileField from '../../../../_shared/components/form-fields/MultiFileField';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import { GET_SUPPLIERS } from '../../../../_shared/graphql/queries/SupplierQueries';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_CASH_REGISTERS } from '../../../../_shared/graphql/queries/CashRegisterQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddPurchaseOrderForm({ idPurchaseOrder, title }) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;
  const [isNotEditable, setIsNotEditable] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRequestType, setIsRequestType] = React.useState(!canManageFinance);
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    label: yup
      .string('Entrez le nom de véhicule')
      .required('Le nom de véhicule est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      label: '',
      purchaseOrderDateTime: dayjs(new Date()),
      paymentMethod: PAYMENT_METHOD.CREDIT_CARD,
      isAmountAccurate: true,
      isPlannedInBudget: false,
      comment: '',
      description: '',
      observation: '',
      files: [],
      establishment: null,
      purchaseOrderItems: [],
      supplier: null,
      cashRegister: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if(isNotEditable) return
      let {files, ...purchaseOrderCopy} = values;
      purchaseOrderCopy.supplier = purchaseOrderCopy.supplier ? purchaseOrderCopy.supplier.id : null;
      purchaseOrderCopy.cashRegister = purchaseOrderCopy.cashRegister && purchaseOrderCopy.paymentMethod===PAYMENT_METHOD.CASH ? purchaseOrderCopy.cashRegister.id : null;
      purchaseOrderCopy.establishment = purchaseOrderCopy.establishment ?  purchaseOrderCopy.establishment?.id : null;;
      files = files?.map((f)=>({id: f?.id, file: f.file || f.path,  caption: f?.caption}))
      let items = [];
      purchaseOrderCopy.purchaseOrderItems.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.accountingNature = itemCopy.accountingNature ? itemCopy.accountingNature.id : null;
        items.push(itemCopy);
      });
      purchaseOrderCopy.purchaseOrderItems = items;
      if (idPurchaseOrder && idPurchaseOrder != '') {
        onUpdatePurchaseOrder({
          id: purchaseOrderCopy.id,
          purchaseOrderData: purchaseOrderCopy,
          files: files
        });
      } else
        createPurchaseOrder({
          variables: {
            purchaseOrderData: purchaseOrderCopy,
            files: files
          },
        });
    },
  });

  const {
    loading: loadingSuppliers,
    data: suppliersData,
    error: suppliersError,
    fetchMore: fetchMoreSuppliers,
  } = useQuery(GET_SUPPLIERS, {
    fetchPolicy: 'network-only',
  });

  const {
    loading: loadingCashRegisters,
    data: cashRegistersData,
    error: cashRegistersError,
    fetchMore: fetchMoreCashRegisters,
  } = useQuery(GET_CASH_REGISTERS, {
    fetchPolicy: 'network-only',
  });

  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });

  const [getAccountingNatures, {
    loading: loadingAccountingNatures,
    data: accountingNaturesData,
    error: accountingNaturesError,
    fetchMore: fetchMoreAccountingNatures,
  }] = useLazyQuery(GET_ALL_ACCOUNTING_NATURES, { variables: { accountingNatureFilter : {listType: 'ALL'}, page: 1, limit: 20 } });
  
  const onGetAccountingNatures = (keyword)=>{
    getAccountingNatures({ variables: { accountingNatureFilter : keyword === '' ? {listType: 'ALL'} : {listType: 'ALL', keyword}, page: 1, limit: 20 } })
  }

  const [createPurchaseOrder, { loading: loadingPost }] = useMutation(POST_PURCHASE_ORDER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...purchaseOrderCopy } = data.createPurchaseOrder.purchaseOrder;
      //   formik.setValues(purchaseOrderCopy);
      navigate('/online/achats/bons-commandes/liste');
    },
    update(cache, { data: { createPurchaseOrder } }) {
      const newPurchaseOrder = createPurchaseOrder.purchaseOrder;

      cache.modify({
        fields: {
          purchaseOrders(existingPurchaseOrders = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingPurchaseOrders.totalCount + 1,
              nodes: [newPurchaseOrder, ...existingPurchaseOrders.nodes],
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
  const [updatePurchaseOrder, { loading: loadingPut }] = useMutation(PUT_PURCHASE_ORDER, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...purchaseOrderCopy } = data.updatePurchaseOrder.purchaseOrder;
      //   formik.setValues(purchaseOrderCopy);
      navigate('/online/achats/bons-commandes/liste');
    },
    update(cache, { data: { updatePurchaseOrder } }) {
      const updatedPurchaseOrder = updatePurchaseOrder.purchaseOrder;

      cache.modify({
        fields: {
          purchaseOrders(existingPurchaseOrders = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedPurchaseOrders = existingPurchaseOrders.nodes.map((purchaseOrder) =>
              readField('id', purchaseOrder) === updatedPurchaseOrder.id ? updatedPurchaseOrder : purchaseOrder,
            );

            return {
              totalCount: existingPurchaseOrders.totalCount,
              nodes: updatedPurchaseOrders,
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
  const onUpdatePurchaseOrder = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updatePurchaseOrder({ variables });
      },
    });
  };
  const [getPurchaseOrder, { loading: loadingPurchaseOrder }] = useLazyQuery(GET_PURCHASE_ORDER, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...purchaseOrderCopy1 } = data.purchaseOrder;
      let { folder, employee, ...purchaseOrderCopy } = purchaseOrderCopy1;
      purchaseOrderCopy.purchaseOrderDateTime = purchaseOrderCopy.purchaseOrderDateTime ? dayjs(purchaseOrderCopy.purchaseOrderDateTime) : null;
      if (!purchaseOrderCopy?.purchaseOrderItems) purchaseOrderCopy['purchaseOrderItems'] = [];
      let items = [];
      purchaseOrderCopy.purchaseOrderItems.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      purchaseOrderCopy.purchaseOrderItems = items;
      formik.setValues(purchaseOrderCopy);
      if(!canManageFinance && purchaseOrderCopy.status !== PURCHASE_ORDER_STATUS_CHOICES.PENDING) setIsNotEditable(true)
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idPurchaseOrder) {
      getPurchaseOrder({ variables: { id: idPurchaseOrder } });
    }
  }, [idPurchaseOrder]);
  const addPurchaseOrderItem = () => {
    formik.setValues({
      ...formik.values,
      purchaseOrderItems: [
        ...formik.values.purchaseOrderItems,
        { accountingNature: null, quantity: 1, amount: 0, description: '' },
      ],
    });
  };

  const removePurchaseOrderItem = (index) => {
    const updatedChecklist = [...formik.values.purchaseOrderItems];
    updatedChecklist.splice(index, 1);

    formik.setValues({
      ...formik.values,
      purchaseOrderItems: updatedChecklist,
    });
  };
  React.useEffect(() => {
    if ((searchParams.get('type') && searchParams.get('type') === 'REQUEST' && !idPurchaseOrder) || (!canManageFinance && !idPurchaseOrder)) {
        formik.setFieldValue('status', PURCHASE_ORDER_STATUS_CHOICES.PENDING)
        setIsRequestType(true)
    }
    else if(!canManageFinance){
      setIsRequestType(true)
    }
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingPurchaseOrder && <ProgressService type="form" />}
      {!loadingPurchaseOrder && (
        <form onSubmit={formik.handleSubmit}>
          {isNotEditable && <Alert severity="warning">Pour modifier cette bon de commande, contactez le responsable de la comptabilité</Alert>}
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Libellé"
                  value={formik.values.label}
                  onChange={(e) => formik.setFieldValue('label', e.target.value)}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheDesktopDatePicker
                  label="Date"
                  value={formik.values.purchaseOrderDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('purchaseOrderDateTime', date)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheAutocomplete
                    options={establishmentsData?.establishments?.nodes}
                    label="Établissement / Service"
                    placeholder="Ajouter un établissement ou service"
                    multiple={false}
                    value={formik.values.establishment}
                    onChange={(e, newValue) =>
                      formik.setFieldValue('establishment', newValue)
                    }
                    disabled={loadingPost || loadingPut || isNotEditable}
                  />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheAutocomplete
                  options={suppliersData?.suppliers?.nodes}
                  label="Fournisseur"
                  placeholder="Choisissez un fournisseur"
                  limitTags={2}
                  multiple={false}
                  value={formik.values.supplier}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('supplier', newValue);
                  }}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Montant précis ?"
                  checked={formik.values.isAmountAccurate}
                  value={formik.values.isAmountAccurate}
                  onChange={(e) =>
                    formik.setFieldValue('isAmountAccurate', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Prévu au budget ?"
                  checked={formik.values.isPlannedInBudget}
                  value={formik.values.isPlannedInBudget}
                  onChange={(e) =>
                    formik.setFieldValue('isPlannedInBudget', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Methode du paiement</InputLabel>
                    <Select
                        value={formik.values.paymentMethod}
                        onChange={(e) => formik.setFieldValue('paymentMethod', e.target.value)}
                        disabled={loadingPost || loadingPut || isNotEditable}
                    >
                        {PAYMENT_METHOD.ALL.map((state, index )=>{
                            return <MenuItem key={index} value={state.value}>{state.label}</MenuItem>
                        })}
                    </Select>
                </FormControl>
              </Item>
              {formik.values.paymentMethod===PAYMENT_METHOD.CASH && <Item>
                <TheAutocomplete
                  options={cashRegistersData?.cashRegisters?.nodes}
                  label="Caisse"
                  placeholder="Choisissez une caisse"
                  limitTags={2}
                  multiple={false}
                  value={formik.values.cashRegister}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('cashRegister', newValue);
                  }}
                />
              </Item>}
            </Grid>
            <Grid item xs={12} sm={6} md={7} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Détail"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={(e) => formik.setFieldValue('description', e.target.value)}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={5} >
              <Item>
                <MultiFileField
                  variant="outlined"
                  label="Pièces jointes"
                  fileValue={formik.values.files}
                  onChange={(files) =>
                    formik.setFieldValue('files', files)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Typography component="div" variant="h6">
                Détail de le bon de commande selon la nature
              </Typography>
              {formik.values?.purchaseOrderItems?.map((item, index) => (
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  key={index}
                >
                  
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <TheAutocomplete
                        options={accountingNaturesData?.accountingNatures?.nodes}
                        onInput={(e) => {
                                onGetAccountingNatures(e.target.value)
                              }}
                        onFocus={(e) => {
                          onGetAccountingNatures(e.target.value)
                        }}
                        label="Nature"
                        placeholder="Nature"
                        multiple={false}
                        value={item.accountingNature}
                        onChange={(e, newValue) =>
                          formik.setFieldValue(`purchaseOrderItems.${index}.accountingNature`, newValue)
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={2} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Montant total TTC"
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">€</InputAdornment>
                          ),
                        }}
                        value={item.amount}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `purchaseOrderItems.${index}.amount`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={5} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Description"
                        multiline
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `purchaseOrderItems.${index}.description`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={1} >
                    <Item sx={{position: 'relative'}}>
                      <TheTextField
                        variant="outlined"
                        label="Quantité"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `purchaseOrderItems.${index}.quantity`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                      <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                        onClick={() => removePurchaseOrderItem(index)}
                        edge="end"
                        color="error"
                      >
                        <Close />
                      </IconButton>
                    </Item>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={12}
              item
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={addPurchaseOrderItem}
                disabled={loadingPost || loadingPut || isNotEditable}
              >
                Ajouter une nature
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/achats/bons-commandes/liste"
                  className="no_style"
                >
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPost || loadingPut || isNotEditable}
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
