import React from 'react';
import { Menu, MenuItem, Checkbox, FormControlLabel, IconButton, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function TableFilterButton(props) {
    const {  onFilterChange, headCells  } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [selectedColumns, setSelectedColumns] = React.useState(
      headCells.filter(c => c?.isDefault).map((column) => column.id) // Tous les colonnes sélectionnées par défaut
    );
  
    // Fonction pour gérer la sélection/déselection des colonnes
    const handleColumnToggle = (columnId) => {
      setSelectedColumns((prevSelected) =>
        {
          let currentColumns = prevSelected.includes(columnId)
          ? prevSelected.filter((id) => id !== columnId) // Si déjà sélectionné, retirer
          : [...prevSelected, columnId] // Sinon, ajouter
          onFilterChange(currentColumns)
          return currentColumns
        }
      );
    }

  return (
    <>
        <Tooltip title="Filtre">
            <IconButton 
                aria-label="filter"
                id="long-button"
                onClick={handleClick}>
            <FilterListIcon />
            </IconButton>
        </Tooltip>
        <Menu
            id="long-menu"
            MenuListProps={{
                'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            // Positionnement pour le menu
            anchorOrigin={{
                vertical: 'bottom',    // Positionner sous le bouton
                horizontal: 'left',    // Aligné à gauche du bouton
            }}
            transformOrigin={{
                vertical: 'top',       // L'ancre de transformation commence en haut
                horizontal: 'left',    // Aligné à gauche
            }}
            slotProps={{
                paper: {
                style: {
                    minHeight: 40,
                    width: '30ch',
                },
                },
            }}
            >
            {headCells.filter(c=>c?.id !== 'action').map((column, index) => (
            <MenuItem key={index} selected={selectedColumns.includes(column.id)}>
                <FormControlLabel
                key={index}
                control={
                    <Checkbox
                    checked={selectedColumns.includes(column.id)}
                    onChange={() => handleColumnToggle(column.id)}
                    />
                }
                label={column.label}
                />
            </MenuItem>
            ))}
        </Menu>
    </>
  );
}
