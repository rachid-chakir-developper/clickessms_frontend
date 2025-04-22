import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import { GET_RECAP_VEHICLE } from '../../../../_shared/graphql/queries/VehicleQueries';
import { getCritAirVignetteLabel, getFormatDateTime, getVehicleStateLabel } from '../../../../_shared/tools/functions';
import styled from '@emotion/styled';
import { DriveEta, Edit, ArrowBack } from '@mui/icons-material';
import VehicleTabs from './vehicles-tabs/VehicleTabs';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function VehicleDetails() {
  let { idVehicle } = useParams();
  const [
    getVehicle,
    { loading: loadingVehicle, data: vehicleData },
  ] = useLazyQuery(GET_RECAP_VEHICLE);
  React.useEffect(() => {
    if (idVehicle) {
      getVehicle({ variables: { id: idVehicle } });
    }
  }, [idVehicle]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/parc-automobile/vehicules/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Box>
          <Link
            to={`/online/parc-automobile/vehicules/modifier/${vehicleData?.vehicle?.id}`}
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Edit />} size="small">
              Modifier
            </Button>
          </Link>
        </Box>
      </Box>
      {vehicleData?.vehicle && (
        <VehicleDetailsPage
          vehicle={vehicleData?.vehicle}
        />
      )}
    </Stack>
  );
}
const VehicleDetailsPage = ({ vehicle }) => {
  const {
    id,
    number,
    name,
    image,
    coverImage,
    registrationNumber,
    vehicleBrand,
    vehicleModel,
    isActive,
    folder,
    state,
    mileage,
    critAirVignette,
    vehicleEstablishments,
    vehicleEmployees,
    vehicleOwnerships,
    description,
    observation,
    createdAt,
    updatedAt,
  } = vehicle;

  return (
    <Grid container spacing={3}>
      {/* Informations de l'employé */}
      <Grid item xs={12} sm={4}>
        <Paper
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            backgroundImage: `url(${coverImage})`, // Ajoutez l'image d'arrière-plan ici
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 1),
          }}
        >
          <Box
            sx={{
              py: 1.2,
              px: 2,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
              boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2) inset',
            }}
          >
            <Avatar
              src={image}
              alt={name}
              sx={{
                width: 100,
                height: 100,
                boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', // Ajoutez l'ombre extérieure ici
                border: '2px solid white', // Ajoutez une bordure blanche autour de l'avatar si nécessaire
              }}
            >
              <DriveEta />
            </Avatar>
            <Box
              sx={{
                mt: 1,
                width: '100%',
                display: 'flex',
                borderRadius: 1.5,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: (theme) => theme.palette.primary.contrastText,
              }}
            >
              <Typography variant="h5" gutterBottom>
                {name}
              </Typography>
              {vehicle?.vehicleBrand && <Typography variant="body2">
                {`${vehicle?.vehicleBrand?.name} ${vehicle?.vehicleModel?.name}`}
              </Typography>}
              <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
                {vehicle?.registrationNumber}
              </Typography>
              {<Typography variant="body2">
                Kilomètrage : <b>{vehicle?.mileage} km</b>
              </Typography>}
              {vehicle?.state && <Typography variant="body2">
                État : <b>{getVehicleStateLabel(vehicle?.state)}</b>
              </Typography>}
              {vehicle?.critAirVignette && <Typography variant="body2">
                Vignette Crit'Air : <b>{getCritAirVignetteLabel(vehicle?.critAirVignette)}</b>
              </Typography>}
            </Box>
          </Box>
        </Paper>
      </Grid>
      {/* Autres informations de l'employé */}
      <Grid item xs={12} sm={8}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Informations supplémentaires
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">Réference: {number}</Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              Ajouté le: {getFormatDateTime(createdAt)}
            </Typography>
            <Typography variant="body1">
              Dernière modification: {getFormatDateTime(updatedAt)}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {description ? description : "Aucune description pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Observation
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              {observation ? observation : "Aucune observation pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2 }}>
          <VehicleTabs vehicle={vehicle}/>
        </Paper>
      </Grid>
    </Grid>
  );
};
