import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Stack, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import dayjs from 'dayjs';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Add, ReceiptLong } from '@mui/icons-material';
import { GENERATE_INVOICE } from '../../../../_shared/graphql/mutations/InvoiceMutations';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_FINANCIERS } from '../../../../_shared/graphql/queries/FinancierQueries';
import { useNavigate } from 'react-router-dom';

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

function DialogGenerateInvoice({ open, onClose, onConfirm }) {
  const navigate = useNavigate();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const validationSchema = yup.object({
    establishment: yup
      .mixed() // Utilisé pour valider un champ de type null ou autre valeur.
      .required('Le champ structure est obligatoire.'),
    financier: yup
      .mixed() // Utilisé pour valider un champ de type null ou autre valeur.
      .required('Le champ financeur est obligatoire.'),
    year: yup
      .date() // Valide que c'est une date.
      .required('Le champ année est obligatoire.'),
    month: yup
      .date() // Valide que c'est une date.
      .required('Le champ mois est obligatoire.'),
  });

  const formik = useFormik({
    initialValues: {
      establishment: null,
      financier: null,
      year: dayjs(new Date()),
      month: dayjs(new Date()),
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let valuesCopy = {...values};
      valuesCopy.year = valuesCopy.year ? new Date(valuesCopy.year).getFullYear() : null
      valuesCopy.month = valuesCopy.month ? new Date(valuesCopy.month).getMonth()+1 : null
      valuesCopy.establishment = valuesCopy.establishment ? valuesCopy.establishment.id : null;
      valuesCopy.financier = valuesCopy.financier ? valuesCopy.financier.id : null;
      handleOk(valuesCopy);
    },
  });

  const [generateInvoice, { loading: loadingPost }] = useMutation(
    GENERATE_INVOICE,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data.generateInvoice.success) {
          setNotifyAlert({
            isOpen: true,
            message: 'Ajouté avec succès',
            type: 'success',
          });
          let { __typename, ...invoiceCopy } = data.generateInvoice.invoice;
          onClose()
          navigate(`/online/ventes/factures/modifier/${invoiceCopy.id}`);
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non ajouté ! Veuillez réessayer. ${data.generateInvoice.message}`,
            type: 'error',
          });
        }
      },
      update(cache, { data: { generateInvoice } }) {
        if (generateInvoice.success) {
          const newInvoice = generateInvoice.invoice;

          cache.modify({
            fields: {
              invoices(existingInvoices = { totalCount: 0, nodes: [] }, { readField }) {
                const existingInvoiceIndex = existingInvoices.nodes.findIndex(
                  (invoice) => readField('id', invoice) === newInvoice.id
                );

                let updatedInvoices;

                if (existingInvoiceIndex > -1) {
                  updatedInvoices = [...existingInvoices.nodes];
                  updatedInvoices[existingInvoiceIndex] = newInvoice;
                } else {
                  updatedInvoices = [newInvoice, ...existingInvoices.nodes];
                }

                return {
                  totalCount: updatedInvoices.length,
                  nodes: updatedInvoices,
                };
              },
            },
          });
        }
      },
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non ajouté ! Veuillez réessayer.',
          type: 'error',
        });
      },
    }
  );

  const handleOk = (values) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez-vous vraiment générer la facture ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        generateInvoice({
          variables: { generateInvoiceData: values},
        });
      },
    });
  };

  React.useEffect(() => {
    if (open) {

    }
  }, [open]);

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
    <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Générer une facture
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
                  disabled={loadingPost}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
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
                  disabled={loadingPost}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
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
                  label="Structure"
                  placeholder="Structure"
                  multiple={false}
                  value={formik.values.establishment}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishment', newValue)
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.establishment && Boolean(formik.errors.establishment)}
                  helperText={formik.touched.establishment && formik.errors.establishment}
                  disabled={loadingPost}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
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
                  onChange={(e, newValue) =>
                    formik.setFieldValue('financier', newValue)
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.financier && Boolean(formik.errors.financier)}
                  helperText={formik.touched.financier && formik.errors.financier}
                  disabled={loadingPost}
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


export default function GenerateInvoiceButton({ buttonType="button", label="Ajouter une facture" }) {
  const [isDialogGenerateInvoiceOpen, setDialogGenerateInvoiceOpen] = React.useState(false);

  const DialogGenerateInvoiceOpen = () => {
    setDialogGenerateInvoiceOpen(true);
  };

  const handleDialogGenerateInvoiceConfirm = (value) => {
    console.log('value data:', value);
    setDialogGenerateInvoiceOpen(false); // Fermer le dialogue après la confirmation
  };
  return (
    <>
      {buttonType==="button" && 
        <Button variant="contained" onClick={DialogGenerateInvoiceOpen} endIcon={<Add />}>
        {label}
      </Button>
      }
      {buttonType==="buttonIcon" && <Tooltip title={label}>
        <IconButton onClick={DialogGenerateInvoiceOpen}>
          <ReceiptLong />
        </IconButton>
      </Tooltip>
      }
        <DialogGenerateInvoice
          open={isDialogGenerateInvoiceOpen}
          onClose={() => setDialogGenerateInvoiceOpen(false)}
          onConfirm={handleDialogGenerateInvoiceConfirm}
        />
    </>
  );
}

