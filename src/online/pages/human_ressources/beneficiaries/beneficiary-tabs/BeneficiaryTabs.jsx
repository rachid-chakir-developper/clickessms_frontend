import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import BeneficiaryAdmissionDocuments from './BeneficiaryAdmissionDocuments';
import BeneficiaryEntries from './BeneficiaryEntries';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
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

export default function BeneficiaryTabs() {
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
                <LinkTab label="Document(s) d’admission(s)" href="/drafts" />
                <LinkTab label="Les entrées / sorties" href="/trash" />
                <LinkTab label="Abscences" href="/spam" />
                <LinkTab label="Evénements / Transmissions" href="/spam" />
                <LinkTab label="Evénements indésirables" href="/spam" />
            </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
            <BeneficiaryAdmissionDocuments />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            <BeneficiaryEntries />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
            Abscences
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
            Evénements / Transmissions
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
            Evénements indésirables
        </CustomTabPanel>
    </Box>
  );
}
