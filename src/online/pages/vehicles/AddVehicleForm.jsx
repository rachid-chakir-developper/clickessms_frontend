import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, Divider, Stepper, Step, StepLabel, StepContent, IconButton } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_VEHICLE } from '../../../_shared/graphql/queries/VehicleQueries';
import {
  POST_VEHICLE,
  PUT_VEHICLE,
} from '../../../_shared/graphql/mutations/VehicleMutations';
import ProgressService from '../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../_shared/components/form-fields/TheAutocomplete';
import { GET_ESTABLISHMENTS } from '../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_EMPLOYEES } from '../../../_shared/graphql/queries/EmployeeQueries';
import TheDesktopDatePicker from '../../../_shared/components/form-fields/TheDesktopDatePicker';
import { Close } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddVehicleForm({ idVehicle, title }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({
    name: yup
      .string('Entrez le nom de véhicule')
      .required('Le nom de véhicule est obligatoire'),
    registrationNumber: yup
      .string('Entrez le matricule de véhicule')
      .required('Le matricule de véhicule est obligatoire'),
  });
  const formik = useFormik({
    initialValues: {
      image: undefined,
      number: '',
      name: '',
      registrationNumber: '',
      description: '',
      observation: '',
      isActive: true,
      vehicleEstablishments: [],
      vehicleEmployees: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { image, ...vehicleCopy } = values;
      if (!vehicleCopy?.vehicleEstablishments) vehicleCopy['vehicleEstablishments'] = [];
      let items = [];
      vehicleCopy.vehicleEstablishments.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.establishments = itemCopy.establishments.map((i) => i?.id);
        items.push(itemCopy);
      });
      vehicleCopy.vehicleEstablishments = items;
      if (!vehicleCopy?.vehicleEmployees) vehicleCopy['vehicleEmployees'] = [];
      items = [];
      vehicleCopy.vehicleEmployees.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.employees = itemCopy.employees.map((i) => i?.id);
        items.push(itemCopy);
      });
      vehicleCopy.vehicleEmployees = items;
      if (idVehicle && idVehicle != '') {
        onUpdateVehicle({
          id: vehicleCopy.id,
          vehicleData: vehicleCopy,
          image: image,
        });
      } else
        createVehicle({
          variables: {
            vehicleData: vehicleCopy,
            image: image,
          },
        });
    },
  });
  const [createVehicle, { loading: loadingPost }] = useMutation(POST_VEHICLE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Ajouté avec succès',
        type: 'success',
      });
      let { __typename, ...vehicleCopy } = data.createVehicle.vehicle;
      //   formik.setValues(vehicleCopy);
      navigate('/online/vehicules/liste');
    },
    update(cache, { data: { createVehicle } }) {
      const newVehicle = createVehicle.vehicle;

      cache.modify({
        fields: {
          vehicles(existingVehicles = { totalCount: 0, nodes: [] }) {
            return {
              totalCount: existingVehicles.totalCount + 1,
              nodes: [newVehicle, ...existingVehicles.nodes],
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
  const [updateVehicle, { loading: loadingPut }] = useMutation(PUT_VEHICLE, {
    onCompleted: (data) => {
      console.log(data);
      setNotifyAlert({
        isOpen: true,
        message: 'Modifié avec succès',
        type: 'success',
      });
      let { __typename, ...vehicleCopy } = data.updateVehicle.vehicle;
      //   formik.setValues(vehicleCopy);
      navigate('/online/vehicules/liste');
    },
    update(cache, { data: { updateVehicle } }) {
      const updatedVehicle = updateVehicle.vehicle;

      cache.modify({
        fields: {
          vehicles(
            existingVehicles = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedVehicles = existingVehicles.nodes.map((vehicle) =>
              readField('id', vehicle) === updatedVehicle.id
                ? updatedVehicle
                : vehicle,
            );

            return {
              totalCount: existingVehicles.totalCount,
              nodes: updatedVehicles,
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
  const onUpdateVehicle = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateVehicle({ variables });
      },
    });
  };
  const [getVehicle, { loading: loadingVehicle }] = useLazyQuery(GET_VEHICLE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      let { __typename, ...vehicleCopy1 } = data.vehicle;
      let { folder, ...vehicleCopy } = vehicleCopy1;
        
      if (!vehicleCopy?.vehicleEstablishments) vehicleCopy['vehicleEstablishments'] = [];
      let items = [];
      vehicleCopy.vehicleEstablishments.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
        itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
        items.push(itemCopy);
      });
      vehicleCopy.vehicleEstablishments = items;
        
      if (!vehicleCopy?.vehicleEmployees) vehicleCopy['vehicleEmployees'] = [];
      items = [];
      vehicleCopy.vehicleEmployees.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.startingDate = itemCopy.startingDate ? dayjs(itemCopy.startingDate) : null
        itemCopy.endingDate = itemCopy.endingDate ? dayjs(itemCopy.endingDate) : null
        items.push(itemCopy);
      });
      vehicleCopy.vehicleEmployees = items;
      formik.setValues(vehicleCopy);
    },
    onError: (err) => console.log(err),
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
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  } = useQuery(GET_EMPLOYEES, {
    fetchPolicy: 'network-only',
  });

  
  const addVehicleEstablishment = () => {
    formik.setValues({
      ...formik.values,
      vehicleEstablishments: [
        ...formik.values.vehicleEstablishments,
        { establishments: [] , startingDate: dayjs(new Date()), endingDate: null},
      ],
    });
  };

  const removeVehicleEstablishment = (index) => {
    const updatedVehicleEstablishments = [...formik.values.vehicleEstablishments];
    updatedVehicleEstablishments.splice(index, 1);

    formik.setValues({
      ...formik.values,
      vehicleEstablishments: updatedVehicleEstablishments,
    });
  };

  const addVehicleEmployee = () => {
    formik.setValues({
      ...formik.values,
      vehicleEmployees: [
        ...formik.values.vehicleEmployees,
        { employees: [] , startingDate: dayjs(new Date()), endingDate: null},
      ],
    });
  };

  const removeVehicleEmployee = (index) => {
    const updatedVehicleEmployees = [...formik.values.vehicleEmployees];
    updatedVehicleEmployees.splice(index, 1);

    formik.setValues({
      ...formik.values,
      vehicleEmployees: updatedVehicleEmployees,
    });
  };



  React.useEffect(() => {
    if (idVehicle) {
      getVehicle({ variables: { id: idVehicle } });
    }
  }, [idVehicle]);

  
  React.useEffect(() => {
    if (searchParams.get('id') && !idVehicle) {
      getVehicle({ variables: { id: searchParams.get('id') } });
    }
  }, []);

  const [activeStep, setActiveStep] = React.useState(
    searchParams.get('step') ? Number(searchParams.get('step')) : 0,
  );

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if(activeStep >= 1) navigate('/online/vehicules/liste');
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
      {loadingVehicle && <ProgressService type="form" />}
      {!loadingVehicle && (
        <form onSubmit={formik.handleSubmit}>
          <Stepper
            activeStep={activeStep}
            orientation="vertical"
            nonLinear={idVehicle ? true : false}
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
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <ImageFileField
                        variant="outlined"
                        label="Image"
                        imageValue={formik.values.image}
                        onChange={(imageFile) =>
                          formik.setFieldValue('image', imageFile)
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Nom"
                        id="name"
                        value={formik.values.name}
                        required
                        onChange={(e) => formik.setFieldValue('name', e.target.value)}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
                  </Grid>
                  <Grid xs={2} sm={4} md={4}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Matricule"
                        id="registrationNumber"
                        value={formik.values.registrationNumber}
                        required
                        onChange={(e) =>
                          formik.setFieldValue('registrationNumber', e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.registrationNumber &&
                          Boolean(formik.errors.registrationNumber)
                        }
                        helperText={
                          formik.touched.registrationNumber &&
                          formik.errors.registrationNumber
                        }
                        disabled={loadingPost || loadingPut}
                      />
                    </Item>
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
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(1)}
                optional={
                  <Typography variant="caption">Les structures</Typography>
                }
              >
                Les structures
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid xs={12} sm={12} md={12} item="true">
                      {formik.values?.vehicleEstablishments?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid xs={12} sm={6} md={6} item="true">
                            <Item>
                              <TheAutocomplete
                                options={establishmentsData?.establishments?.nodes}
                                label="Établissements / Services"
                                placeholder="Ajouter un établissement ou service"
                                limitTags={3}
                                value={item.establishments}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`vehicleEstablishments.${index}.establishments`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de début"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleEstablishments.${index}.startingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item sx={{position: 'relative'}}>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleEstablishments.${index}.endingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeVehicleEstablishment(index)}
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
                    item="true"
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addVehicleEstablishment}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une structure
                    </Button>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel
                onClick={() => onGoToStep(2)}
                optional={
                  <Typography variant="caption">Les employés</Typography>
                }
              >
                Les employés
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid xs={12} sm={12} md={12} item="true">
                      {formik.values?.vehicleEmployees?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid xs={12} sm={6} md={6} item="true">
                            <Item>
                              <TheAutocomplete
                                options={employeesData?.employees?.nodes}
                                label="Employés"
                                placeholder="Ajouter un employé"
                                limitTags={3}
                                value={item.employees}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`vehicleEmployees.${index}.employees`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de début"
                                value={item.startingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleEmployees.${index}.startingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid xs={12} sm={6} md={3} item="true">
                            <Item sx={{position: 'relative'}}>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin"
                                value={item.endingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleEmployees.${index}.endingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeVehicleEmployee(index)}
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
                    item="true"
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addVehicleEmployee}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter un employé
                    </Button>
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
            <Grid xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/vehicules/liste" className="no_style">
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
