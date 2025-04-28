import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, InputAdornment, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl, Stepper, Step, StepLabel, StepContent, IconButton, InputLabel, Select, MenuItem } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_VEHICLE_TECH_INSPECTION } from '../../../../_shared/graphql/queries/VehicleTechnicalInspectionQueries';
import {
  POST_VEHICLE_TECH_INSPECTION,
  PUT_VEHICLE_TECH_INSPECTION,
} from '../../../../_shared/graphql/mutations/VehicleTechnicalInspectionMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_VEHICLES } from '../../../../_shared/graphql/queries/VehicleQueries';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { Close } from '@mui/icons-material';
import { INSPECTION_FAILURE_TYPES, TECH_INSPECTION_STATES } from '../../../../_shared/tools/constants';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddVehicleTechnicalInspectionForm({
  idVehicleTechnicalInspection,
  title,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      vehicle: null,
      document: undefined,
      inspectionDateTime: dayjs(new Date()),
      nextInspectionDate: null,
      observation: '',
      state: 'FAVORABLE',
      failures: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...vehicleTechnicalInspectionCopy } = values;
      vehicleTechnicalInspectionCopy.vehicle = vehicleTechnicalInspectionCopy.vehicle ? vehicleTechnicalInspectionCopy.vehicle.id : null;
      if (!vehicleTechnicalInspectionCopy?.failures) vehicleTechnicalInspectionCopy['failures'] = [];
      let items = [];
      vehicleTechnicalInspectionCopy?.failures.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      vehicleTechnicalInspectionCopy.failures = items;
      if (vehicleTechnicalInspectionCopy.id && vehicleTechnicalInspectionCopy.id != '') {
        onUpdateVehicleTechnicalInspection({
          id: vehicleTechnicalInspectionCopy.id,
          vehicleTechnicalInspectionData: vehicleTechnicalInspectionCopy,
          document
        });
      } else
        createVehicleTechnicalInspection({
          variables: {
            vehicleTechnicalInspectionData: vehicleTechnicalInspectionCopy,
            document
          },
        });
    },
  });

  const {
    loading: loadingVehicles,
    data: vehiclesData,
    error: vehiclesError,
    fetchMore: fetchMoreVehicles,
  } = useQuery(GET_VEHICLES, {
    fetchPolicy: 'network-only',
  });
  
  const addFailure = (failureType = INSPECTION_FAILURE_TYPES.MINOR) => {
    formik.setValues({
      ...formik.values,
      failures: [
        ...formik.values.failures,
        { failureType , description: ''},
      ],
    });
  };

  const removeFailure = (index) => {
    const updatedFailures = [...formik.values.failures];
    updatedFailures.splice(index, 1);

    formik.setValues({
      ...formik.values,
      failures: updatedFailures,
    });
  };



  const [createVehicleTechnicalInspection, { loading: loadingPost }] = useMutation(
    POST_VEHICLE_TECH_INSPECTION,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...vehicleTechnicalInspectionCopy } =
          data.createVehicleTechnicalInspection.vehicleTechnicalInspection;
        //   formik.setValues(vehicleTechnicalInspectionCopy);
        formik.setFieldValue('id', vehicleTechnicalInspectionCopy.id);
        handleNext();
      },
      update(cache, { data: { createVehicleTechnicalInspection } }) {
        const newVehicleTechnicalInspection =
          createVehicleTechnicalInspection.vehicleTechnicalInspection;

        cache.modify({
          fields: {
            vehicleTechnicalInspections(
              existingVehicleTechnicalInspections = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingVehicleTechnicalInspections.totalCount + 1,
                nodes: [
                  newVehicleTechnicalInspection,
                  ...existingVehicleTechnicalInspections.nodes,
                ],
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
  const [updateVehicleTechnicalInspection, { loading: loadingPut }] = useMutation(
    PUT_VEHICLE_TECH_INSPECTION,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...vehicleTechnicalInspectionCopy } =
          data.updateVehicleTechnicalInspection.vehicleTechnicalInspection;
        //   formik.setValues(vehicleTechnicalInspectionCopy);
        handleNext();
      },
      update(cache, { data: { updateVehicleTechnicalInspection } }) {
        const updatedVehicleTechnicalInspection =
          updateVehicleTechnicalInspection.vehicleTechnicalInspection;

        cache.modify({
          fields: {
            vehicleTechnicalInspections(
              existingVehicleTechnicalInspections = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedVehicleTechnicalInspections =
                existingVehicleTechnicalInspections.nodes.map((vehicleTechnicalInspection) =>
                  readField('id', vehicleTechnicalInspection) ===
                  updatedVehicleTechnicalInspection.id
                    ? updatedVehicleTechnicalInspection
                    : vehicleTechnicalInspection,
                );

              return {
                totalCount: existingVehicleTechnicalInspections.totalCount,
                nodes: updatedVehicleTechnicalInspections,
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
  const onUpdateVehicleTechnicalInspection = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateVehicleTechnicalInspection({ variables });
      },
    });
  };
  const [getVehicleTechnicalInspection, { loading: loadingVehicleTechnicalInspection }] =
    useLazyQuery(GET_VEHICLE_TECH_INSPECTION, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...vehicleTechnicalInspectionCopy1 } = data.vehicleTechnicalInspection;
        let { folder, ...vehicleTechnicalInspectionCopy } = vehicleTechnicalInspectionCopy1;
        vehicleTechnicalInspectionCopy.inspectionDateTime = vehicleTechnicalInspectionCopy.inspectionDateTime ? dayjs(vehicleTechnicalInspectionCopy.inspectionDateTime) : null;
        vehicleTechnicalInspectionCopy.nextInspectionDate = vehicleTechnicalInspectionCopy.nextInspectionDate ? dayjs(vehicleTechnicalInspectionCopy.nextInspectionDate) : null;
        
        if (!vehicleTechnicalInspectionCopy?.failures) vehicleTechnicalInspectionCopy['failures'] = [];
        let items = [];
        vehicleTechnicalInspectionCopy.failures.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        vehicleTechnicalInspectionCopy.failures = items;
        formik.setValues(vehicleTechnicalInspectionCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idVehicleTechnicalInspection) {
      getVehicleTechnicalInspection({ variables: { id: idVehicleTechnicalInspection } });
    }
  }, [idVehicleTechnicalInspection]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idVehicleTechnicalInspection) {
      getVehicle({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 2) navigate('/online/parc-automobile/controles-techniques/liste');
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
      {loadingVehicleTechnicalInspection && <ProgressService type="form" />}
      {!loadingVehicleTechnicalInspection && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idVehicleTechnicalInspection ? true : false}
          >
            <Step>
              <StepLabel
                onClick={() => onGoToStep(0)}
                optional={
                  <Typography variant="caption">Informations générales</Typography>
                }
              >
                Contrôle technique
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <TheFileField
                        variant="outlined"
                        label="Document de Procès verbal"
                        fileValue={formik.values.document}
                        onChange={(file) => formik.setFieldValue('document', file)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheDateTimePicker
                        label="Date et heure du contrôle"
                        value={formik.values.inspectionDateTime}
                        onChange={(date) =>
                          formik.setFieldValue('inspectionDateTime', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <TheAutocomplete
                        options={vehiclesData?.vehicles?.nodes}
                        label="Véhicule concerné"
                        placeholder="Ajouter un véhicule"
                        multiple={false}
                        value={formik.values.vehicle}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('vehicle', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheDesktopDatePicker
                        label="Date du prochain contrôle"
                        value={formik.values.nextInspectionDate}
                        onChange={(date) =>
                          formik.setFieldValue('nextInspectionDate', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          État 
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="État"
                          value={formik.values.state}
                          onChange={(e) =>
                            formik.setFieldValue(
                              'state',
                              e.target.value,
                            )
                          }
                        >
                          {TECH_INSPECTION_STATES?.ALL?.map((type, index) => {
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
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(1)}
                optional={
                  <Typography variant="caption">Les défaillances</Typography>
                }
              >
                Les défaillances
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  sx={{marginY: 5}}
                >
                  <Grid item xs={12} sm={6} md={4}>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      <Grid item xs={12} sm={12} md={12}>
                        <Typography gutterBottom variant="subtitle3" component="h3">
                          Les défaillances mineurs
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} >
                          {formik.values?.failures?.map((item, index) => item?.failureType == INSPECTION_FAILURE_TYPES.MINOR && (
                            <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 4, sm: 8, md: 12 }}
                              key={index}
                            >
                              <Grid item xs={12} sm={12} md={12} >
                                <Item sx={{position: 'relative'}}>
                                  <TheTextField
                                    variant="outlined"
                                    label="Défaillances"
                                    multiline
                                    rows={2}
                                    value={item.description}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `failures.${index}.description`,
                                        e.target.value,
                                      )
                                    }
                                    disabled={loadingPost || loadingPut}
                                  />
                                  <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                    onClick={() => removeFailure(index)}
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
                          onClick={()=> addFailure(INSPECTION_FAILURE_TYPES.MINOR)}
                          disabled={loadingPost || loadingPut}
                        >
                          Ajouter une défaillance mineur
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} sx={{background: '#f9f9f9'}}>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      <Grid item xs={12} sm={12} md={12}>
                        <Typography gutterBottom variant="subtitle3" component="h3">
                          Les défaillances majeurs
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} >
                          {formik.values?.failures?.map((item, index) => item?.failureType == INSPECTION_FAILURE_TYPES.MAJOR && (
                            <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 4, sm: 8, md: 12 }}
                              key={index}
                            >
                              <Grid item xs={12} sm={12} md={12} >
                                <Item sx={{position: 'relative'}}>
                                  <TheTextField
                                    variant="outlined"
                                    label="Défaillances"
                                    multiline
                                    rows={2}
                                    value={item.description}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `failures.${index}.description`,
                                        e.target.value,
                                      )
                                    }
                                    disabled={loadingPost || loadingPut}
                                  />
                                  <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                    onClick={() => removeFailure(index)}
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
                          onClick={()=> addFailure(INSPECTION_FAILURE_TYPES.MAJOR)}
                          disabled={loadingPost || loadingPut}
                        >
                          Ajouter une défaillance majeur
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 3 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      <Grid item xs={12} sm={12} md={12}>
                        <Typography gutterBottom variant="subtitle3" component="h3">
                          Les défaillances critiques
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} >
                          {formik.values?.failures?.map((item, index) => item?.failureType == INSPECTION_FAILURE_TYPES.CRITICAL && (
                            <Grid
                              container
                              spacing={{ xs: 2, md: 3 }}
                              columns={{ xs: 4, sm: 8, md: 12 }}
                              key={index}
                            >
                              <Grid item xs={12} sm={12} md={12} >
                                <Item sx={{position: 'relative'}}>
                                  <TheTextField
                                    variant="outlined"
                                    label="Défaillances"
                                    multiline
                                    rows={2}
                                    value={item.description}
                                    onChange={(e) =>
                                      formik.setFieldValue(
                                        `failures.${index}.description`,
                                        e.target.value,
                                      )
                                    }
                                    disabled={loadingPost || loadingPut}
                                  />
                                  <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                    onClick={() => removeFailure(index)}
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
                          onClick={()=> addFailure(INSPECTION_FAILURE_TYPES.CRITICAL)}
                          disabled={loadingPost || loadingPut}
                        >
                          Ajouter une défaillance critique
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(2)}
                optional={
                  <Typography variant="caption">Contre visites</Typography>
                }
              >
                Contre visites
              </StepLabel>
              <StepContent>
              </StepContent>
            </Step>
          </Stepper>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/parc-automobile/controles-techniques/liste" className="no_style">
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
