import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import VehicleEstablishments from './VehicleEstablishments';
import VehicleEmployees from './VehicleEmployees';
import VehicleOwnerships from './VehicleOwnerships';
import VehicleInspections from './VehicleInspections';
import { Stack } from '@mui/material';
import VehicleTechnicalInspections from './VehicleTechnicalInspections';
import VehicleRepairs from './VehicleRepairs';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Box
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Stack>{children}</Stack>
          </Box>
        )}
      </Box>
    );
  }
  

function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      sx={{textTransform: 'capitalize'}}
      onClick={(event) => {
        // Routing libraries handle this, you can remove the onClick handle when using them.
        if (samePageLinkNavigation(event)) {
          event.preventDefault();
        }
      }}
      aria-current={props.selected && 'page'}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

export default function VehicleTabs({vehicle}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== 'click' ||
      (event.type === 'click' && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="nav tabs example"
                role="navigation"
            >
                <LinkTab label="Contrôles mensuels" href="/spam" />
                <LinkTab label="Carnet d'entretien (réparations)" href="/spam" />
                <LinkTab label="Contrôles techniques" href="/spam" />
                <LinkTab label="Structures rattachées" href="/spam" />
                <LinkTab label="Employés" href="/spam" />
                <LinkTab label="Statut de détention" href="/spam" />
            </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
            <VehicleInspections vehicle={vehicle} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            <VehicleRepairs vehicle={vehicle} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
            <VehicleTechnicalInspections vehicle={vehicle} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
            <VehicleEstablishments vehicleEstablishments={vehicle?.vehicleEstablishments} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
            <VehicleEmployees vehicleEmployees={vehicle?.vehicleEmployees} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
            <VehicleOwnerships vehicleOwnerships={vehicle?.vehicleOwnerships} />
        </CustomTabPanel>
    </Box>
  );
}
