import * as React from 'react';
import { Chip, Avatar, Popover, Typography, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

export default function ChipGroupWithPopover({ people }) {
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

  const displayedPeople = people.slice(0, 2);  // Affiche seulement les 2 premières personnes
  const remainingCount = people.length - 2;    // Nombre restant de personnes
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
      {/* Affichage des 2 premières personnes sous forme de Chip */}
      {displayedPeople.map((person, index) => (
        <Chip
          key={index}
          avatar={<Avatar alt={`${person?.firstName} ${person?.lastName}`} src={person?.photo} />}
          label={`${person?.firstName} ${person?.lastName}`}
          variant="outlined"
        />
      ))}

      {/* Si plus de 2 personnes, afficher un Chip supplémentaire avec "+X" */}
      {remainingCount > 0 && (
        <Chip
          label={`+${remainingCount}`}
          onClick={handleOpenPopover}
          sx={{ cursor: 'pointer' }}
          variant="outlined"
        />
      )}

      {/* Popover pour afficher la liste complète des personnes */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <List>
            {people.map((person, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar src={person?.photo} alt={`${person?.firstName} ${person?.lastName}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={`${person?.firstName} ${person?.lastName}`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </Box>
  );
}
