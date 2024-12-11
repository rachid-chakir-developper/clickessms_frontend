import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography, Divider, Chip, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { VEHICLE_TECH_INSPECTION_RECAP } from '../../../../_shared/graphql/queries/VehicleTechnicalInspectionQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDate, getFormatDateTime, getTechnicalInspectionLabel } from '../../../../_shared/tools/functions';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import { Check, Edit } from '@mui/icons-material';
import VehicleItemCard from '../vehicles/VehicleItemCard';
import PartnerItemCard from '../../partnerships/partners/PartnerItemCard';
import { INSPECTION_FAILURE_TYPES } from '../../../../_shared/tools/constants';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function VehicleTechnicalInspectionDetails() {
  let { idVehicleTechnicalInspection } = useParams();
  const [
    getVehicleTechnicalInspection,
    {
      loading: loadingVehicleTechnicalInspection,
      data: vehicleTechnicalInspectionData,
      error: vehicleTechnicalInspectionError,
    },
  ] = useLazyQuery(VEHICLE_TECH_INSPECTION_RECAP);
  React.useEffect(() => {
    if (idVehicleTechnicalInspection) {
      getVehicleTechnicalInspection({ variables: { id: idVehicleTechnicalInspection } });
    }
  }, [idVehicleTechnicalInspection]);

  if (loadingVehicleTechnicalInspection) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
        <Link
          to={`/online/parc-automobile/controles-techniques/modifier/${vehicleTechnicalInspectionData?.vehicleTechnicalInspection?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <VehicleTechnicalInspectionMiniInfos
              vehicleTechnicalInspection={vehicleTechnicalInspectionData?.vehicleTechnicalInspection}
            />
          </Grid>
          <Grid item xs={5}>
            <VehicleTechnicalInspectionOtherInfos
              vehicleTechnicalInspection={vehicleTechnicalInspectionData?.vehicleTechnicalInspection}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Procès verbal
              </Typography>
              {vehicleTechnicalInspectionData?.vehicleTechnicalInspection?.document && <Button variant="text" size="small" sx={{textTransform: 'capitalize'}}
              onClick={() => {
                window.open(vehicleTechnicalInspectionData?.vehicleTechnicalInspection?.document);
              }}>
              Voir le document
            </Button>}
              <Typography gutterBottom variant="subtitle1" component="div">
                {vehicleTechnicalInspectionData?.vehicleTechnicalInspection?.report}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginY: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subtitle3" component="h3">
              Les défaillances
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Failures title={'Les défaillances mineurs'} 
              failures={vehicleTechnicalInspectionData?.vehicleTechnicalInspection?.failures?.filter((f)=> f?.failureType === INSPECTION_FAILURE_TYPES.MINOR)} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Failures title={'Les défaillances majeurs'} 
              failures={vehicleTechnicalInspectionData?.vehicleTechnicalInspection?.failures?.filter((f)=> f?.failureType === INSPECTION_FAILURE_TYPES.MAJOR)} />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Failures title={'Les défaillances critiques'} 
              failures={vehicleTechnicalInspectionData?.vehicleTechnicalInspection?.failures?.filter((f)=> f?.failureType ===INSPECTION_FAILURE_TYPES.CRITICAL)} />
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

function VehicleTechnicalInspectionMiniInfos({ vehicleTechnicalInspection }) {
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
                  Réference : <b>{vehicleTechnicalInspection?.number}</b>
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {vehicleTechnicalInspection?.title}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Crée le: </b>{' '}
                  {`${getFormatDateTime(vehicleTechnicalInspection?.createdAt)}`} <br />
                  <b>Dernière modification: </b>
                  {`${getFormatDateTime(vehicleTechnicalInspection?.updatedAt)}`}
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  <b>Date et heure de contrôle: </b>
                  {`${getFormatDateTime(vehicleTechnicalInspection?.inspectionDateTime)}`}<br />
                  <b>Date et heure de prochain contrôle: </b>
                  {`${getFormatDate(vehicleTechnicalInspection?.nextInspectionDate)}`}
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
        <Chip label={`${getTechnicalInspectionLabel(vehicleTechnicalInspection?.state)}`} />
      </Paper>
    </>
  );
}

function VehicleTechnicalInspectionOtherInfos({ vehicleTechnicalInspection }) {
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
        <VehicleItemCard vehicle={vehicleTechnicalInspection?.vehicle} />
      </Paper>
    </>
  );
}

function Failures({ title="Les défaillance", failures= [] }) {
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
      
      <Paper sx={{ padding: 1, marginY:1 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {failures.length > 0 && (<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {failures?.map((failure, index) => (
              <Box sx={{background: index%2 === 0 ?  "#f5f5f5" : "#ffffff", padding:1}}>
              <ListItem
                alignItems="flex-start"
                key={index}
              >
                <ListItemIcon>
                  <Check />
                </ListItemIcon>
                <ListItemText
                  primary={failure?.description}
                />
              </ListItem>
            </Box>
            ))}
          </List>)}
      </Paper>
    </Paper>
  );
}