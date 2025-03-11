import React from 'react';
import PropTypes from 'prop-types';
import { 
  Toolbar, 
  Typography, 
  Tooltip, 
  IconButton, 
  Box,
  Divider,
  Collapse
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Composant TableToolbar qui affiche une barre d'outils pour les tableaux
 * avec un titre, des boutons d'action et un composant de filtre optionnel
 */
export default function TableToolbar({ 
  title, 
  filterComponent,
  refreshAction,
  children,
  numSelected = 0
}) {
  const [showFilter, setShowFilter] = React.useState(false);

  return (
    <Box>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {filterComponent && (
            <Tooltip title="Filtrer la liste">
              <IconButton onClick={() => setShowFilter(!showFilter)}>
                <FilterListIcon color={showFilter ? "primary" : "default"} />
              </IconButton>
            </Tooltip>
          )}
          
          {refreshAction && (
            <Tooltip title="Rafraîchir">
              <IconButton onClick={refreshAction}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {children}
        </Box>
      </Toolbar>
      
      {filterComponent && (
        <Collapse in={showFilter}>
          <Divider />
          <Box sx={{ p: 2 }}>
            {filterComponent}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

TableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  filterComponent: PropTypes.node,
  refreshAction: PropTypes.func,
  children: PropTypes.node,
  numSelected: PropTypes.number
}; 