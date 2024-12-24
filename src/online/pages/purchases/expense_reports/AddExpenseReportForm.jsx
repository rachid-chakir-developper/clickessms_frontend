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
import { GET_EXPENSE_REPORT } from '../../../../_shared/graphql/queries/ExpenseReportQueries';
import {
  POST_EXPENSE_REPORT,
  PUT_EXPENSE_REPORT,
} from '../../../../_shared/graphql/mutations/ExpenseReportMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { EXPENSE_REPORT_STATUS_CHOICES, PAYMENT_METHOD } from '../../../../_shared/tools/constants';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import MultiFileField from '../../../../_shared/components/form-fields/MultiFileField';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddExpenseReportForm({ idExpenseReport, title }) {
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
      expenseDateTime: dayjs(new Date()),
      paymentMethod: PAYMENT_METHOD.CREDIT_CARD,
      comment: '',
      description: '',
      observation: '',
      files: [],
      establishment: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if(isNotEditable) return
      let {files, ...expenseReportCopy} = values;
      expenseReportCopy.establishment = expenseReportCopy.establishment ?  expenseReportCopy.establishment?.id : null;
      files = files?.map((f)=>({id: f?.id, file: f.file || f.path,  caption: f?.caption}))

      if (idExpenseReport && idExpenseReport != '') {
        onUpdateExpenseReport({
          id: expenseReportCopy.id,
          expenseReportData: expenseReportCopy,
          files: files
        });
      } else
        createExpenseReport({
          variables: {
            expenseReportData: expenseReportCopy,
            files: files
          },
        });
    },
  });


  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });


  const [createExpenseReport, { loading: loadingPost }] = useMutation(POST_EXPENSE_REPORT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...expenseReportCopy } = data.createExpenseReport.expenseReport;
      //   formik.setValues(expenseReportCopy);
      navigate('/online/achats/notes-frais/liste');
    },
    update(cache, { data: { createExpenseReport } }) {
      const newExpenseReport = createExpenseReport.expenseReport;

      cache.modify({
        fields: {
          expenseReports(existingExpenseReports = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingExpenseReports.totalCount + 1,
              nodes: [newExpenseReport, ...existingExpenseReports.nodes],
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
  const [updateExpenseReport, { loading: loadingPut }] = useMutation(PUT_EXPENSE_REPORT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...expenseReportCopy } = data.updateExpenseReport.expenseReport;
      //   formik.setValues(expenseReportCopy);
      navigate('/online/achats/notes-frais/liste');
    },
    update(cache, { data: { updateExpenseReport } }) {
      const updatedExpenseReport = updateExpenseReport.expenseReport;

      cache.modify({
        fields: {
          expenseReports(existingExpenseReports = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedExpenseReports = existingExpenseReports.nodes.map((expenseReport) =>
              readField('id', expenseReport) === updatedExpenseReport.id ? updatedExpenseReport : expenseReport,
            );

            return {
              totalCount: existingExpenseReports.totalCount,
              nodes: updatedExpenseReports,
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
  const onUpdateExpenseReport = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateExpenseReport({ variables });
      },
    });
  };
  const [getExpenseReport, { loading: loadingExpenseReport }] = useLazyQuery(GET_EXPENSE_REPORT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, employee, ...expenseReportCopy } = data.expenseReport;
      expenseReportCopy.expenseDateTime = expenseReportCopy.expenseDateTime ? dayjs(expenseReportCopy.expenseDateTime) : null;
      formik.setValues(expenseReportCopy);
      if(!canManageFinance && expenseReportCopy.status !== EXPENSE_REPORT_STATUS_CHOICES.PENDING) setIsNotEditable(true)
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idExpenseReport) {
      getExpenseReport({ variables: { id: idExpenseReport } });
    }
  }, [idExpenseReport]);

  React.useEffect(() => {
    if ((searchParams.get('type') && searchParams.get('type') === 'REQUEST' && !idExpenseReport) || (!canManageFinance && !idExpenseReport)) {
        formik.setFieldValue('status', EXPENSE_REPORT_STATUS_CHOICES.PENDING)
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
      {loadingExpenseReport && <ProgressService type="form" />}
      {!loadingExpenseReport && (
        <form onSubmit={formik.handleSubmit}>
          {isNotEditable && <Alert severity="warning">Pour modifier cette note de frais, contactez le responsable de la comptabilité</Alert>}
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={6} >
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
                  value={formik.values.expenseDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('expenseDateTime', date)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Montant"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  value={formik.values.totalAmount}
                  onChange={(e) =>
                    formik.setFieldValue('totalAmount', e.target.value)
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
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/achats/notes-frais/liste"
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
