import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BeneficiaryAdmissionDocuments from './BeneficiaryAdmissionDocuments';
import BeneficiaryEntries from './BeneficiaryEntries';
import BeneficiaryAbsences from './BeneficiaryAbsences';
import BeneficiaryTransmissionEvents from './BeneficiaryTransmissionEvents';
import BeneficiaryUndesirableEvents from './BeneficiaryUndesirableEvents';
import { Stack } from '@mui/material';

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
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
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

export default function BeneficiaryTabs({beneficiary}) {
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
                <LinkTab label="Absences" href="/spam" />
                <LinkTab label="Evénements / Transmissions" href="/spam" />
                <LinkTab label="Evénements indésirables" href="/spam" />
                <LinkTab label="Admissions" href="/drafts" />
                <LinkTab label="Entrées / sorties" href="/trash" />
                <LinkTab label="Projets personnalisés (PPA)" href="/trash" />
            </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <BeneficiaryAbsences beneficiary={beneficiary} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <BeneficiaryTransmissionEvents beneficiary={beneficiary} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <BeneficiaryUndesirableEvents beneficiary={beneficiary} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
            <BeneficiaryAdmissionDocuments beneficiaryAdmissionDocuments={beneficiary?.beneficiaryAdmissionDocuments} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
            <BeneficiaryEntries beneficiaryEntries={beneficiary?.beneficiaryEntries} />
        </CustomTabPanel>
    </Box>
  );
}
