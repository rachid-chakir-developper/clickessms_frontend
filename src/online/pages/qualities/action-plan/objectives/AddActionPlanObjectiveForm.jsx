import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, Divider, Stepper, Step, StepLabel, StepContent, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_ACTION_PLAN_OBJECTIVE } from '../../../../../_shared/graphql/queries/ActionPlanObjectiveQueries';
import {
  POST_ACTION_PLAN_OBJECTIVE,
  PUT_ACTION_PLAN_OBJECTIVE,
} from '../../../../../_shared/graphql/mutations/ActionPlanObjectiveMutations';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../../_shared/components/form-fields/TheDateTimePicker';
import TheAutocomplete from '../../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_EMPLOYEES } from '../../../../../_shared/graphql/queries/EmployeeQueries';
import { GET_ESTABLISHMENTS } from '../../../../../_shared/graphql/queries/EstablishmentQueries';
import { Close } from '@mui/icons-material';
import TheDesktopDatePicker from '../../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { ACTION_STATUS, PRIORITIES } from '../../../../../_shared/tools/constants';
import { GET_ACTION_PLAN_ACTIONS } from '../../../../../_shared/graphql/queries/ActionPlanActionQueries';
import { GET_UNDESIRABLE_EVENTS } from '../../../../../_shared/graphql/queries/UndesirableEventQueries';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddActionPlanObjectiveForm({ idActionPlanObjective, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    title: yup
      .string("Entrez l'objet de l'objectif")
      .required("L'objet de l'objectif est obligatoire"),
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      title: '',
      description: '',
      establishments: [],
      priority: 'LOW',
      actions: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let actionPlanObjectiveCopy = { ...values };
      actionPlanObjectiveCopy.establishments = actionPlanObjectiveCopy.establishments.map((i) => i?.id);
      actionPlanObjectiveCopy.employee = actionPlanObjectiveCopy.employee ? actionPlanObjectiveCopy.employee.id : null;
      if (!actionPlanObjectiveCopy?.actions) actionPlanObjectiveCopy['actions'] = [];
      let items = [];
      actionPlanObjectiveCopy.actions.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.employees = itemCopy.employees.map((i) => i?.id);
        items.push(itemCopy);
      });
      actionPlanObjectiveCopy.actions = items;
      if (idActionPlanObjective && idActionPlanObjective != '') {
        onUpdateActionPlanObjective({
          id: actionPlanObjectiveCopy.id,
          actionPlanObjectiveData: actionPlanObjectiveCopy,
        });
      } else
        createActionPlanObjective({
          variables: {
            actionPlanObjectiveData: actionPlanObjectiveCopy,
          },
        });
    },
  });

  
  const addAction = () => {
    formik.setValues({
      ...formik.values,
      actions: [
        ...formik.values.actions,
        { action: '', dueDate: null, employees:[], status: ACTION_STATUS.TO_DO},
      ],
    });
  };

  const removeAction = (index) => {
    const updatedReportItems = [...formik.values.actions];
    updatedReportItems.splice(index, 1);

    formik.setValues({
      ...formik.values,
      actions: updatedReportItems,
    });
  }; 

  const [createActionPlanObjective, { loading: loadingPost }] = useMutation(POST_ACTION_PLAN_OBJECTIVE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...actionPlanObjectiveCopy } = data.createActionPlanObjective.actionPlanObjective;
      //   formik.setValues(actionPlanObjectiveCopy);
        formik.setFieldValue('id', actionPlanObjectiveCopy.id);
        handleNext();
    },
    refetchQueries: [{ query: GET_ACTION_PLAN_ACTIONS }],
    update(cache, { data: { createActionPlanObjective } }) {
      const newActionPlanObjective = createActionPlanObjective.actionPlanObjective;

      cache.modify({
        fields: {
          actionPlanObjectives(existingActionPlanObjectives = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingActionPlanObjectives.totalCount + 1,
              nodes: [newActionPlanObjective, ...existingActionPlanObjectives.nodes],
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
  const [updateActionPlanObjective, { loading: loadingPut }] = useMutation(PUT_ACTION_PLAN_OBJECTIVE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...actionPlanObjectiveCopy } = data.updateActionPlanObjective.actionPlanObjective;
      //   formik.setValues(actionPlanObjectiveCopy);
      handleNext();
    },
    refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }, { query: GET_ACTION_PLAN_ACTIONS }],
    update(cache, { data: { updateActionPlanObjective } }) {
      const updatedActionPlanObjective = updateActionPlanObjective.actionPlanObjective;

      cache.modify({
        fields: {
          actionPlanObjectives(
            existingActionPlanObjectives = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedActionPlanObjectives = existingActionPlanObjectives.nodes.map((actionPlanObjective) =>
              readField('id', actionPlanObjective) === updatedActionPlanObjective.id
                ? updatedActionPlanObjective
                : actionPlanObjective,
            );

            return {
              totalCount: existingActionPlanObjectives.totalCount,
              nodes: updatedActionPlanObjectives,
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
  const onUpdateActionPlanObjective = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateActionPlanObjective({ variables });
      },
    });
  };
  const [getActionPlanObjective, { loading: loadingActionPlanObjective }] = useLazyQuery(GET_ACTION_PLAN_OBJECTIVE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, folder, completionPercentage, undesirableEvent, ...actionPlanObjectiveCopy } = data.actionPlanObjective;
        if (!actionPlanObjectiveCopy?.actions) actionPlanObjectiveCopy['actions'] = [];
        let items = [];
        actionPlanObjectiveCopy.actions.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          itemCopy.dueDate = itemCopy.dueDate ? dayjs(itemCopy.dueDate): null;
          items.push(itemCopy);
        });
        actionPlanObjectiveCopy.actions = items;
      formik.setValues(actionPlanObjectiveCopy);
    },
    onError: (err) => console.log(err),
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

  React.useEffect(() => {
    if (idActionPlanObjective) {
      getActionPlanObjective({ variables: { id: idActionPlanObjective } });
    }
  }, [idActionPlanObjective]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idActionPlanObjective) {
      getActionPlanObjective({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 1) navigate('/online/qualites/plan-action/objectifs/liste');
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
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingActionPlanObjective && <ProgressService type="form" />}
      {!loadingActionPlanObjective && (
        <form onSubmit={formik.handleSubmit}>
          
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idActionPlanObjective ? true : false}
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
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid xs={12} sm={6} md={5}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Libellé"
                        id="title"
                        value={formik.values.title}
                        required
                        onChange={(e) =>
                          formik.setFieldValue('title', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
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
                  <Grid xs={12} sm={6} md={3}>
                    <Item>
                      <FormControl fullWidth>
                          <InputLabel>Priorité</InputLabel>
                          <Select
                              value={formik.values.priority}
                              onChange={(e) => formik.setFieldValue('priority', e.target.value)}
                              disabled={loadingPost || loadingPut}
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
                  <Grid xs={12} sm={12} md={12}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Description"
                        multiline
                        minRows={6}
                        value={formik.values.description}
                        onChange={(e) =>
                          formik.setFieldValue('description', e.target.value)
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
                  <Typography variant="caption">Les actions</Typography>
                }
              >
                Les actions 
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid xs={12} sm={12} md={12} item="true">
                    {formik.values?.actions?.map((item, index) => (
                      <Grid
                        container
                        columns={{ xs: 4, sm: 8, md: 12 }}
                        key={index}
                        sx={{background: index%2 === 0 ?  "#f2f2f2" : "#f9f9f9", padding: 3}}
                      >
                        <Grid xs={12} sm={12} md={12} item="true">
                          <Item sx={{position: 'relative'}}>
                            <TheTextField
                              variant="outlined"
                              label="Action"
                              multiline
                              rows={2}
                              value={item.action}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `actions.${index}.action`,
                                  e.target.value,
                                )
                              }
                              disabled={loadingPost || loadingPut}
                            />
                            <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                              onClick={() => removeAction(index)}
                              edge="end"
                              color="error"
                            >
                              <Close />
                            </IconButton>
                          </Item>
                        </Grid>
                        <Grid xs={12} sm={6} md={4} item="true">
                          <Item>
                            <TheDesktopDatePicker
                              label="Échéance"
                              value={item.dueDate}
                              onChange={(date) =>
                                formik.setFieldValue(`actions.${index}.dueDate`, date)
                              }
                              disabled={loadingPost || loadingPut}
                            />
                          </Item>
                        </Grid>
                        <Grid xs={12} sm={6} md={5} item="true">
                          <Item>
                            <TheAutocomplete
                              options={employeesData?.employees?.nodes}
                              label="Personnes concernées"
                              placeholder="Ajouter une personne"
                              limitTags={3}
                              value={item.employees}
                              onChange={(e, newValue) =>
                                formik.setFieldValue(`actions.${index}.employees`, newValue)
                              }
                            />
                          </Item>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                          <Item>
                            <FormControl fullWidth>
                                <InputLabel>Statut</InputLabel>
                                <Select
                                    value={item.status}
                                    onChange={(e) => formik.setFieldValue(`actions.${index}.status`, e.target.value)}
                                    disabled={loadingPost || loadingPut}
                                >
                                {ACTION_STATUS?.ALL?.map((type, index) => {
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
                      </Grid>
                    ))}
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      item="true"
                      sx={{ display: 'flex', justifyContent: 'flex-end', marginY:4 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addAction}
                        disabled={loadingPost || loadingPut}
                      >
                        Ajouter une action
                      </Button>
                    </Grid>
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
            <Grid xs={12} sm={12} md={12} item="true">
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/qualites/plan-action/objectifs/liste"
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
