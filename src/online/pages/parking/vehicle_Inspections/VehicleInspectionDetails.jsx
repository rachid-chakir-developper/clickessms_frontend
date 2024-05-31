import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Button } from '@mui/material';

import { VEHICLE_INSPECTION_RECAP } from '../../../../_shared/graphql/queries/VehicleInspectionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import { Edit } from '@mui/icons-material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
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
          to={`/online/parc-automobile/controles-menssuels/modifier/${vehicleInspectionData?.vehicleInspection?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <VehicleInspectionMiniInfos
              vehicleInspection={vehicleInspectionData?.vehicleInspection}
            />
          </Grid>
          <Grid item xs={5}>
            <VehicleInspectionOtherInfos
              vehicleInspection={vehicleInspectionData?.vehicleInspection}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Commentaire
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {vehicleInspectionData?.vehicleInspection?.comment}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {vehicleInspectionData?.vehicleInspection?.observation}
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
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
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
                  <b>Date début prévue: </b>{' '}
                  {`${getFormatDateTime(vehicleInspection?.startingDateTime)}`}{' '}
                  <br />
                  <b>Date fin prévue: </b>{' '}
                  {`${getFormatDateTime(vehicleInspection?.endingDateTime)}`}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          margin: 'auto',
          marginTop: 2,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Typography gutterBottom variant="subtitle3" component="h3">
          Motif
        </Typography>
        {vehicleInspection?.reasons?.map((reason, index) => (
          <Chip
            color="info"
            key={index}
            label={reason?.name}
            sx={{ marginRight: 1 }}
          />
        ))}
        <Chip label={vehicleInspection?.otherReasons} />
      </Paper>
    </>
  );
}

function VehicleInspectionOtherInfos({ vehicleInspection }) {
  return (
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
        Les Employés
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {vehicleInspection?.employees?.map((employee, index) => (
          <Grid xs={12} sm={12} md={12} key={index}>
            <Item>
              <EmployeeItemCard employee={employee?.employee} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
