import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Stack, Box, Typography, Button, Divider, InputAdornment, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';
import dayjs from 'dayjs';

import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import * as yup from 'yup';

import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import { GET_VEHICLE_INSPECTION } from '../../../../_shared/graphql/queries/VehicleInspectionQueries';
import {
  POST_VEHICLE_INSPECTION,
  PUT_VEHICLE_INSPECTION,
} from '../../../../_shared/graphql/mutations/VehicleInspectionMutations';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TheDateTimePicker from '../../../../_shared/components/form-fields/TheDateTimePicker';
import { GET_EMPLOYEES } from '../../../../_shared/graphql/queries/EmployeeQueries';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import SelectCheckmarks from '../../../../_shared/components/form-fields/SelectCheckmarks';
import { GET_PARTNERS } from '../../../../_shared/graphql/queries/PartnerQueries';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_VEHICLES } from '../../../../_shared/graphql/queries/VehicleQueries';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';
import MultipleImageFileField from '../../../../_shared/components/form-fields/MultipleImageFileField';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function AddVehicleInspectionForm({
  idVehicleInspection,
  title,
}) {
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const navigate = useNavigate();
  const validationSchema = yup.object({});
  const formik = useFormik({
    initialValues: {
      number: '',
      vehicle: null,
      inspectionDateTime: dayjs(new Date()),
      nextInspectionDate: null,
      nextTechnicalInspectionDate: null,
      controllerEmployees: [],
      controllerPartner: null,
      mileage: null,
      isRegistrationCardHere: null,
      isInsuranceCertificateHere: null,
      isInsuranceAttestationHere: null,
      isTechnicalControlHere: null,
      isOilLevelChecked: null,
      isWindshieldWasherLevelChecked: null,
      isBrakeFluidLevelChecked: null,
      isCoolantLevelChecked: null,
      isTirePressureChecked: null,
      isLightsConditionChecked: null,
      isBodyConditionChecked: null,
      images: [],
      remarks: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let { images, ...vehicleInspectionCopy } = values;
      images = images?.map((img)=>({id: img?.id, image: img.file || img.path,  caption: img?.caption}))
      vehicleInspectionCopy.controllerEmployees = vehicleInspectionCopy.controllerEmployees.map((i) => i?.id);
      vehicleInspectionCopy.vehicle = vehicleInspectionCopy.vehicle ? vehicleInspectionCopy.vehicle.id : null;
      vehicleInspectionCopy.controllerPartner = vehicleInspectionCopy.controllerPartner ? vehicleInspectionCopy.controllerPartner.id : null;
      if (idVehicleInspection && idVehicleInspection != '') {
        onUpdateVehicleInspection({
          id: vehicleInspectionCopy.id,
          vehicleInspectionData: vehicleInspectionCopy,
          images
        });
      } else
        createVehicleInspection({
          variables: {
            vehicleInspectionData: vehicleInspectionCopy,
            images
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
    loading: loadingEmployees,
    data: employeesData,
    error: employeesError,
    fetchMore: fetchMoreEmployees,
  } = useQuery(GET_EMPLOYEES, {
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



  const [createVehicleInspection, { loading: loadingPost }] = useMutation(
    POST_VEHICLE_INSPECTION,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Ajouté avec succès',
          type: 'success',
        });
        let { __typename, ...vehicleInspectionCopy } =
          data.createVehicleInspection.vehicleInspection;
        //   formik.setValues(vehicleInspectionCopy);
        navigate('/online/parc-automobile/controles-menssuels/liste');
      },
      update(cache, { data: { createVehicleInspection } }) {
        const newVehicleInspection =
          createVehicleInspection.vehicleInspection;

        cache.modify({
          fields: {
            vehicleInspections(
              existingVehicleInspections = { totalCount: 0, nodes: [] },
            ) {
              return {
                totalCount: existingVehicleInspections.totalCount + 1,
                nodes: [
                  newVehicleInspection,
                  ...existingVehicleInspections.nodes,
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
  const [updateVehicleInspection, { loading: loadingPut }] = useMutation(
    PUT_VEHICLE_INSPECTION,
    {
      onCompleted: (data) => {
        console.log(data);
        setNotifyAlert({
          isOpen: true,
          message: 'Modifié avec succès',
          type: 'success',
        });
        let { __typename, ...vehicleInspectionCopy } =
          data.updateVehicleInspection.vehicleInspection;
        //   formik.setValues(vehicleInspectionCopy);
        navigate('/online/parc-automobile/controles-menssuels/liste');
      },
      update(cache, { data: { updateVehicleInspection } }) {
        const updatedVehicleInspection =
          updateVehicleInspection.vehicleInspection;

        cache.modify({
          fields: {
            vehicleInspections(
              existingVehicleInspections = { totalCount: 0, nodes: [] },
              { readField },
            ) {
              const updatedVehicleInspections =
                existingVehicleInspections.nodes.map((vehicleInspection) =>
                  readField('id', vehicleInspection) ===
                  updatedVehicleInspection.id
                    ? updatedVehicleInspection
                    : vehicleInspection,
                );

              return {
                totalCount: existingVehicleInspections.totalCount,
                nodes: updatedVehicleInspections,
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
  const onUpdateVehicleInspection = (variables) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment modifier ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        updateVehicleInspection({ variables });
      },
    });
  };
  const [getVehicleInspection, { loading: loadingVehicleInspection }] =
    useLazyQuery(GET_VEHICLE_INSPECTION, {
      fetchPolicy: 'network-only',
      onCompleted: (data) => {
        let { __typename, ...vehicleInspectionCopy1 } = data.vehicleInspection;
        let { folder, ...vehicleInspectionCopy2 } = vehicleInspectionCopy1;
        let { videos, ...vehicleInspectionCopy } = vehicleInspectionCopy2;
        vehicleInspectionCopy.inspectionDateTime = vehicleInspectionCopy.inspectionDateTime ? dayjs(vehicleInspectionCopy.inspectionDateTime) : null;
        vehicleInspectionCopy.nextInspectionDate = vehicleInspectionCopy.nextInspectionDate ? dayjs(vehicleInspectionCopy.nextInspectionDate) : null;
        vehicleInspectionCopy.nextTechnicalInspectionDate = vehicleInspectionCopy.nextTechnicalInspectionDate ? dayjs(vehicleInspectionCopy.nextTechnicalInspectionDate) : null;
        formik.setValues(vehicleInspectionCopy);
      },
      onError: (err) => console.log(err),
    });
  React.useEffect(() => {
    if (idVehicleInspection) {
      getVehicleInspection({ variables: { id: idVehicleInspection } });
    }
  }, [idVehicleInspection]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography component="div" variant="h5">
        {title} {formik.values.number}
      </Typography>
      {loadingVehicleInspection && <ProgressService type="form" />}
      {!loadingVehicleInspection && (
        <form onSubmit={formik.handleSubmit}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            <Grid xs={12} sm={6} md={4}>
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
            <Grid xs={12} sm={6} md={4}>
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
            <Grid xs={12} sm={6} md={4} item="true">
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
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheAutocomplete
                  options={employeesData?.employees?.nodes}
                  label="Employés Controlleurs"
                  placeholder="Ajouter un employé"
                  limitTags={3}
                  value={formik.values.controllerEmployees}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('controllerEmployees', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheAutocomplete
                  options={partnersData?.partners?.nodes}
                  label="Controlleur partenaire"
                  placeholder="Ajouter un partenaire"
                  multiple={false}
                  value={formik.values.controllerPartner}
                  onChange={(e, newValue) =>
                    formik.setFieldValue('controllerPartner', newValue)
                  }
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4} item="true">
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Nombre de kilomètres"
                  type="number"
                  InputProps={{
                      endAdornment: <InputAdornment position="start">Km</InputAdornment>,
                  }}
                  value={formik.values.mileage}
                  onChange={(e) =>
                    formik.setFieldValue('mileage', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <Item>
                <TheDesktopDatePicker
                  label="Date du prochain contrôle technique"
                  value={formik.values.nextTechnicalInspectionDate}
                  onChange={(date) =>
                    formik.setFieldValue('nextTechnicalInspectionDate', date)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 5}} />
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Carte grise présente</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={formik.values.isRegistrationCardHere}
                    onChange={(e) =>
                      formik.setFieldValue('isRegistrationCardHere', e.target.value)
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Certificat d’assurance présent</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={formik.values.isInsuranceCertificateHere}
                    onChange={(e) =>
                      formik.setFieldValue('isInsuranceCertificateHere', e.target.value)
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Attestation d’assurance présente</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={formik.values.isInsuranceAttestationHere}
                    onChange={(e) =>
                      formik.setFieldValue('isInsuranceAttestationHere', e.target.value)
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Contrôle technique présent</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={formik.values.isTechnicalControlHere}
                    onChange={(e) =>
                      formik.setFieldValue('isTechnicalControlHere', e.target.value)
                    }
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 5}} />
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Typography gutterBottom variant="subtitle3" component="h3">
                Vérification du véhicule:
              </Typography>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau d’huile"
                  checked={formik.values.isOilLevelChecked}
                  value={formik.values.isOilLevelChecked}
                  onChange={(e) =>
                    formik.setFieldValue('isOilLevelChecked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau de liquide de frein"
                  checked={formik.values.isBrakeFluidLevelChecked}
                  value={formik.values.isBrakeFluidLevelChecked}
                  onChange={(e) =>
                    formik.setFieldValue('isBrakeFluidLevelChecked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau de liquide de refroidissement"
                  checked={formik.values.isCoolantLevelChecked}
                  value={formik.values.isCoolantLevelChecked}
                  onChange={(e) =>
                    formik.setFieldValue('isCoolantLevelChecked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau de lave-vitre"
                  checked={formik.values.isWindshieldWasherLevelChecked}
                  value={formik.values.isWindshieldWasherLevelChecked}
                  onChange={(e) =>
                    formik.setFieldValue('isWindshieldWasherLevelChecked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Pression des pneus"
                  checked={formik.values.isTirePressureChecked}
                  value={formik.values.isTirePressureChecked}
                  onChange={(e) =>
                    formik.setFieldValue('isTirePressureChecked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="État des feux"
                  checked={formik.values.isLightsConditionChecked}
                  value={formik.values.isLightsConditionChecked}
                  onChange={(e) =>
                    formik.setFieldValue('isLightsConditionChecked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="État de la carrosserie"
                  checked={formik.values.isBodyConditionChecked}
                  value={formik.values.isBodyConditionChecked}
                  onChange={(e) =>
                    formik.setFieldValue('isBodyConditionChecked', e.target.checked)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 5}} />
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Item>
                <Typography gutterBottom variant="subtitle3" component="h3">
                  Galerie d'images:
                </Typography>
                <MultipleImageFileField
                  imageValue={formik.values.images}
                  onChange={(files) => formik.setFieldValue('images', files)}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 5}} />
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Item>
                <TheTextField
                  variant="outlined"
                  label="Autres remarques"
                  multiline
                  rows={8}
                  value={formik.values.remarks}
                  onChange={(e) =>
                    formik.setFieldValue('remarks', e.target.value)
                  }
                  disabled={loadingPost || loadingPut}
                />
              </Item>
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <Item sx={{ justifyContent: 'end', flexDirection: 'row' }}>
                <Link
                  to="/online/parc-automobile/controles-menssuels/liste"
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
