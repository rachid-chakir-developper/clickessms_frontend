import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import TheFileField from '../../../../../_shared/components/form-fields/TheFileField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_EMPLOYEE_CONTRACT } from '../../../../../_shared/graphql/queries/EmployeeContractQueries';
import {
  POST_EMPLOYEE_CONTRACT,
  PUT_EMPLOYEE_CONTRACT,
} from '../../../../../_shared/graphql/mutations/EmployeeContractMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../../_shared/components/form-fields/TheDateTimePicker';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../../_shared/graphql/queries/EmployeeQueries';
import { GET_ESTABLISHMENTS } from '../../../../../_shared/graphql/queries/EstablishmentQueries';
import { CONTRACT_TYPES } from '../../../../../_shared/tools/constants';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import CustomFieldValue from '../../../../../_shared/components/form-fields/costum-fields/CustomFieldValue';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEmployeeContractForm({ idEmployeeContract, title }) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      document: undefined,
      number: '',
      title: '',
      monthlyGrossSalary: 0,
      salary: 0,
      position: '',
      startingDate: dayjs(new Date()),
      endingDate: null,
      initialPaidLeaveDays: 25,
      initialRwtDays: 10,
      initialTemporaryDays: 5,
      description: '',
      observation: '',
      isActive: true,
      employee: null,
      contractType: 'CDI',
      establishments :[],
      customFieldValues: []
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...employeeContractCopy } = values;
      employeeContractCopy.employee = employeeContractCopy.employee ? employeeContractCopy.employee.id : null;
      employeeContractCopy.establishments = employeeContractCopy.establishments.map((i) => i?.id);
      if (idEmployeeContract && idEmployeeContract != '') {
        onUpdateEmployeeContract({
          id: employeeContractCopy.id,
          employeeContractData: employeeContractCopy,
          document: document,
        });
      } else
        createEmployeeContract({
          variables: {
            employeeContractData: employeeContractCopy,
            document: document,
          },
        });
    },
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
 
  
  const {
    loading: loadingEstablishments,
    data: establishmentsData,
    error: establishmentsError,
    fetchMore: fetchMoreEstablishments,
  } = useQuery(GET_ESTABLISHMENTS, {
    fetchPolicy: 'network-only',
  });

  const [createEmployeeContract, { loading: loadingPost }] = useMutation(POST_EMPLOYEE_CONTRACT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...employeeContractCopy } = data.createEmployeeContract.employeeContract;
      //   formik.setValues(employeeContractCopy);
      navigate('/online/ressources-humaines/employes/contrats/liste');
    },
    update(cache, { data: { createEmployeeContract } }) {
      const newEmployeeContract = createEmployeeContract.employeeContract;

      cache.modify({
        fields: {
          employeeContracts(existingEmployeeContracts = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingEmployeeContracts.totalCount + 1,
              nodes: [newEmployeeContract, ...existingEmployeeContracts.nodes],
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
  const [updateEmployeeContract, { loading: loadingPut }] = useMutation(PUT_EMPLOYEE_CONTRACT, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...employeeContractCopy } = data.updateEmployeeContract.employeeContract;
      //   formik.setValues(employeeContractCopy);
      navigate('/online/ressources-humaines/employes/contrats/liste');
    },
    update(cache, { data: { updateEmployeeContract } }) {
      const updatedEmployeeContract = updateEmployeeContract.employeeContract;

      cache.modify({
        fields: {
          employeeContracts(existingEmployeeContracts = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedEmployeeContracts = existingEmployeeContracts.nodes.map((employeeContract) =>
              readField('id', employeeContract) === updatedEmployeeContract.id ? updatedEmployeeContract : employeeContract,
            );

            return {
              totalCount: existingEmployeeContracts.totalCount,
              nodes: updatedEmployeeContracts,
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
  const onUpdateEmployeeContract = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateEmployeeContract({ variables });
      },
    });
  };
  const [getEmployeeContract, { loading: loadingEmployeeContract }] = useLazyQuery(GET_EMPLOYEE_CONTRACT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, leaveDayInfos, ...employeeContractCopy } = data.employeeContract;
      employeeContractCopy.startingDate = employeeContractCopy.startingDate ? dayjs(employeeContractCopy.startingDate) : null;
      employeeContractCopy.endingDate = employeeContractCopy.endingDate ? dayjs(employeeContractCopy.endingDate) : null;
      employeeContractCopy.establishments =
      employeeContractCopy.establishments
        ? employeeContractCopy.establishments.map((i) => i?.establishment)
        : [];
      formik.setValues(employeeContractCopy);
    },
    onError: (err) => console.log(err),
  });

  React.useEffect(() => {
    if (idEmployeeContract) {
      getEmployeeContract({ variables: { id: idEmployeeContract } });
    }
  }, [idEmployeeContract]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingEmployeeContract && <ProgressService type="form" />}
      {!loadingEmployeeContract && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
          >
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

                  label="Employé"
                  placeholder="Choisissez un employé ?"
                  multiple={false}
                  value={formik.values.employee}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('employee', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Poste occupé"
                  value={formik.values.position}
                  onChange={(e) =>
                    formik.setFieldValue('position', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Type de contrat
                  </InputLabel>
                  <Select
                    label="Type de contrat"
                    value={formik.values.contractType}
                    onChange={(e) =>
                      formik.setFieldValue('contractType', e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>Choisissez un type</em>
                    </MenuItem>
                    {CONTRACT_TYPES?.ALL?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.value}>
                          {data.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Salaire brut mensuel"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  value={formik.values.monthlyGrossSalary}
                  onChange={(e) =>
                    formik.setFieldValue(`monthlyGrossSalary`, e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDesktopDatePicker
                  label="Date de début"
                  value={formik.values.startingDate}
                  onChange={(date) =>
                    formik.setFieldValue('startingDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDesktopDatePicker
                  label="Date de fin"
                  value={formik.values.endingDate}
                  onChange={(date) =>
                    formik.setFieldValue('endingDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheAutocomplete
                  options={establishmentsData?.establishments?.nodes}
                  label="Structures concernées"
                  placeholder="Ajouter une tructure"
                  limitTags={3}
                  value={formik.values.establishments}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('establishments', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheFileField variant="outlined" label="Document de contrat"
                  fileValue={formik.values.document}
                  onChange={(file) => formik.setFieldValue('document', file)}
                  disabled={loadingPost || loadingPut}
                  />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Jours de congé annuel initiaux (CP)"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">Jours</InputAdornment>,
                  }}
                  value={formik.values.initialPaidLeaveDays}
                  onChange={(e) =>
                    formik.setFieldValue(`initialPaidLeaveDays`, e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Jours RTT initiaux"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">Jours</InputAdornment>,
                  }}
                  value={formik.values.initialRwtDays}
                  onChange={(e) =>
                    formik.setFieldValue(`initialRwtDays`, e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Jours de congé temporaire initiaux (CT)"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">Jours</InputAdornment>,
                  }}
                  value={formik.values.initialTemporaryDays}
                  onChange={(e) =>
                    formik.setFieldValue(`initialTemporaryDays`, e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item>
                <CustomFieldValue 
                    formModel="EmployeeContract"
                    initialValues={formik.values.customFieldValues}
                    onChange={(newValues)=>{
                      formik.setFieldValue(`customFieldValues`, newValues)
                    }}
                    disabled={loadingPost || loadingPut}
                  />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/ressources-humaines/employes/contrats/liste"
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
