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
import { GET_VEHICLE_REPAIR } from '../../../../_shared/graphql/queries/VehicleRepairQueries';
import {
  POST_VEHICLE_REPAIR,
  PUT_VEHICLE_REPAIR,
} from '../../../../_shared/graphql/mutations/VehicleRepairMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_VEHICLES } from '../../../../_shared/graphql/queries/VehicleQueries';
import TheFileField from '../../../../_shared/components/form-fields/TheFileField';
import { GET_PARTNERS } from '../../../../_shared/graphql/queries/PartnerQueries';
import { Close } from '@mui/icons-material';
import { REPAIR_STATES } from '../../../../_shared/tools/constants';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddVehicleRepairForm({
  idVehicleRepair,
  title,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    vehicle: yup
      .mixed() // mixed est utilisé pour des valeurs non primitives comme des objets.
      .required('Le véhicule est obligatoire') // Message d'erreur si ce champ est vide
  });
  const formik = useFormik({
    initialValues: {
      number: '',
      vehicle: null,
      garagePartner: null,
      document: undefined,
      state: 'COMPLETED',
      report: '',
      repairDateTime: dayjs(new Date()),
      description: '',
      observation: '',
      repairs: [],
      vigilantPoints: []
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { document, ...vehicleRepairCopy } = values;
      vehicleRepairCopy.vehicle = vehicleRepairCopy.vehicle ? vehicleRepairCopy.vehicle.id : null;
      vehicleRepairCopy.garagePartner = vehicleRepairCopy.garagePartner ? vehicleRepairCopy.garagePartner.id : null;
      if (!vehicleRepairCopy?.repairs) vehicleRepairCopy['repairs'] = [];
      let items = [];
      vehicleRepairCopy.repairs.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      vehicleRepairCopy.repairs = items;
      if (!vehicleRepairCopy?.vigilantPoints) vehicleRepairCopy['vigilantPoints'] = [];
      items = [];
      vehicleRepairCopy.vigilantPoints.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      vehicleRepairCopy.vigilantPoints = items;
      if (idVehicleRepair && idVehicleRepair != '') {
        onUpdateVehicleRepair({
          id: vehicleRepairCopy.id,
          vehicleRepairData: vehicleRepairCopy,
          document
        });
      } else
        createVehicleRepair({
          variables: {
            vehicleRepairData: vehicleRepairCopy,
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
  
  const {
    loading: loadingPartners,
    data: partnersData,
    error: partnersError,
    fetchMore: fetchMorePartners,
  } = useQuery(GET_PARTNERS, {
    fetchPolicy: 'network-only',
  });

  const addRepair = () => {
    formik.setValues({
      ...formik.values,
      repairs: [
        ...formik.values.repairs,
        { description: ''},
      ],
    });
  };

  const removeRepair = (index) => {
    const updatedReportItems = [...formik.values.repairs];
    updatedReportItems.splice(index, 1);

    formik.setValues({
      ...formik.values,
      repairs: updatedReportItems,
    });
  }; 
  const addVigilantPoint = () => {
    formik.setValues({
      ...formik.values,
      vigilantPoints: [
        ...formik.values.vigilantPoints,
        { description: ''},
      ],
    });
  };

  const removeVigilantPoint = (index) => {
    const updatedReportItems = [...formik.values.vigilantPoints];
    updatedReportItems.splice(index, 1);

    formik.setValues({
      ...formik.values,
      vigilantPoints: updatedReportItems,
    });
  };
  

  const [createVehicleRepair, { loading: loadingPost }] = useMutation(
    POST_VEHICLE_REPAIR,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...vehicleRepairCopy } =
          data.createVehicleRepair.vehicleRepair;
        //   formik.setValues(vehicleRepairCopy);
        formik.setFieldValue('id', vehicleRepairCopy.id);
        handleNext();
      },
      update(cache, { data: { createVehicleRepair } }) {
        const newVehicleRepair =
          createVehicleRepair.vehicleRepair;

        cache.modify({
          fields: {
            vehicleRepairs(
              existingVehicleRepairs = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingVehicleRepairs.totalCount + 1,
                nodes: [
                  newVehicleRepair,
                  ...existingVehicleRepairs.nodes,
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
  const [updateVehicleRepair, { loading: loadingPut }] = useMutation(
    PUT_VEHICLE_REPAIR,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...vehicleRepairCopy } =
          data.updateVehicleRepair.vehicleRepair;
        //   formik.setValues(vehicleRepairCopy);
        handleNext();
      },
      update(cache, { data: { updateVehicleRepair } }) {
        const updatedVehicleRepair =
          updateVehicleRepair.vehicleRepair;

        cache.modify({
          fields: {
            vehicleRepairs(
              existingVehicleRepairs = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedVehicleRepairs =
                existingVehicleRepairs.nodes.map((vehicleRepair) =>
                  readField('id', vehicleRepair) ===
                  updatedVehicleRepair.id
                    ? updatedVehicleRepair
                    : vehicleRepair,
                );

              return {
                totalCount: existingVehicleRepairs.totalCount,
                nodes: updatedVehicleRepairs,
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
  const onUpdateVehicleRepair = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateVehicleRepair({ variables });
      },
    });
  };
  const [getVehicleRepair, { loading: loadingVehicleRepair }] =
    useLazyQuery(GET_VEHICLE_REPAIR, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...vehicleRepairCopy1 } = data.vehicleRepair;
        let { folder, ...vehicleRepairCopy } = vehicleRepairCopy1;
        vehicleRepairCopy.repairDateTime = vehicleRepairCopy.repairDateTime ? dayjs(vehicleRepairCopy.repairDateTime) : null;
        if (!vehicleRepairCopy?.repairs) vehicleRepairCopy['repairs'] = [];
        let items = [];
        vehicleRepairCopy.repairs.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        vehicleRepairCopy.repairs = items;

        items = [];
        if (!vehicleRepairCopy?.vigilantPoints) vehicleRepairCopy['vigilantPoints'] = [];
        vehicleRepairCopy.vigilantPoints.forEach((item) => {
          let { __typename, ...itemCopy } = item;
          items.push(itemCopy);
        });
        vehicleRepairCopy.vigilantPoints = items;
        formik.setValues(vehicleRepairCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idVehicleRepair) {
      getVehicleRepair({ variables: { id: idVehicleRepair } });
    }
  }, [idVehicleRepair]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idVehicleRepair) {
      getVehicle({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 1) navigate('/online/parc-automobile/reparations/liste');
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
      {loadingVehicleRepair && <ProgressService type="form" />}
      {!loadingVehicleRepair && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idVehicleRepair ? true : false}
          >
            <Step>
              <StepLabel
                onClick={() => onGoToStep(0)}
                optional={
                  <Typography variant="caption">Informations générales</Typography>
                }
              >
                Réparation
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={6} md={4}>
                    <Item>
                      <TheDateTimePicker
                        label="Date et heure de réparation"
                        value={formik.values.repairDateTime}
                        onChange={(date) =>
                          formik.setFieldValue('repairDateTime', date)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <TheAutocomplete
                        id="vehicle"
                        options={vehiclesData?.vehicles?.nodes}
                        label="Véhicule concerné"
                        placeholder="Ajouter un véhicule"
                        multiple={false}
                        value={formik.values.vehicle}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('vehicle', newValue)
                        }
                        
                        onBlur={formik.handleBlur}
                        error={formik.touched.vehicle && Boolean(formik.errors.vehicle)} // Affiche l'erreur si touché et invalide
                        helperText={formik.touched.vehicle && formik.errors.vehicle}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} >
                    <Item>
                      <TheAutocomplete
                        options={partnersData?.partners?.nodes}
                        label="Garage partenaire"
                        placeholder="Ajouter un garage partenaire"
                        multiple={false}
                        value={formik.values.garagePartner}
                        onChange={(e, newValue) =>
                          formik.setFieldValue('garagePartner', newValue)
                        }
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={2} sm={4} md={4}>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel>État </InputLabel>
                        <Select
                          value={formik.values.state}
                          onChange={(e) =>
                            formik.setFieldValue('state', e.target.value)
                          }
                          disabled={loadingPost || loadingPut}
                        >
                          {REPAIR_STATES?.ALL?.map((type, index) => {
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
                      <TheFileField
                        variant="outlined"
                        label="Document Compte-rendu"
                        fileValue={formik.values.document}
                        onChange={(file) => formik.setFieldValue('document', file)}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Déscription"
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
                  <Grid item xs={12} sm={12} md={12}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Compte-rendu"
                        multiline
                        rows={4}
                        value={formik.values.report}
                        onChange={(e) =>
                          formik.setFieldValue('report', e.target.value)
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
                  <Typography variant="caption">Réparations menées et Points de vigilance</Typography>
                }
              >
                Réparations menées et Points de vigilance
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                  sx={{marginY: 5}}
                >
                  <Grid item xs={12} sm={12} md={6} > 
                    <Typography variant="h6">Les réparations menées</Typography> 
                    {formik.values?.repairs?.map((item, index) => (
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
                              label="Déscription"
                              multiline
                              rows={2}
                              value={item.description}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `repairs.${index}.description`,
                                  e.target.value,
                                )
                              }
                              disabled={loadingPost || loadingPut}
                            />
                            <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                              onClick={() => removeRepair(index)}
                              edge="end"
                              color="error"
                            >
                              <Close />
                            </IconButton>
                          </Item>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      item
                      sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom:4 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addRepair}
                        disabled={loadingPost || loadingPut}
                      >
                        Ajouter une réparation
                      </Button>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} sm={12} md={6}sx={{background: '#f9f9f9'}}>
                    <Typography variant="h6">Les points de vigilance</Typography>  
                    {formik.values?.vigilantPoints?.map((item, index) => (
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
                              label="Déscription"
                              multiline
                              rows={2}
                              value={item.description}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `vigilantPoints.${index}.description`,
                                  e.target.value,
                                )
                              }
                              disabled={loadingPost || loadingPut}
                            />
                            <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                              onClick={() => removeVigilantPoint(index)}
                              edge="end"
                              color="error"
                            >
                              <Close />
                            </IconButton>
                          </Item>
                        </Grid>
                      </Grid>
                    ))}
                    <Grid
                      xs={12}
                      sm={12}
                      md={12}
                      item
                      sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom:4 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addVigilantPoint}
                        disabled={loadingPost || loadingPut}
                      >
                        Ajouter un point
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
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/parc-automobile/reparations/liste" className="no_style">
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
