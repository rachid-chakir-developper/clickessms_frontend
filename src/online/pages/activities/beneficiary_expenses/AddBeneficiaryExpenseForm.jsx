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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_BENEFICIARY_EXPENSE } from '../../../../_shared/graphql/queries/BeneficiaryExpenseQueries';
import {
  POST_BENEFICIARY_EXPENSE,
  PUT_BENEFICIARY_EXPENSE,
} from '../../../../_shared/graphql/mutations/BeneficiaryExpenseMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import dayjs from 'dayjs';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import MultiFileField from '../../../../_shared/components/form-fields/MultiFileField';
import { GET_DATAS_BENEFICIARY_EXPENSE } from '../../../../_shared/graphql/queries/DataQueries';
import { PAYMENT_METHOD } from '../../../../_shared/tools/constants';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddBeneficiaryExpenseForm({ idBeneficiaryExpense, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    amount: yup
      .number('Veuillez entrer un montant valide') // Utilisation de `.number` pour valider un champ numérique.
      .typeError('Le montant de dotation doit être un nombre') // Message d'erreur si la valeur n'est pas un nombre.
      .positive('Le montant de dotation doit être supérieur à 0') // Validation pour un montant positif.
      .required('Le montant de dotation est obligatoire'), // Rend le champ obligatoire.
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      label: '',
      expenseDateTime: dayjs(new Date()),
      beneficiary: null,
      amount: 0,
      paymentMethod: PAYMENT_METHOD.CASH,
      endowmentType: null,
      description: '',
      observation: '',
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let {files, ...beneficiaryExpenseCopy}= values;
      beneficiaryExpenseCopy.employee = beneficiaryExpenseCopy.employee ? beneficiaryExpenseCopy.employee.id : null;
      beneficiaryExpenseCopy.beneficiary = beneficiaryExpenseCopy.beneficiary ? beneficiaryExpenseCopy.beneficiary.id : null;
      files = files?.map((f)=>({id: f?.id, file: f.file || f.path,  caption: f?.caption}))
      if (idBeneficiaryExpense && idBeneficiaryExpense != '') {
        onUpdateBeneficiaryExpense({
          id: beneficiaryExpenseCopy.id,
          beneficiaryExpenseData: beneficiaryExpenseCopy,
          files: files
        });
      } else
        createBeneficiaryExpense({
          variables: {
            beneficiaryExpenseData: beneficiaryExpenseCopy,
            files: files
          },
        });
    },
  });
  const [createBeneficiaryExpense, { loading: loadingPost }] = useMutation(
    POST_BENEFICIARY_EXPENSE,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...beneficiaryExpenseCopy } = data.createBeneficiaryExpense.beneficiaryExpense;
        //   formik.setValues(beneficiaryExpenseCopy);
        navigate('/online/activites/depenses/liste');
      },
      update(cache, { data: { createBeneficiaryExpense } }) {
        const newBeneficiaryExpense = createBeneficiaryExpense.beneficiaryExpense;

        cache.modify({
          fields: {
            beneficiaryExpenses(existingBeneficiaryExpenses = { totalCount: 0, nodes: [] }) {
              return {
                totalCount: existingBeneficiaryExpenses.totalCount + 1,
                nodes: [newBeneficiaryExpense, ...existingBeneficiaryExpenses.nodes],
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
  const [updateBeneficiaryExpense, { loading: loadingPut }] = useMutation(PUT_BENEFICIARY_EXPENSE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...beneficiaryExpenseCopy } = data.updateBeneficiaryExpense.beneficiaryExpense;
      //   formik.setValues(beneficiaryExpenseCopy);
      navigate('/online/activites/depenses/liste');
    },
    update(cache, { data: { updateBeneficiaryExpense } }) {
      const updatedBeneficiaryExpense = updateBeneficiaryExpense.beneficiaryExpense;

      cache.modify({
        fields: {
          beneficiaryExpenses(
            existingBeneficiaryExpenses = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedBeneficiaryExpenses = existingBeneficiaryExpenses.nodes.map((beneficiaryExpense) =>
              readField('id', beneficiaryExpense) === updatedBeneficiaryExpense.id
                ? updatedBeneficiaryExpense
                : beneficiaryExpense,
            );

            return {
              totalCount: existingBeneficiaryExpenses.totalCount,
              nodes: updatedBeneficiaryExpenses,
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
  const onUpdateBeneficiaryExpense = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateBeneficiaryExpense({ variables });
      },
    });
  };

  
     const [getBeneficiaries, {
      loading: loadingBeneficiaries,
      data: beneficiariesData,
      error: beneficiariesError,
      fetchMore: fetchMoreBeneficiaries,
    }] = useLazyQuery(GET_BENEFICIARIES, { variables: { beneficiaryFilter : null, page: 1, limit: 10 } });
  
    const onGetBeneficiaries = (keyword)=>{
      getBeneficiaries({ variables: { beneficiaryFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }
  const [getEmployees, {
      loading: loadingEmployees,
      data: employeesData,
      error: employeesError,
      fetchMore: fetchMoreEmployees,
    }] = useLazyQuery(GET_EMPLOYEES, { variables: { employeeFilter : null, page: 1, limit: 10 } });
    
    const onGetEmployees = (keyword)=>{
      getEmployees({ variables: { employeeFilter : keyword === '' ? null : {keyword}, page: 1, limit: 10 } })
    }

    const {
        loading: loadingDatas,
        data: dataData,
        error: datsError,
        fetchMore: fetchMoreDatas,
      } = useQuery(GET_DATAS_BENEFICIARY_EXPENSE, { fetchPolicy: 'network-only' });

  const [getBeneficiaryExpense, { loading: loadingBeneficiaryExpense }] = useLazyQuery(
    GET_BENEFICIARY_EXPENSE,
    {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, folder, ...beneficiaryExpenseCopy } = data.beneficiaryExpense;
        beneficiaryExpenseCopy.expenseDateTime = beneficiaryExpenseCopy.expenseDateTime ? dayjs(beneficiaryExpenseCopy.expenseDateTime) : null;
        beneficiaryExpenseCopy.endowmentType = beneficiaryExpenseCopy.endowmentType ? Number(beneficiaryExpenseCopy.endowmentType.id): null;
        formik.setValues(beneficiaryExpenseCopy);
      },
      onError: (err) => console.log(err),
    },
  );
  React.useEffect(() => {
    if (idBeneficiaryExpense) {
      getBeneficiaryExpense({ variables: { id: idBeneficiaryExpense } });
    }
  }, [idBeneficiaryExpense]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title}: <u><em>{formik.values.title}</em></u>
      </Typography>
      {loadingBeneficiaryExpense && <ProgressService type="form" />}
      {!loadingBeneficiaryExpense && (
        <form onSubmit={formik.handleSubmit}>
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
                disabled={loadingPost || loadingPut}
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
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3} >
              <Item>
                <TheAutocomplete
                  options={beneficiariesData?.beneficiaries?.nodes}
                  onInput={(e) => {
                    onGetBeneficiaries(e.target.value)
                  }}
                  onFocus={(e) => {
                    onGetBeneficiaries(e.target.value)
                  }}
                  label="Personne accompagnée"
                  placeholder="Choisissez une personne accompagnée"
                  multiple={false}
                  value={formik.values.beneficiary}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('beneficiary', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <TheTextField
                  variant="outlined"
                  id="amount"
                  label="Montant"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  value={formik.values.amount}
                  onChange={(e) =>
                    formik.setFieldValue('amount', e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.amount && Boolean(formik.errors.amount)} // Gestion des erreurs
                  helperText={formik.touched.amount && formik.errors.amount} // Affiche le message d'erreur
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-label">
                    Type dotation
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="endowmentType"
                    label="Type dotation"
                    value={formik.values.endowmentType}
                    onChange={(e) =>
                      formik.setFieldValue('endowmentType', e.target.value)
                    }
                    disabled={loadingPost || loadingPut}
                  >
                    <MenuItem value={null}>
                      <em>Choisissez un type</em>
                    </MenuItem>
                    {dataData?.endowmentTypes?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.id}>
                          {data.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Methode du paiement</InputLabel>
                    <Select
                        value={formik.values.paymentMethod}
                        onChange={(e) => formik.setFieldValue('paymentMethod', e.target.value)}
                        disabled={loadingPost || loadingPut}
                    >
                        {PAYMENT_METHOD.ALL.map((state, index )=>{
                            return <MenuItem key={index} value={state.value}>{state.label}</MenuItem>
                        })}
                    </Select>
                </FormControl>
              </Item>
              <Item>
                <MultiFileField
                  variant="outlined"
                  label="Pièces jointes"
                  fileValue={formik.values.files}
                  onChange={(files) =>
                    formik.setFieldValue('files', files)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
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
                  disabled={loadingPost || loadingPut}
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
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/activites/depenses/liste" className="no_style">
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
