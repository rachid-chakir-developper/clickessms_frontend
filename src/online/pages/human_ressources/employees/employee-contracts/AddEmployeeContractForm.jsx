import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton, Tooltip, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import SelectCheckmarks from '../../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_DATAS_EMPLOYEE_CONTRACT } from '../../../../../_shared/graphql/queries/DataQueries';
import { CONTRACT_TYPES } from '../../../../../_shared/tools/constants';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import CustomFieldValue from '../../../../../_shared/components/form-fields/costum-fields/CustomFieldValue';
import DialogAddData from '../../../settings/data_management/DialogAddData';
import { Add, Close } from '@mui/icons-material';
import CustomFieldValues from '../../../../../_shared/components/form-fields/costum-fields/CustomFieldValues';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1.5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddEmployeeContractForm({ idEmployeeContract, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog, setPrintingModal } = useFeedBacks();
  const navigate = useNavigate();
  const [triggerSave, setTriggerSave] = React.useState(false);
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
      missions :[],
      establishments :[],
      replacedEmployees: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (activeStep === 2) {
          setTriggerSave(true);
          setTimeout(() => setTriggerSave(false), 100);
          return
      }
      let { document,  ...employeeContractCopy } = values;
      employeeContractCopy.employee = employeeContractCopy.employee ? employeeContractCopy.employee.id : null;
      employeeContractCopy.establishments = employeeContractCopy.establishments.map((i) => i?.id);
      employeeContractCopy.missions = employeeContractCopy.missions.map((i) => i?.id);
      if (!employeeContractCopy?.replacedEmployees) employeeContractCopy['replacedEmployees'] = [];
      const items = [];
      employeeContractCopy.replacedEmployees.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.employee = itemCopy.employee ? itemCopy.employee.id : null 
        items.push(itemCopy);
      });
      employeeContractCopy.replacedEmployees = items;
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
  
  const {
    loading: loadingDatas,
    data: dataData,
    error: datsError,
    fetchMore: fetchMoreDatas,
  } = useQuery(GET_DATAS_EMPLOYEE_CONTRACT, { fetchPolicy: 'network-only' });

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
        formik.setFieldValue('id', employeeContractCopy.id);
        handleNext();
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
        handleNext();
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
      let { __typename, folder, leaveDayInfos, customFieldValues, ...employeeContractCopy } = data.employeeContract;
      employeeContractCopy.startingDate = employeeContractCopy.startingDate ? dayjs(employeeContractCopy.startingDate) : null;
      employeeContractCopy.endingDate = employeeContractCopy.endingDate ? dayjs(employeeContractCopy.endingDate) : null;
      employeeContractCopy.establishments =
      employeeContractCopy.establishments
        ? employeeContractCopy.establishments.map((i) => i?.establishment)
        : [];
      employeeContractCopy.missions =
      employeeContractCopy.missions
        ? employeeContractCopy.missions.map((i) => i?.mission)
        : [];
        if (!employeeContractCopy?.replacedEmployees) employeeContractCopy['replacedEmployees'] = [];
        const items = [];
        employeeContractCopy.replacedEmployees.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
          itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
          items.push(itemCopy);
        });
        employeeContractCopy.replacedEmployees = items;
      formik.setValues(employeeContractCopy);
    },
    onError: (err) => console.log(err),
  });

  const onOpenModalToPrint = (EmployeeContract) => {
    setPrintingModal({
        isOpen: true,
        type: 'EmployeeContract',
        data: EmployeeContract,
        onClose: () => { 
          setPrintingModal({isOpen: false})
          navigate('/online/ressources-humaines/contrats/liste');
          }
      })
  }

  React.useEffect(() => {
    if (idEmployeeContract) {
      getEmployeeContract({ variables: { id: idEmployeeContract } });
    }
  }, [idEmployeeContract]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idEmployeeContract) {
      getEmployeeContract({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const addReplacedEmployee = () => {
    formik.setValues({
      ...formik.values,
      replacedEmployees: [
        ...formik.values.replacedEmployees,
        { employee: null, position: '', reason: '', startingDate: null, endingDate: null},
      ],
    });
  };

  const removeReplacedEmployee = (index) => {
    const updatedReplacedEmployees = [...formik.values.replacedEmployees];
    updatedReplacedEmployees.splice(index, 1);

    formik.setValues({
      ...formik.values,
      replacedEmployees: updatedReplacedEmployees,
    });
  };

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 2) onOpenModalToPrint(formik.values)
    else if (formik.values.id)
      setSearchParams({ step: activeStep + 1, id: formik.values.id });
    else setSearchParams({ step: activeStep + 1 });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (formik.values.id)
      setSearchParams({ step: activeStep + 1, id: formik.values.id });
    else setSearchParams({ step: activeStep + 1 });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const onGoToStep = (step = 0) => {
    if (formik.values.id) {
      setActiveStep(step);
      setSearchParams({ step, id: formik.values.id });
    }
  };

  const [openAddDataDialog, setOpenAddDataDialog] = React.useState(false);
    const handleClickAddData = () => {
      setOpenAddDataDialog(true);
    };
    const closeAddDataDialog = (value) => {
      setOpenAddDataDialog(false);
        if(value && value?.id && value?.id !=''){
            formik.setFieldValue('missions', [...formik.values.missions, value]);
        }
    };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingEmployeeContract && <ProgressService type="form" />}
      {!loadingEmployeeContract && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idEmployeeContract ? true : false}
          >
            <Step>
              <StepLabel
                onClick={() => onGoToStep(0)}
                optional={
                  <Typography variant="caption">Informations générales</Typography>
                }
              >
                Informations générales
              </StepLabel>
              <StepContent>
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
                        options={establishmentsData?.establishments?.nodes || []}
                        label="Structures concernées"
                        placeholder="Ajouter une structure"
                        limitTags={3}
                        value={formik.values.establishments}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('establishments', newValue)
                        }
                      />
                    </Item>
                    <Item sx={{ display: "flex", justifyContent: "space-around", flexDirection: "row", alignContent: "center"}}>
                      <SelectCheckmarks
                        options={dataData?.employeeMissions || []}
                        label="Missions"
                        placeholder="Ajouter une mission"
                        limitTags={3}
                        value={formik.values.missions}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('missions', newValue)
                        }
                      />
                      <Tooltip title="Ajouter une mission si vous ne la trouvez pas dans la liste" sx={{width: 50, height: 50}}>
                        <IconButton onClick={handleClickAddData}>
                            <Add />
                        </IconButton>
                      </Tooltip>
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
                        label="Jours de congé trimestriel initiaux (CT)"
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
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(1)}
                optional={
                  <Typography variant="caption">Remplacement</Typography>
                }
              >
                Remplacement
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                    {formik.values?.replacedEmployees?.map((item, index) => (
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        key={index}
                      >
                        <Grid item xs={12} sm={6} md={2.5}>
                          <Item>
                            <TheAutocomplete
                              options={employeesData?.employees?.nodes}
                              onInput={(e) => {
                                onGetEmployees(e.target.value)
                              }}
                              label="Employé"
                              placeholder="Choisissez un employé ?"
                              multiple={false}
                              value={item.employee}
                              onChange={(e, newValue) =>
                                {
                                  formik.setFieldValue(`replacedEmployees.${index}.employee`, newValue)
                                  if(newValue?.position) formik.setFieldValue(`replacedEmployees.${index}.position`, newValue?.position)
                                }
                              }
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.5} >
                          <Item>
                            <TheTextField
                              variant="outlined"
                              label="Poste"
                              value={item.position}
                              onChange={(e) =>
                                formik.setFieldValue(`replacedEmployees.${index}.position`, e.target.value)
                              }
                              disabled={loadingPost || loadingPut}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} >
                          <Item>
                            <TheTextField
                              variant="outlined"
                              label="Raison"
                              value={item.reason}
                              onChange={(e) =>
                                formik.setFieldValue(`replacedEmployees.${index}.reason`, e.target.value)
                              }
                              disabled={loadingPost || loadingPut}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2} >
                          <Item>
                            <TheDesktopDatePicker
                              variant="outlined"
                              label="Date de début"
                              value={item.startingDate}
                              onChange={(date) =>
                                formik.setFieldValue(`replacedEmployees.${index}.startingDate`, date)
                              }
                              disabled={loadingPost || loadingPut}
                            />
                          </Item>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2} >
                          <Item sx={{position: 'relative'}}>
                            <TheDesktopDatePicker
                              variant="outlined"
                              label="Date de fin"
                              value={item.endingDate}
                              onChange={(date) =>
                                formik.setFieldValue(`replacedEmployees.${index}.endingDate`, date)
                              }
                              disabled={loadingPost || loadingPut}
                            />
                            <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                              onClick={() => removeReplacedEmployee(index)}
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
                  <Grid xs={12} sm={12} md={12} item>
                      <Box onClick={addReplacedEmployee} sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', borderStyle: 'dashed', borderWidth: 2, borderColor: '#f1f1f1', backgroundColor: '#fcfcfc'}}>
                          <Typography variant="small" gutterBottom sx={{ color: '#c1c1c1', fontStyle: 'italic' }}>
                              Cliquez pour ajouter un employé à remplacer
                          </Typography>
                          <Button
                              variant="outlined"
                              size="small"
                              color="secondary"
                              disabled={loadingPost || loadingPut}
                              sx={{textTransform: 'initial', fontStyle: 'italic'}}
                          >
                              Ajouter un employé à remplacer
                          </Button>
                      </Box>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(2)}
                optional={
                  <Typography variant="caption">Autres informations</Typography>
                }
              >
                Autres informations
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                    <CustomFieldValues 
                      formModel="EmployeeContract"
                      idObject={formik.values.id}
                      disabled={loadingPost || loadingPut}
                      triggerSave={triggerSave}
                      onSaved={(data, err)=> {if(data) handleNext()}}
                    />
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
          </Stepper>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row', paddingY: 8 }}>
                <Link
                  to="/online/ressources-humaines/contrats/liste"
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
      <DialogAddData
        open={openAddDataDialog}
        onClose={closeAddDataDialog}
        data={{ name: 'Mission d’employé dans un contrat', description: '', type: 'EmployeeMission' }}
      />
    </Box>
  );
}
