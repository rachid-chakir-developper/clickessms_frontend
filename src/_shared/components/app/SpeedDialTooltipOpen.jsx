import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Close, Construction, Event, EventBusy, EventNote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const actions = [
  { icon: <EventBusy />, name: 'Demander un congé', to: '/online/planning/absences-employes/ajouter?type=LEAVE' },
  { icon: <Construction />, name: 'Demander une intervention', to: '/online/travaux/interventions/ajouter?type=REQUEST' },
  { icon: <EventNote />, name: 'Déclarer un événement indésirable', to: '/online/qualites/evenements-indesirables/ajouter' },
];

export default function SpeedDialTooltipOpen() {
  const navigate = useNavigate();
  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 40, zIndex: 10 }}>
      <SpeedDial
       sx={{ width: 0 }}
        ariaLabel="SpeedDial openIcon example"
        icon={<SpeedDialIcon openIcon={<Close />}  />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={()=> navigate(action.to)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
