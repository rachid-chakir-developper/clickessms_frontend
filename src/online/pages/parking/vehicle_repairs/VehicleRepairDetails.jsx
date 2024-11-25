import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { VEHICLE_REPAIR_RECAP } from '../../../../_shared/graphql/queries/VehicleRepairQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime, getRepairStateLabel } from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import { Check, Edit } from '@mui/icons-material';
import VehicleItemCard from '../vehicles/VehicleItemCard';
import PartnerItemCard from '../../partnerships/partners/PartnerItemCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function VehicleRepairDetails() {
  let { idVehicleRepair } = useParams();
  const [
    getVehicleRepair,
    {
      loading: loadingVehicleRepair,
      data: vehicleRepairData,
      error: vehicleRepairError,
    },
  ] = useLazyQuery(VEHICLE_REPAIR_RECAP);
  React.useEffect(() => {
    if (idVehicleRepair) {
      getVehicleRepair({ variables: { id: idVehicleRepair } });
    }
  }, [idVehicleRepair]);

  if (loadingVehicleRepair) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
        <Link
          to={`/online/parc-automobile/reparations/modifier/${vehicleRepairData?.vehicleRepair?.id}`}
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
            <VehicleRepairMiniInfos
              vehicleRepair={vehicleRepairData?.vehicleRepair}
            />
          </Grid>
          <Grid item xs={5}>
            <VehicleRepairOtherInfos
              vehicleRepair={vehicleRepairData?.vehicleRepair}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Compte-rendu
              </Typography>
              {vehicleRepairData?.vehicleRepair?.document && <Button variant="text" size="small" sx={{textTransform: 'capitalize'}}
              onClick={() => {
                window.open(vehicleRepairData?.vehicleRepair?.document);
              }}>
              Voir le document
            </Button>}
              <Typography gutterBottom variant="subtitle1" component="div">
                {vehicleRepairData?.vehicleRepair?.report}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
              Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {vehicleRepairData?.vehicleRepair?.dscription}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {vehicleRepairData?.vehicleRepair?.observation}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Repairs vehicleRepair={vehicleRepairData?.vehicleRepair} />
          </Grid>
          <Grid item xs={6}>
            <VigilantPoints vehicleRepair={vehicleRepairData?.vehicleRepair} />
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
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

function VehicleRepairMiniInfos({ vehicleRepair }) {
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
                  Réference : <b>{vehicleRepair?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {vehicleRepair?.title}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Crée le: </b>{' '}
                  {`${getFormatDateTime(vehicleRepair?.createdAt)}`} <br />
                  <b>Dernière modification: </b>
                  {`${getFormatDateTime(vehicleRepair?.updatedAt)}`}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Date et heure de réparation: </b>
                  {`${getFormatDateTime(vehicleRepair?.repairDateTime)}`}
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
          État
        </Typography>
        <Chip label={`${getRepairStateLabel(vehicleRepair?.state)}`} />
      </Paper>
    </>
  );
}

function VehicleRepairOtherInfos({ vehicleRepair }) {
  return (
    <>
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
        <VehicleItemCard vehicle={vehicleRepair?.vehicle} />
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          margin: 'auto',
          marginY: 3,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Typography gutterBottom variant="subtitle3" component="h3">
          Le garage partenaire
        </Typography>
        <PartnerItemCard partner={vehicleRepair?.garagePartner} />
      </Paper>
    </>
  );
}

function Repairs({ vehicleRepair }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {vehicleRepair?.repairs.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les réparations menées
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {vehicleRepair?.repairs?.map((repair, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText
                      primary={repair?.description}
                    />
                  </ListItem>
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}

function VigilantPoints({ vehicleRepair }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#f1f1f1',
      }}
    >
      {vehicleRepair?.vigilantPoints.length > 0 && (
          <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
            <Typography variant="h6" gutterBottom>
              Les points de vigilance
            </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {vehicleRepair?.vigilantPoints?.map((vigilantPoint, index) => (
                  <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
                  <ListItem
                    alignItems="flex-start"
                    key={index}
                  >
                    <ListItemIcon>
                      <Check />
                    </ListItemIcon>
                    <ListItemText
                      primary={vigilantPoint?.description}
                    />
                  </ListItem>
                </Box>
                ))}
              </List>
          </Paper>
      )}
    </Paper>
  );
}