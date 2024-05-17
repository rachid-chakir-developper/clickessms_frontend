import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Close, Construction, Event, EventBusy, EventNote } from '@mui/icons-material';

const actions = [
  { icon: <Construction />, name: 'Demander une intervention' },
  { icon: <Event />, name: 'Déclarer un événement' },
  { icon: <EventNote />, name: 'Déclarer un événement indésirable' },
  { icon: <EventBusy />, name: 'Déclarer une absence' },
];

export default function SpeedDialTooltipOpen() {
  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 36, background: 'yellow' }}>
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
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
