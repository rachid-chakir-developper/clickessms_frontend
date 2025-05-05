import * as React from 'react';
import {
  Chip,
  Avatar,
  Popover,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip
} from '@mui/material';

export default function ChipBeneficiaryGroupWithPopover({ people = [], countEntries = undefined }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const displayedPeople = countEntries !== undefined ? people : people.slice(0, 2);
  const remainingCount = countEntries !== undefined ? people.length : people.length - 2;

  return (
    <Box sx={countEntries !== undefined ? {} : { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      {countEntries !== undefined ? (<Tooltip title="Cliquez pour voir la liste">
        <Chip
          label={countEntries}
          onClick={handleOpenPopover}
          variant="outlined"
          sx={{ cursor: 'pointer' }}
        /></Tooltip>
      ) : (
        <>
          {displayedPeople.map((person, index) => (
            <Chip
              key={index}
              avatar={
                <Avatar
                  alt={`${person?.firstName} ${person?.preferredName || person?.lastName}`}
                  src={person?.photo || undefined}
                />
              }
              label={`${person?.firstName} ${person?.preferredName || person?.lastName}`}
              variant="outlined"
            />
          ))}
          {remainingCount > 0 && (
            <Chip
              label={`+${remainingCount}`}
              onClick={handleOpenPopover}
              sx={{ cursor: 'pointer' }}
              variant="outlined"
            />
          )}
        </>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableRestoreFocus
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Liste des personnes accompagnées
          </Typography>
          <List>
            {people.map((person, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar
                    src={person?.photo || undefined}
                    alt={`${person?.firstName} ${person?.preferredName || person?.lastName}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${person?.firstName} ${person?.preferredName || person?.lastName}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </Box>
  );
}
