import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Stack } from '@mui/material';

import { VEHICLE_INSPECTION_RECAP } from '../../../../_shared/graphql/queries/VehicleInspectionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime } from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import { Edit } from '@mui/icons-material';
import VehicleItemCard from '../vehicles/VehicleItemCard';
import PartnerItemCard from '../../partnerships/partners/PartnerItemCard';
import TitlebarImageList from '../../../_shared/components/media/TitlebarImageList';
import TheSwitch from '../../../../_shared/components/form-fields/theSwitch';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function VehicleInspectionDetails() {
  let { idVehicleInspection } = useParams();
  const [
    getVehicleInspection,
    {
      loading: loadingVehicleInspection,
      data: vehicleInspectionData,
      error: vehicleInspectionError,
    },
  ] = useLazyQuery(VEHICLE_INSPECTION_RECAP);
  React.useEffect(() => {
    if (idVehicleInspection) {
      getVehicleInspection({ variables: { id: idVehicleInspection } });
    }
  }, [idVehicleInspection]);

  if (loadingVehicleInspection) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
        <Link
          to={`/online/parc-automobile/controles-vehicules/modifier/${vehicleInspectionData?.vehicleInspection?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} sm={12} md={4}>
            <VehicleInspectionMiniInfos
              vehicleInspection={vehicleInspectionData?.vehicleInspection}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <VehicleInspectionOtherInfos
              vehicleInspection={vehicleInspectionData?.vehicleInspection}
            />
          </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 5}} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Carte grise présente</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    checked={vehicleInspectionData?.vehicleInspection?.isRegistrationCardHere}
                    value={vehicleInspectionData?.vehicleInspection?.isRegistrationCardHere}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Certificat d’assurance présent</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    checked={vehicleInspectionData?.vehicleInspection?.isInsuranceCertificateHere}
                    value={vehicleInspectionData?.vehicleInspection?.isInsuranceCertificateHere}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Attestation d’assurance présente</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    checked={vehicleInspectionData?.vehicleInspection?.isInsuranceAttestationHere}
                    value={vehicleInspectionData?.vehicleInspection?.isInsuranceAttestationHere}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Item>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label" sx={{textAlign: 'left'}}>Contrôle technique présent</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-groups"
                    checked={vehicleInspectionData?.vehicleInspection?.isTechnicalControlHere}
                    value={vehicleInspectionData?.vehicleInspection?.isTechnicalControlHere}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio />} label="Non" />
                  </RadioGroup>
                </FormControl>
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 5}} />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Typography gutterBottom variant="subtitle3" component="h3">
                Vérification du véhicule:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau d’huile"
                  checked={vehicleInspectionData?.vehicleInspection?.isOilLevelChecked}
                  value={vehicleInspectionData?.vehicleInspection?.isOilLevelChecked}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau de liquide de frein"
                  checked={vehicleInspectionData?.vehicleInspection?.isBrakeFluidLevelChecked}
                  value={vehicleInspectionData?.vehicleInspection?.isBrakeFluidLevelChecked}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau de liquide de refroidissement"
                  checked={vehicleInspectionData?.vehicleInspection?.isCoolantLevelChecked}
                  value={vehicleInspectionData?.vehicleInspection?.isCoolantLevelChecked}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Niveau de lave-vitre"
                  checked={vehicleInspectionData?.vehicleInspection?.isWindshieldWasherLevelChecked}
                  value={vehicleInspectionData?.vehicleInspection?.isWindshieldWasherLevelChecked}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="Pression des pneus"
                  checked={vehicleInspectionData?.vehicleInspection?.isTirePressureChecked}
                  value={vehicleInspectionData?.vehicleInspection?.isTirePressureChecked}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="État des feux"
                  checked={vehicleInspectionData?.vehicleInspection?.isLightsConditionChecked}
                  value={vehicleInspectionData?.vehicleInspection?.isLightsConditionChecked}
                />
              </Item>
              <Item>
                <TheSwitch
                  variant="outlined"
                  label="État de la carrosserie"
                  checked={vehicleInspectionData?.vehicleInspection?.isBodyConditionChecked}
                  value={vehicleInspectionData?.vehicleInspection?.isBodyConditionChecked}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Divider variant="middle" sx={{marginY: 5}} />
            </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Galerie d'images
              </Typography>
                <TitlebarImageList
                  images={vehicleInspectionData?.vehicleInspection?.images}
                  videos={vehicleInspectionData?.vehicleInspection?.videos}
                />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Autres remarques
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {vehicleInspectionData?.vehicleInspection?.remarks}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function VehicleInspectionMiniInfos({ vehicleInspection }) {
  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          margin: 'auto',
          //maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography gutterBottom variant="subtitle1" component="div">
                  Réference : <b>{vehicleInspection?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {vehicleInspection?.title}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Crée le: </b>{' '}
                  {`${getFormatDateTime(vehicleInspection?.createdAt)}`} <br />
                  <b>Dernière modification: </b>
                  {`${getFormatDateTime(vehicleInspection?.updatedAt)}`}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Date et heure de contrôle: </b>
                  {`${getFormatDateTime(vehicleInspection?.inspectionDateTime)}`}<br />
                  <b>Date et heure de prochain contrôle: </b>
                  {`${getFormatDate(vehicleInspection?.nextInspectionDate)}`}<br />
                  <b>Date et heure de prochain contrôle technique: </b>
                  {`${getFormatDate(vehicleInspection?.nextTechnicalInspectionDate)}`}
                  <b>Nombre de kilomètres: </b>
                  {vehicleInspection?.mileage} km
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

function VehicleInspectionOtherInfos({ vehicleInspection }) {
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      <Grid item xs={12} sm={12} md={6}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            margin: 'auto',
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
          }}
        >
          <Typography gutterBottom variant="subtitle3" component="h3">
            Le véhicule concerné
          </Typography>
          <VehicleItemCard vehicle={vehicleInspection?.vehicle} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            margin: 'auto',
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
          }}
        >
          <Typography gutterBottom variant="subtitle3" component="h3">
            Les controlleurs
          </Typography>
          <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
            {vehicleInspection?.controllerEmployees?.map((employee, index) => (
              <Grid item xs={12} sm={12} md={12} key={index} sx={{marginY: 1}}>
                <Item>
                  <EmployeeItemCard employee={employee} />
                </Item>
              </Grid>
            ))}
            {vehicleInspection?.controllerPartner && <Grid item xs={12} sm={12} md={12}>
              <Item>
                <PartnerItemCard partner={vehicleInspection?.controllerPartner} />
              </Item>
            </Grid>}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
