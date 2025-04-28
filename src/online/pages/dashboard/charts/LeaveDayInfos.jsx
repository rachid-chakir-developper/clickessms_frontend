import React, { useState } from 'react';
import { Box, List, ListItem, ListItemText, Chip, Collapse, IconButton, Typography, Alert } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const LeaveDayInfos = ({ leaveDayInfos }) => {
  const [open, setOpen] = useState(false);
  const [openReported, setOpenReported] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleReportedClick = () => {
    setOpenReported(!openReported);
  };
  // Parse JSON for reportedPaidLeaveDaysPerYear if it's not already an object
  const reportedPaidLeaveDaysPerYear = typeof leaveDayInfos?.reportedPaidLeaveDaysPerYear === 'string'
    ? JSON.parse(leaveDayInfos?.reportedPaidLeaveDaysPerYear)
    : leaveDayInfos?.reportedPaidLeaveDaysPerYear || {};
  return (<Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Compteurs Congés (jours)</Typography>
        <Alert severity="info">Bientôt disponible.</Alert>
      </Box>);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Compteurs Congés (jours)</Typography>
      {leaveDayInfos ? <List>
        <ListItem button onClick={handleClick}>
          <ListItemText primary="CP Restants" />
          <IconButton edge="end" size="small" sx={{ marginRight: 1}}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          <Chip label={leaveDayInfos?.restPaidLeaveDays ?? 0} color="primary" />
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ marginLeft: 2}}>
          <List component="div" disablePadding>
            <ListItem>
              <ListItemText primary="CP Acquis Par Mois" sx={{ fontStyle: 'italic'}} />
              <Chip label={leaveDayInfos?.acquiredPaidLeaveDaysByMonth ?? 0} color="info" />
            </ListItem>
            <ListItem>
              <ListItemText primary="CP Acquis" sx={{ fontStyle: 'italic'}} />
              <Chip label={leaveDayInfos?.acquiredPaidLeaveDays ?? 0} color="info" />
            </ListItem>
            <ListItem>
              <ListItemText primary="CP en Cours d'Acquisition" sx={{ fontStyle: 'italic'}} />
              <Chip label={leaveDayInfos?.beingAcquiredPaidLeaveDays ?? 0} color="info" />
            </ListItem>
            <ListItem button onClick={handleReportedClick}>
              <ListItemText primary="CP Reportés" sx={{ fontStyle: 'italic'}} />
              {leaveDayInfos?.totalReportedPaidLeaveDays && leaveDayInfos?.totalReportedPaidLeaveDays > 0 && <IconButton edge="end" size="small" sx={{ marginRight: 1}}>
                {openReported ? <ExpandLess /> : <ExpandMore />}
              </IconButton>}
              <Chip label={leaveDayInfos?.totalReportedPaidLeaveDays ?? 0} color="info" />
            </ListItem>
            <Collapse in={openReported} timeout="auto" unmountOnExit sx={{ marginLeft: 2}}>
              <List component="div" disablePadding>
                {Object.entries(reportedPaidLeaveDaysPerYear).map(([year, days]) => (
                  <ListItem key={year}>
                    <ListItemText primary={`Année ${year}`} sx={{ fontStyle: 'italic'}}/>
                    <Chip label={days} color="default" />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </List>
        </Collapse>
        <ListItem>
          <ListItemText primary="RTT Restants" />
          <Chip label={leaveDayInfos?.restRwtLeaveDays ?? 0} color="primary" />
        </ListItem>
        <ListItem>
          <ListItemText primary="CT Restants" />
          <Chip label={leaveDayInfos?.restTemporaryLeaveDays ?? 0} color="primary" />
        </ListItem>
      </List>
      :
      <Alert severity="warning">Votre contrat n'est pas encore créée pour pouvoir voir les compteurs congés.</Alert>
      }
    </Box>
  );
};

export default LeaveDayInfos;
