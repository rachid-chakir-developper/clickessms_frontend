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
import { GET_TASK } from '../../../../_shared/graphql/queries/TaskQueries';
import {
  POST_TASK,
  PUT_TASK,
} from '../../../../_shared/graphql/mutations/TaskMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import CardDisplayMap from '../../../../_shared/components/helpers/CardDisplayMap';
import { Close } from '@mui/icons-material';
import { TASK_STATUS, PRIORITIES } from '../../../../_shared/tools/constants';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import { GET_SUPPLIERS } from '../../../../_shared/graphql/queries/SupplierQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddTaskForm({ idTask, title }) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFacility = authorizationSystem.requestAuthorization({
    type: 'manageFacility',
  }).authorized;
  const [isNotEditable, setIsNotEditable] = React.useState(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRequestType, setIsRequestType] = React.useState(!canManageFacility);
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom de véhicule')
      .required('Le nom de véhicule est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      startingDateTime: dayjs(new Date()),
      endingDateTime: null,
      latitude: '',
      longitude: '',
      city: '',
      zipCode: '',
      address: '',
      additionalAddress: '',
      priority: 'LOW',
      workLevel: 'MEDIUM',
      status: 'NEW',
      comment: '',
      description: '',
      observation: '',
      isActive: true,
      workersInfos: '',
      vehiclesInfos: '',
      materialsInfos: '',
      establishments: [],
      workers: [],
      vehicles: [],
      materials: [],
      taskChecklist: [],
      supplier: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if(isNotEditable) return
      let taskCopy = {...values};
      taskCopy.establishments = taskCopy.establishments.map((i) => i?.id);
      taskCopy.workers = taskCopy.workers.map((i) => i?.id);
      taskCopy.vehicles = taskCopy.vehicles.map((i) => i.id);
      taskCopy.materials = taskCopy.materials.map((i) => i.id);
      taskCopy.supplier = taskCopy.supplier?.id;
      if (idTask && idTask != '') {
        onUpdateTask({
          id: taskCopy.id,
          taskData: taskCopy,
        });
      } else
        createTask({
          variables: {
            taskData: taskCopy,
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
    loading: loadingSuppliers,
    data: suppliersData,
    error: suppliersError,
    fetchMore: fetchMoreSuppliers,
  } = useQuery(GET_SUPPLIERS, {
    fetchPolicy: 'network-only',
  });
  const [createTask, { loading: loadingPost }] = useMutation(POST_TASK, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...taskCopy } = data.createTask.task;
      //   formik.setValues(taskCopy);
      navigate('/online/travaux/interventions/liste');
    },
    update(cache, { data: { createTask } }) {
      const newTask = createTask.task;

      cache.modify({
        fields: {
          tasks(existingTasks = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingTasks.totalCount + 1,
              nodes: [newTask, ...existingTasks.nodes],
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
  const [updateTask, { loading: loadingPut }] = useMutation(PUT_TASK, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...taskCopy } = data.updateTask.task;
      //   formik.setValues(taskCopy);
      navigate('/online/travaux/interventions/liste');
    },
    update(cache, { data: { updateTask } }) {
      const updatedTask = updateTask.task;

      cache.modify({
        fields: {
          tasks(existingTasks = { totalCount: 0, nodes: [] }, { readField }) {
            const updatedTasks = existingTasks.nodes.map((task) =>
              readField('id', task) === updatedTask.id ? updatedTask : task,
            );

            return {
              totalCount: existingTasks.totalCount,
              nodes: updatedTasks,
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
  const onUpdateTask = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateTask({ variables });
      },
    });
  };
  const [getTask, { loading: loadingTask }] = useLazyQuery(GET_TASK, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log("Task data received:", data.task);
      console.log("Supplier data:", data.task.supplier);
      let { __typename, ...taskCopy1 } = data.task;
      let { folder, employee, ...taskCopy } = taskCopy1;
      taskCopy.startingDateTime = taskCopy.startingDateTime ? dayjs(taskCopy.startingDateTime) : null;
      taskCopy.endingDateTime = taskCopy.endingDateTime ? dayjs(taskCopy.endingDateTime) : null;
      taskCopy.establishments = taskCopy.establishments
        ? taskCopy.establishments.map((i) => i?.establishment)
        : [];
      taskCopy.workers = taskCopy.workers
        ? taskCopy.workers.map((i) => i?.employee)
        : [];
      taskCopy.vehicles = taskCopy.vehicles
        ? taskCopy.vehicles.map((i) => i?.vehicle)
        : [];
      taskCopy.materials = taskCopy.materials
        ? taskCopy.materials.map((i) => i?.material)
        : [];
      if (!taskCopy?.taskChecklist) taskCopy['taskChecklist'] = [];
      let items = [];
      taskCopy.taskChecklist.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      taskCopy.taskChecklist = items;
      formik.setValues(taskCopy);
      if(!canManageFacility && taskCopy.status !== TASK_STATUS.PENDING) setIsNotEditable(true)
    },
    onError: (err) => console.log(err),
  });
  React.useEffect(() => {
    if (idTask) {
      getTask({ variables: { id: idTask } });
    }
  }, [idTask]);
  const addChecklistItem = () => {
    formik.setValues({
      ...formik.values,
      taskChecklist: [
        ...formik.values.taskChecklist,
        { localisation: '', comment: '', description: '' },
      ],
    });
  };

  const removeChecklistItem = (index) => {
    const updatedChecklist = [...formik.values.taskChecklist];
    updatedChecklist.splice(index, 1);

    formik.setValues({
      ...formik.values,
      taskChecklist: updatedChecklist,
    });
  };
  React.useEffect(() => {
    if ((searchParams.get('type') && searchParams.get('type') === 'REQUEST' && !idTask) || (!canManageFacility && !idTask)) {
        formik.setFieldValue('status', TASK_STATUS.PENDING)
        setIsRequestType(true)
    }
    else if(!canManageFacility){
      setIsRequestType(true)
    }
  }, []);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingTask && <ProgressService type="form" />}
      {!loadingTask && (
        <form onSubmit={formik.handleSubmit}>
          {isNotEditable && <Alert severity="warning">Pour modifier cette intervention, contactez le responsable des services généraux</Alert>}
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Titre"
                  value={formik.values.name}
                  onChange={(e) => formik.setFieldValue('name', e.target.value)}
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheDateTimePicker
                  label="Date et heure de début"
                  value={formik.values.startingDateTime}
                  onChange={(date) =>
                    formik.setFieldValue('startingDateTime', date)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Priorité</InputLabel>
                    <Select
                        value={formik.values.priority}
                        onChange={(e) => formik.setFieldValue('priority', e.target.value)}
                        disabled={loadingPost || loadingPut || isNotEditable}
                    >
                    {PRIORITIES?.ALL?.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      );
                    })}
                    </Select>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <CardDisplayMap address={formik.values} onChange={(e)=>{
                  formik.setFieldValue('address', e.address)
                  formik.setFieldValue('city', e.city)
                  formik.setFieldValue('zipCode', e.zipCode)
                  formik.setFieldValue('latitude', e.latitude)
                  formik.setFieldValue('longitude', e.longitude)
                }}/>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid item xs={12} sm={12} md={12} >
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Adresse (Ligne 1)"
                      multiline
                      rows={2}
                      value={formik.values.address}
                      onChange={(e) =>
                        formik.setFieldValue('address', e.target.value)
                      }
                      disabled={loadingPost || loadingPut || isNotEditable}
                    />
                  </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={12} >
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Complément"
                      value={formik.values.additionalAddress}
                      onChange={(e) =>
                        formik.setFieldValue(
                          'additionalAddress',
                          e.target.value,
                        )
                      }
                      disabled={loadingPost || loadingPut || isNotEditable}
                    />
                  </Item>
                </Grid>
                <Grid item xs={12} sm={5} md={5} >
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Code postal"
                      value={formik.values.zipCode}
                      onChange={(e) =>
                        formik.setFieldValue('zipCode', e.target.value)
                      }
                      disabled={loadingPost || loadingPut || isNotEditable}
                    />
                  </Item>
                </Grid>
                <Grid item xs={12} sm={7} md={7} >
                  <Item>
                    <TheTextField
                      variant="outlined"
                      label="Ville"
                      value={formik.values.city}
                      onChange={(e) =>
                        formik.setFieldValue('city', e.target.value)
                      }
                      disabled={loadingPost || loadingPut || isNotEditable}
                    />
                  </Item>
                </Grid>
              </Grid>
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
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
              {!isRequestType && <><Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

                  label="Intervenants"
                  placeholder="Ajouter un intervenant"
                  limitTags={2}
                  value={formik.values.workers}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('workers', newValue)
                  }
                />
              </Item>
              <Item>
                <FormControl fullWidth>
                    <InputLabel>Statut</InputLabel>
                    <Select
                        value={formik.values.status}
                        onChange={(e) => formik.setFieldValue('status', e.target.value)}
                        disabled={loadingPost || loadingPut || isNotEditable}
                    >
                    {TASK_STATUS?.ALL?.map((type, index) => {
                      return (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      );
                    })}
                    </Select>
                </FormControl>
              </Item></>}
            </Grid>
            <Grid item xs={12} sm={6} md={4} >
              <Item>
                <TheAutocomplete
                  options={suppliersData?.suppliers?.nodes || []}
                  label="Fournisseur"
                  placeholder="Sélectionner un fournisseur"
                  multiple={false}
                  value={formik.values.supplier}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('supplier', newValue)
                  }
                  disabled={loadingPost || loadingPut || isNotEditable}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
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
                Les tâches à traiter
              </Typography>
              {formik.values?.taskChecklist?.map((item, index) => (
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  key={index}
                >
                  <Grid item xs={12} sm={4} md={4} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Localisation"
                        value={item.localisation}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `taskChecklist.${index}.localisation`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Commentaire"
                        multiline
                        rows={4}
                        value={item.comment}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `taskChecklist.${index}.comment`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} >
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Description"
                        multiline
                        rows={4}
                        value={item.description}
                        onChange={(e) =>
                          formik.setFieldValue(
                            `taskChecklist.${index}.description`,
                            e.target.value,
                          )
                        }
                        disabled={loadingPost || loadingPut || isNotEditable}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => removeChecklistItem(index)}
                                edge="end"
                              >
                                <Close />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
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
                onClick={addChecklistItem}
                disabled={loadingPost || loadingPut || isNotEditable}
              >
                Ajouter un élément
              </Button>
            </Grid></>}
            <Grid item xs={12} sm={12} md={12} >
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/travaux/interventions/liste"
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
