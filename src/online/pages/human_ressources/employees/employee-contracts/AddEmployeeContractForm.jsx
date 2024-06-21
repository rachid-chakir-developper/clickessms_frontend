import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
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
import { GET_DATAS_EMPLOYEE } from '../../../../../_shared/graphql/queries/DataQueries';
import { GET_ESTABLISHMENTS } from '../../../../../_shared/graphql/queries/EstablishmentQueries';

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
      salary: 0,
      position: '',
      startingDate: dayjs(new Date()),
      endingDate: null,
      annualLeaveDays: 25,
      description: '',
      observation: '',
      isActive: true,
      employee: null,
      contractType: null,
      establishments :[]
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
  const {
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  } = useQuery(GET_EMPLOYEES, {
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
      let { __typename, folder, restLeaveDays, ...employeeContractCopy } = data.employeeContract;
      employeeContractCopy.startingDate = employeeContractCopy.startingDate ? dayjs(employeeContractCopy.startingDate) : null;
      employeeContractCopy.endingDate = employeeContractCopy.endingDate ? dayjs(employeeContractCopy.endingDate) : null;
      employeeContractCopy.contractType = employeeContractCopy.contractType ? Number(employeeContractCopy.contractType.id) : null;
      employeeContractCopy.establishments =
      employeeContractCopy.establishments
        ? employeeContractCopy.establishments.map((i) => i?.establishment)
        : [];
      formik.setValues(employeeContractCopy);
    },
    onError: (err) => console.log(err),
  });

  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_EMPLOYEE, { fetchPolicy: 'network-only' });

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
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
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
            <Grid xs={12} sm={6} md={4} item="true">
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
            <Grid xs={12} sm={6} md={4} item="true">
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
                    {dataData?.employeeContractTypes?.map((data, index) => {
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
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Salaire"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  value={formik.values.salary}
                  onChange={(e) =>
                    formik.setFieldValue(`salary`, e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheDateTimePicker
                  label="Date et heure de début"
                  value={formik.values.startingDate}
                  onChange={(date) =>
                    formik.setFieldValue('startingDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheDateTimePicker
                  label="Date de fin"
                  value={formik.values.endingDate}
                  onChange={(date) =>
                    formik.setFieldValue('endingDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
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
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheFileField variant="outlined" label="Document de contrat"
                  fileValue={formik.values.document}
                  onChange={(file) => formik.setFieldValue('document', file)}
                  disabled={loadingPost || loadingPut}
                  />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nombre de jours de congé annuels"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">Jours</InputAdornment>,
                  }}
                  value={formik.values.annualLeaveDays}
                  onChange={(e) =>
                    formik.setFieldValue(`annualLeaveDays`, e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
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
            </Grid>
            <Grid xs={12} sm={6} md={6}>
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
            <Grid xs={12} sm={12} md={12}>
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
