import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { Stack, Box, Typography, Button, Divider, Stepper, Step, StepLabel, StepContent, IconButton, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import ImageFileField from '../../../../_shared/components/form-fields/ImageFileField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_VEHICLE } from '../../../../_shared/graphql/queries/VehicleQueries';
import {
  POST_VEHICLE,
  PUT_VEHICLE,
} from '../../../../_shared/graphql/mutations/VehicleMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import { GET_ESTABLISHMENTS } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { Close } from '@mui/icons-material';
import { GET_DATAS_VEHICLE } from '../../../../_shared/graphql/queries/DataQueries';
import { CRIT_AIR_CHOICES, OWNERSHIP_TYPE_CHOICES, VEHICLE_STATES } from '../../../../_shared/tools/constants';

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
      id: null,
      image: undefined,
      number: '',
      name: '',
      registrationNumber: '',
      vehicleBrand: null,
      vehicleModel: null,
      state: 'GOOD',
      critAirVignette: null,
      description: '',
      observation: '',
      isActive: true,
      vehicleEstablishments: [],
      vehicleEmployees: [],
      vehicleOwnerships: [],
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
      if (!vehicleCopy?.vehicleOwnerships) vehicleCopy['vehicleOwnerships'] = [];
      items = [];
      vehicleCopy.vehicleOwnerships.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        items.push(itemCopy);
      });
      vehicleCopy.vehicleOwnerships = items;
      if (vehicleCopy?.id && vehicleCopy?.id != '') {
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
        formik.setFieldValue('id', vehicleCopy.id);
        handleNext();
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
        handleNext();
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
      let { __typename, folder, mileage, ...vehicleCopy } = data.vehicle;
      vehicleCopy.vehicleBrand = vehicleCopy.vehicleBrand ? Number(vehicleCopy.vehicleBrand.id) : null;
      vehicleCopy.vehicleModel = vehicleCopy.vehicleModel ? Number(vehicleCopy.vehicleModel.id) : null;
        
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
        
      if (!vehicleCopy?.vehicleOwnerships) vehicleCopy['vehicleOwnerships'] = [];
      items = [];
      vehicleCopy.vehicleOwnerships.forEach((item) => {
        let { __typename, ...itemCopy } = item;
        itemCopy.purchaseDate = itemCopy.purchaseDate ? dayjs(itemCopy.purchaseDate) : null
        itemCopy.saleDate = itemCopy.saleDate ? dayjs(itemCopy.saleDate) : null
        itemCopy.rentalStartingDate = itemCopy.rentalStartingDate ? dayjs(itemCopy.rentalStartingDate) : null
        itemCopy.rentalEndingDate = itemCopy.rentalEndingDate ? dayjs(itemCopy.rentalEndingDate) : null
        items.push(itemCopy);
      });
      vehicleCopy.vehicleOwnerships = items;
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
  } = useQuery(GET_DATAS_VEHICLE, { fetchPolicy: 'network-only' });

  
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

  const addVehicleOwnership = () => {
    formik.setValues({
      ...formik.values,
      vehicleOwnerships: [
        ...formik.values.vehicleOwnerships,
        { 
          purchaseDate: dayjs(new Date()),
          purchasePrice: null,
          saleDate: dayjs(new Date()),
          salePrice: null,
          rentalStartingDate: dayjs(new Date()),
          rentalEndingDate: null,
          rentalPrice: null,
          rentPurchasePrice: null,
          expectedMileage: null,
          loanDetails: null,
        },
      ],
    });
  };

  const removeVehicleOwnership = (index) => {
    const updatedVehicleOwnerships = [...formik.values.vehicleOwnerships];
    updatedVehicleOwnerships.splice(index, 1);

    formik.setValues({
      ...formik.values,
      vehicleOwnerships: updatedVehicleOwnerships,
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
    if(activeStep >= 3) navigate('/online/parc-automobile/vehicules/liste');
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
      <Typography component="div" variant="h5" sx={{marginBottom: 3}}>
        {title} <u><b>{formik.values.name}</b></u> immatriculé <u><b>{formik.values.registrationNumber}</b></u> rattaché à la structure <u><b>{formik.values.vehicleEstablishments[0]?.establishments[0]?.name}</b></u>
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
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={3} >
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Marque
                        </InputLabel>
                        <Select
                          label="Marque"
                          value={formik.values.vehicleBrand}
                          onChange={(e) =>
                            formik.setFieldValue('vehicleBrand', e.target.value)
                          }
                        >
                          <MenuItem value="">
                            <em>Choisissez une marque</em>
                          </MenuItem>
                          {dataData?.vehicleBrands?.map((data, index) => {
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
                  <Grid item xs={12} sm={6} md={3} >
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Modèle
                        </InputLabel>
                        <Select
                          label="Modèle"
                          value={formik.values.vehicleModel}
                          onChange={(e) =>
                            formik.setFieldValue('vehicleModel', e.target.value)
                          }
                        >
                          <MenuItem value="">
                            <em>Choisissez un modèle</em>
                          </MenuItem>
                          {dataData?.vehicleModels?.map((data, index) => {
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
                  <Grid item xs={12} sm={6} md={3}>
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
                          {VEHICLE_STATES?.ALL?.map((type, index) => {
                            return (
                              <MenuItem key={index} value={type.value}>
                                {type.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Item>
                    <Item>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Vignette Crit’Air 
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="Vignette Crit’Air"
                          value={formik.values.critAirVignette}
                          onChange={(e) =>
                            formik.setFieldValue(
                              'critAirVignette',
                              e.target.value,
                            )
                          }
                        >
                          <MenuItem value="">
                            <em>&nbsp;</em>
                          </MenuItem>
                          {CRIT_AIR_CHOICES?.ALL?.map((type, index) => {
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
                  <Grid item xs={12} sm={12} md={9}>
                    <Item>
                      <TheTextField
                        variant="outlined"
                        label="Description"
                        multiline
                        rows={5}
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
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.vehicleEstablishments?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={6} >
                            <Item>
                              <TheAutocomplete
                                options={establishmentsData?.establishments?.nodes}
                                label="Structure(s) concernée(s)"
                                placeholder="Ajouter une structure"
                                limitTags={3}
                                value={item.establishments}
                                onChange={(e, newValue) =>
                                  formik.setFieldValue(`vehicleEstablishments.${index}.establishments`, newValue)
                                }
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
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
                          <Grid item xs={12} sm={6} md={3} >
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
                    item
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
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.vehicleEmployees?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={6} >
                            <Item>
                              <TheAutocomplete
                                options={employeesData?.employees?.nodes}
onInput={(e) => {
                          onGetEmployees(e.target.value)
                        }}

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
                          <Grid item xs={12} sm={6} md={3} >
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
                          <Grid item xs={12} sm={6} md={3} >
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
                    item
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
            <Step>
              <StepLabel
                onClick={() => onGoToStep(3)}
                optional={
                  <Typography variant="caption">Statut de détention</Typography>
                }
              >
                Statut de détention
              </StepLabel>
              <StepContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  <Grid item xs={12} sm={12} md={12} >
                      {formik.values?.vehicleOwnerships?.map((item, index) => (
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          key={index}
                        >
                          <Grid item xs={12} sm={6} md={3}>
                            <Item>
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Statut 
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="Statut"
                                  value={item.ownershipType}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      `vehicleOwnerships.${index}.ownershipType`,
                                      e.target.value,
                                    )
                                  }
                                >
                                  {OWNERSHIP_TYPE_CHOICES?.ALL?.map((type, index) => {
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
                          {item.ownershipType === OWNERSHIP_TYPE_CHOICES.PURCHASE && <><Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date d’achat"
                                value={item.purchaseDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.purchaseDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Prix d’achat"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                value={item.purchasePrice}
                                onChange={(e) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.purchasePrice`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeVehicleOwnership(index)}
                                edge="end"
                                color="error"
                              >
                                <Close />
                              </IconButton>
                            </Item>
                          </Grid></>}
                          {item.ownershipType === OWNERSHIP_TYPE_CHOICES.SALE && <><Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de vente"
                                value={item.saleDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.saleDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Prix de vente"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                value={item.salePrice}
                                onChange={(e) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.salePrice`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeVehicleOwnership(index)}
                                edge="end"
                                color="error"
                              >
                                <Close />
                              </IconButton>
                            </Item>
                          </Grid></>}
                          {[OWNERSHIP_TYPE_CHOICES.LEASE, OWNERSHIP_TYPE_CHOICES.LEASE_PURCHASE_OPTION].includes(item.ownershipType) && <><Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de location"
                                value={item.rentalStartingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.rentalStartingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            <Item>
                              <TheDesktopDatePicker
                                variant="outlined"
                                label="Date de fin de location"
                                value={item.rentalEndingDate}
                                onChange={(date) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.rentalEndingDate`, date)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3} >
                            <Item>
                              <TheTextField
                                variant="outlined"
                                label="Prix de location"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                value={item.rentalPrice}
                                onChange={(e) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.rentalPrice`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>
                            { item.ownershipType === OWNERSHIP_TYPE_CHOICES.LEASE_PURCHASE_OPTION && <Item>
                              <TheTextField
                                variant="outlined"
                                label="Option d'achat"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                value={item.rentPurchasePrice}
                                onChange={(e) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.rentPurchasePrice`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                            </Item>}
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Kilométrage prévisionnel"
                                type="number"
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">Km</InputAdornment>,
                                }}
                                value={item.expectedMileage}
                                onChange={(e) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.expectedMileage`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeVehicleOwnership(index)}
                                edge="end"
                                color="error"
                              >
                                <Close />
                              </IconButton>
                            </Item>
                          </Grid></>}
                          {item.ownershipType === OWNERSHIP_TYPE_CHOICES.LOAN && <>
                          <Grid item xs={12} sm={6} md={9}>
                            <Item sx={{position: 'relative'}}>
                              <TheTextField
                                variant="outlined"
                                label="Détails"
                                value={item.loanDetails}
                                onChange={(e) =>
                                  formik.setFieldValue(`vehicleOwnerships.${index}.loanDetails`, e.target.value)
                                }
                                disabled={loadingPost || loadingPut}
                              />
                              <IconButton sx={{position: 'absolute', top: -3, right: -2}}
                                onClick={() => removeVehicleOwnership(index)}
                                edge="end"
                                color="error"
                              >
                                <Close />
                              </IconButton>
                            </Item>
                          </Grid></>}
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
                      onClick={addVehicleOwnership}
                      disabled={loadingPost || loadingPut}
                    >
                      Ajouter une modalité
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
            <Grid item xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link to="/online/parc-automobile/vehicules/liste" className="no_style">
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
