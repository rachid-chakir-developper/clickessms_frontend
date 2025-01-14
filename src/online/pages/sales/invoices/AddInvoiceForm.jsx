import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Stepper, Step, StepLabel, StepContent, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl, IconButton, InputLabel, Select, MenuItem, InputAdornment, Tooltip } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_INVOICE } from '../../../../_shared/graphql/queries/InvoiceQueries';
import {
  POST_INVOICE,
  PUT_INVOICE,
} from '../../../../_shared/graphql/mutations/InvoiceMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { Add, Close } from '@mui/icons-material';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { GET_FINANCIERS } from '../../../../_shared/graphql/queries/FinancierQueries';
import { INVOICE_STATUS, INVOICE_TYPES, MEASUREMENT_ACTIVITY_UNITS, PAYMENT_METHOD } from '../../../../_shared/tools/constants';
import InvoiceSpanningTable from './InvoiceSpanningTable';
import InvoiceStatusLabelMenu from './InvoiceStatusLabelMenu';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddInvoiceForm({ idInvoice, title }) {
  const [isNotEditable, setIsNotEditable] = React.useState(false)
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      year: dayjs(new Date()),
      month: dayjs(new Date()),
      invoiceType: INVOICE_TYPES.STANDARD,
      number: '',
      title: '',
      emissionDate: dayjs(new Date()),
      dueDate: dayjs(new Date()).add(1, 'month').day() === 6 // Si c'est samedi
      ? dayjs(new Date()).add(1, 'month').add(2, 'day') // Ajouter 2 jours pour obtenir lundi
      : dayjs(new Date()).add(1, 'month').day() === 0 // Si c'est dimanche
      ? dayjs(new Date()).add(1, 'month').add(1, 'day') // Ajouter 1 jour pour obtenir lundi
      : dayjs(new Date()).add(1, 'month'),
      establishment: null,
      establishmentName: '',
      establishmentTvaNumber: '',
      establishmentInfos: '',
      establishmentCapacity: 0,
      establishmentUnitPrice: 0,
      financier: null,
      clientName: '',
      clientTvaNumber: '',
      clientInfos: '',
      paymentMethod: PAYMENT_METHOD.BANK_TRANSFER,
      description: '',
      invoiceItems: [],
      totalHt: 0,
      tva: 0,
      discount: 0,
      totalTtc: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let invoiceCopy = {...values};
      invoiceCopy.year = invoiceCopy.year ? new Date(invoiceCopy.year).getFullYear() : null
      invoiceCopy.month = invoiceCopy.month ? new Date(invoiceCopy.month).getMonth()+1 : null
      invoiceCopy.establishment = invoiceCopy.establishment ? invoiceCopy.establishment.id : null;
      invoiceCopy.financier = invoiceCopy.financier ? invoiceCopy.financier.id : null;
      if (!invoiceCopy?.invoiceItems) invoiceCopy['invoiceItems'] = [];
      let items = [];
      invoiceCopy.invoiceItems.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.beneficiary = itemCopy.beneficiary ? itemCopy.beneficiary.id : null;
        itemCopy.establishment = itemCopy.establishment ? itemCopy.establishment.id : null;
        items.push(itemCopy);
      });
      invoiceCopy.invoiceItems = items;
      if (invoiceCopy?.id && invoiceCopy?.id != '') {
        onUpdateInvoice({
          id: invoiceCopy.id,
          invoiceData: invoiceCopy,
        });
      } else
        createInvoice({
          variables: {
            invoiceData: invoiceCopy,
          },
        });
    },
  });
  const addInvoiceEntry = () => {
    formik.setValues({
      ...formik.values,
      invoiceItems: [
        ...formik.values.invoiceItems,
        { 
          establishmentName: '',
          preferredName: '',
          firstName: '',
          lastName: '',
          birthDate: null,
          entryDate: null,
          releaseDate: null,
          description: '',
          measurementUnit: MEASUREMENT_ACTIVITY_UNITS.DAY,
          unitPrice: 0,
          quantity: 1,
          tva: 0,
          discount: 0,
          amountHt: 0,
          amountTtc: 0,
          beneficiary: null,
          establishment: null,
        },
      ],
    });
  };

  const removeInvoiceEntry = (index) => {
    const updatedInvoiceEntries = [...formik.values.invoiceItems];
    updatedInvoiceEntries.splice(index, 1);

    formik.setValues({
      ...formik.values,
      invoiceItems: updatedInvoiceEntries,
    });
  };


  const [createInvoice, { loading: loadingPost }] = useMutation(
    POST_INVOICE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...invoiceCopy } = data.createInvoice.invoice;
        //   formik.setValues(invoiceCopy);
        formik.setFieldValue('id', invoiceCopy.id);
        navigate('/online/ventes/factures/liste');
      },
      update(cache, { data: { createInvoice } }) {
        const newInvoice = createInvoice.invoice;

        cache.modify({
          fields: {
            invoices(
              existingInvoices = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingInvoices.totalCount + 1,
                nodes: [newInvoice, ...existingInvoices.nodes],
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
    },
  );
  const [updateInvoice, { loading: loadingPut }] = useMutation(
    PUT_INVOICE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...invoiceCopy } =
          data.updateInvoice.invoice;
        //   formik.setValues(invoiceCopy);
        navigate('/online/ventes/factures/liste');
      },
      update(cache, { data: { updateInvoice } }) {
        const updatedInvoice = updateInvoice.invoice;

        cache.modify({
          fields: {
            invoices(
              existingInvoices = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedInvoices = existingInvoices.nodes.map(
                (invoice) =>
                  readField('id', invoice) === updatedInvoice.id
                    ? updatedInvoice
                    : invoice,
              );

              return {
                totalCount: existingInvoices.totalCount,
                nodes: updatedInvoices,
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
    },
  );
  const onUpdateInvoice = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateInvoice({ variables });
      },
    });
  };
  const [getInvoice, { loading: loadingInvoice }] = useLazyQuery(
    GET_INVOICE,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...invoiceCopy } = data.invoice;
        invoiceCopy.year = invoiceCopy.year ? dayjs(new Date()).set('year', Number(invoiceCopy.year)) : null;
        invoiceCopy.month = invoiceCopy.month ? dayjs(new Date()).set('month', Number(invoiceCopy.month)-1) : null;
        invoiceCopy.emissionDate = invoiceCopy.emissionDate ? dayjs(invoiceCopy.emissionDate) : null;
        invoiceCopy.dueDate = invoiceCopy.dueDate ? dayjs(invoiceCopy.dueDate) : null;
        
        if (!invoiceCopy?.invoiceItems) invoiceCopy['invoiceItems'] = [];
        let items = [];
        invoiceCopy.invoiceItems.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.birthDate = itemCopy.birthDate ? dayjs(itemCopy.birthDate) : null;
          itemCopy.entryDate = itemCopy.entryDate ? dayjs(itemCopy.entryDate) : null;
          itemCopy.releaseDate = itemCopy.releaseDate ? dayjs(itemCopy.releaseDate) : null;
          items.push(itemCopy);
        });
        invoiceCopy.invoiceItems = items;
        formik.setValues(invoiceCopy);
        if(invoiceCopy.status !== INVOICE_STATUS.DRAFT) setIsNotEditable(true)
      },
      onError: (err) => console.log(err),
    },
  );


  React.useEffect(() => {
    if (idInvoice) {
      getInvoice({ variables: { id: idInvoice } });
    }
  }, [idInvoice]);

  
  const [getEstablishments, {
      loading: loadingEstablishments,
      data: establishmentsData,
      error: establishmentsError,
      fetchMore: fetchMoreEstablishments,
    }] = useLazyQuery(GET_ESTABLISHMENTS, { variables: { establishmentFilter : null, page: 1, limit: 10 } });
    
    const onGetEstablishments = (keyword)=>{
      getEstablishments({ variables: { establishmentFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }
  
    const [getFinanciers, {
      loading: loadingFinanciers,
      data: financiersData,
      error: financiersError,
      fetchMore: fetchMoreFinanciers,
    }] = useLazyQuery(GET_FINANCIERS, { variables: { financierFilter : null, page: 1, limit: 10 } });
    
    const onGetFinanciers = (keyword)=>{
      getFinanciers({ variables: { financierFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography component="div" variant="span"  sx={{ marginBottom: 4, fontSize: 20 }}>
          {title} N° <b>{formik.values.number}</b>
        </Typography>
        {formik?.values?.id && <InvoiceStatusLabelMenu invoice={formik.values} disabled/>}
      </Box>
      {loadingInvoice && <ProgressService type="form" />}
      {!loadingInvoice && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 1, md: 1 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheDesktopDatePicker
                  id="year"
                  label="Année"
                  type="date"
                  name="year"
                  openTo="year"
                  views={['year']}
                  format="YYYY"
                  value={formik.values.year}
                  onChange={(date) => formik.setFieldValue('year', date)}
                  slotProps={{
                    textField: {
                      onBlur: formik.handleBlur,
                      error: formik.touched.year && Boolean(formik.errors.year),
                      helperText: formik.touched.year ? formik.errors.year : ''
                    },
                  }}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheDesktopDatePicker
                  id="month"
                  label="Mois"
                  type="date"
                  name="month"
                  openTo="month"
                  views={['month']}
                  format="MMMM"
                  value={formik.values.month}
                  onChange={(date) => formik.setFieldValue('month', date)}
                  slotProps={{
                    textField: {
                      onBlur: formik.handleBlur,
                      error: formik.touched.month && Boolean(formik.errors.month),
                      helperText: formik.touched.month ? formik.errors.month : ''
                    },
                  }}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheDesktopDatePicker
                  label="Date d'émission"
                  value={formik.values.emissionDate}
                  onChange={(date) => formik.setFieldValue('emissionDate', date)}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheDesktopDatePicker
                  label="Date d'échéance"
                  value={formik.values.dueDate}
                  onChange={(date) => formik.setFieldValue('dueDate', date)}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  onInput={(e) => {
                    onGetEstablishments(e.target.value)
                  }}
                  onFocus={(e) => {
                    onGetEstablishments(e.target.value)
                  }}
                  id="establishment"
                  placeholder="Structure"
                  multiple={false}
                  value={formik.values.establishment}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('establishment', newValue)
                    formik.setFieldValue('establishmentName', newValue?.name)
                    const infos = [
                      newValue?.address || '', // Adresse principale
                      newValue?.additionalAddress || '', // Complément d'adresse
                      `${newValue?.zipCode ? newValue?.zipCode+',' : ''} ${newValue?.city || ''}`, // Code postal, Ville
                      newValue?.phone || '', // Téléphone fixe
                      newValue?.mobile || '', // Mobile
                      newValue?.email || '' // Email
                    ]
                      .filter(info => info.trim() !== '') // Supprimer les lignes vides
                      .join('\n'); // Joindre les lignes avec un retour à la ligne
                  
                    formik.setFieldValue('establishmentInfos', infos);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.establishment && Boolean(formik.errors.establishment)}
                  helperText={formik.touched.establishment && formik.errors.establishment}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Item>
                <TheAutocomplete
                  options={financiersData?.financiers?.nodes}
                  onInput={(e) => {
                    onGetFinanciers(e.target.value)
                  }}
                  onFocus={(e) => {
                    onGetFinanciers(e.target.value)
                  }}
                  id="financier"
                  label="Financeur"
                  placeholder="Financeur"
                  multiple={false}
                  value={formik.values.financier}
                  onChange={(e, newValue) => {
                    formik.setFieldValue('financier', newValue)
                    formik.setFieldValue('clientName', newValue?.name)
                    const infos = [
                      newValue?.address || '', // Adresse principale
                      newValue?.additionalAddress || '', // Complément d'adresse
                      `${newValue?.zipCode ? newValue?.zipCode+',' : ''} ${newValue?.city || ''}`, // Code postal, Ville
                      newValue?.phone || '', // Téléphone fixe
                      newValue?.mobile || '', // Mobile
                      newValue?.email || '' // Email
                    ]
                      .filter(info => info.trim() !== '') // Supprimer les lignes vides
                      .join('\n'); // Joindre les lignes avec un retour à la ligne
                  
                    formik.setFieldValue('clientInfos', infos);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.financier && Boolean(formik.errors.financier)}
                  helperText={formik.touched.financier && formik.errors.financier}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Adresse de la strcuture"
                  multiline
                  rows={5}
                  value={formik.values.establishmentInfos}
                  onChange={(e) =>
                    formik.setFieldValue('establishmentInfos', e.target.value)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Capacité"
                  value={formik.values.establishmentCapacity}
                  onChange={(e) =>
                    formik.setFieldValue('establishmentCapacity', e.target.value)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Prix de journée"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  value={formik.values.establishmentUnitPrice}
                  onChange={(e) =>
                    formik.setFieldValue('establishmentUnitPrice', e.target.value)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Adresse du financeur"
                  multiline
                  rows={5}
                  value={formik.values.clientInfos}
                  onChange={(e) =>
                    formik.setFieldValue('clientInfos', e.target.value)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12} >
              <InvoiceSpanningTable 
                invoice={formik.values}
                items={formik.values?.invoiceItems || []}
                addItem={addInvoiceEntry}
                removeItem={removeInvoiceEntry}
                onChange={({type, index, field, value})=>{
                  formik.setFieldValue(`invoiceItems.${index}.${field}`, value)
                }}
                disabled={loadingPost || loadingPut || isNotEditable}
                isNotEditable={isNotEditable}
                />
            </Grid>
          </Grid>
          <Grid
            container sx={{marginTop: 5}}
          >
            <Grid item xs={12} sm={12} md={12} >
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/ventes/factures/liste"
                  className="no_style"
                >
                  <Button variant="outlined" sx={{ marginRight: '10px' }}>
                    Annuler
                  </Button>
                </Link>
                {!isNotEditable && <Button
                  type="submit"
                  variant="contained"
                  disabled={!formik.isValid || loadingPost || loadingPut || isNotEditable}
                >
                  Valider
                </Button>}
              </Item>
            </Grid>
          </Grid>
        </form>
      )}
    </Box>
  );
}
