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
import { GET_EXPENSE } from '../../../../_shared/graphql/queries/ExpenseQueries';
import {
  POST_EXPENSE,
  PUT_EXPENSE,
} from '../../../../_shared/graphql/mutations/ExpenseMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import CardDisplayMap from '../../../../_shared/components/helpers/CardDisplayMap';
import { Close } from '@mui/icons-material';
import { EXPENSE_STATUS_CHOICES, PRIORITIES } from '../../../../_shared/tools/constants';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { GET_DATAS_EXPENSE } from '../../../../_shared/graphql/queries/DataQueries';
import MultiFileField from '../../../../_shared/components/form-fields/MultiFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddExpenseForm({ idExpense, title }) {
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
      description: '',
      observation: '',
      files: [],
      establishments: [],
      expenseItems: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if(isNotEditable) return
      let {files, ...expenseCopy} = values;
      files = files?.map((f)=>({id: f?.id, file: f.file || f.path,  caption: f?.caption}))
      expenseCopy.establishments = expenseCopy.establishments.map((i) => i?.id);
      let items = [];
      expenseCopy.expenseItems.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.establishment = itemCopy.establishment ? itemCopy.establishment.id : null;
        items.push(itemCopy);
      });
      expenseCopy.expenseItems = items;
      if (idExpense && idExpense != '') {
        onUpdateExpense({
          id: expenseCopy.id,
          expenseData: expenseCopy,
          files: files
        });
      } else
        createExpense({
          variables: {
            expenseData: expenseCopy,
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

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_EXPENSE, { fetchPolicy: 'network-only' });

  const [createExpense, { loading: loadingPost }] = useMutation(POST_EXPENSE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...expenseCopy } = data.createExpense.expense;
      //   formik.setValues(expenseCopy);
      navigate('/online/achats/depenses-engagements/liste');
    },
    update(cache, { data: { createExpense } }) {
      const newExpense = createExpense.expense;

      cache.modify({
        fields: {
          expenses(existingExpenses = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingExpenses.totalCount + 1,
              nodes: [newExpense, ...existingExpenses.nodes],
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
  const [updateExpense, { loading: loadingPut }] = useMutation(PUT_EXPENSE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...expenseCopy } = data.updateExpense.expense;
      //   formik.setValues(expenseCopy);
      navigate('/online/achats/depenses-engagements/liste');
    },
    update(cache, { data: { updateExpense } }) {
      const updatedExpense = updateExpense.expense;

      cache.modify({
        fields: {
          expenses(existingExpenses = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedExpenses = existingExpenses.nodes.map((expense) =>
              readField('id', expense) === updatedExpense.id ? updatedExpense : expense,
            );

            return {
              totalCount: existingExpenses.totalCount,
              nodes: updatedExpenses,
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
  const onUpdateExpense = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateExpense({ variables });
      },
    });
  };
  const [getExpense, { loading: loadingExpense }] = useLazyQuery(GET_EXPENSE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...expenseCopy1 } = data.expense;
      let { folder, employee, ...expenseCopy } = expenseCopy1;
      expenseCopy.expenseDateTime = expenseCopy.expenseDateTime ? dayjs(expenseCopy.expenseDateTime) : null;
      expenseCopy.establishments = expenseCopy.establishments
        ? expenseCopy.establishments.map((i) => i?.establishment)
        : [];
      if (!expenseCopy?.expenseItems) expenseCopy['expenseItems'] = [];
      let items = [];
      expenseCopy.expenseItems.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.accountingNature = itemCopy.accountingNature
          ? Number(itemCopy.accountingNature.id)
          : null;
        items.push(itemCopy);
      });
      expenseCopy.expenseItems = items;
      formik.setValues(expenseCopy);
      if(!canManageFinance && expenseCopy.status !== EXPENSE_STATUS_CHOICES.PENDING) setIsNotEditable(true)
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idExpense) {
      getExpense({ variables: { id: idExpense } });
    }
  }, [idExpense]);
  const addExpenseItem = () => {
    formik.setValues({
      ...formik.values,
      expenseItems: [
        ...formik.values.expenseItems,
        { accountingNature: null, establishment: null, amount: 0, description: '' },
      ],
    });
  };

  const removeExpenseItem = (index) => {
    const updatedChecklist = [...formik.values.expenseItems];
    updatedChecklist.splice(index, 1);

    formik.setValues({
      ...formik.values,
      expenseItems: updatedChecklist,
    });
  };
  React.useEffect(() => {
    if ((searchParams.get('type') && searchParams.get('type') === 'REQUEST' && !idExpense) || (!canManageFinance && !idExpense)) {
        formik.setFieldValue('status', EXPENSE_STATUS_CHOICES.PENDING)
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
      {loadingExpense && <ProgressService type="form" />}
      {!loadingExpense && (
        <form onSubmit={formik.handleSubmit}>
          {isNotEditable && <Alert severity="warning">Pour modifier cette dépense, contactez le responsable des services généraux</Alert>}
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={4} >
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
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDateTimePicker
                  label="Date et "
                  value={formik.values.expenseDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('expenseDateTime', date)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Structure(s) concernée(s)"
                  placeholder="Ajouter une structure"
                  limitTags={3}
                  value={formik.values.establishments}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishments', newValue)
                  }heure
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
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={7} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={(e) => formik.setFieldValue('description', e.target.value)}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            {!isRequestType && <><Grid item xs={12} sm={12} md={12} >
              <Divider variant="middle" />
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Typography component="div" variant="h6">
                Détail de la dépense selon la nature
              </Typography>
              {formik.values?.expenseItems?.map((item, index) => (
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  key={index}
                >
                  
                  <Grid item xs={12} sm={6} md={3} >
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Nature
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Nature"
                          value={item.accountingNature}
                          onChange={(e) =>
                            formik.setFieldValue(`expenseItems.${index}.accountingNature`, e.target.value)
                          }
                        >
                          <MenuItem value={null}>
                            <em>Choisissez un type</em>
                          </MenuItem>
                          {dataData?.accountingNatures?.map((data, index) => {
                            return (
                              <MenuItem key={index} value={data.id}>
                                {data.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} >
                    <Item>
                      <TheAutocomplete
                        options={establishmentsData?.establishments?.nodes}
                        label="Établissement / Service"
                        placeholder="Ajouter un établissement ou service"
                        multiple={false}
                        value={item.establishment}
                        onChange={(e, newValue) =>
                          formik.setFieldValue(`expenseItems.${index}.establishment`, newValue)
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={2} >
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
                        value={item.amount}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `expenseItems.${index}.amount`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} >
                    <Item sx={{position: 'relative'}}>
                      <TheTextField
                        variant="outlined"
                        label="Description"
                        multiline
                        rows={4}
                        value={item.description}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `expenseItems.${index}.description`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                      <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                        onClick={() => removeExpenseItem(index)}
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
                onClick={addExpenseItem}
                disabled={loadingPost || loadingPut || isNotEditable}
              >
                Ajouter une nature
              </Button>
            </Grid></>}
            <Grid item xs={12} sm={12} md={12} >
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/achats/depenses-engagements/liste"
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