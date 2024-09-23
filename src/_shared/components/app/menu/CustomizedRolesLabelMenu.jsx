import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { ArrowDropDown, Done, Person, AddCircleOutline } from '@mui/icons-material';
import { Chip, Menu, MenuItem, Box, CircularProgress, Typography } from '@mui/material';

// Custom styled menu component
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

// Options with icons for each roles
const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Administrateur', icon: <Person />, color: 'default'},
  { value: 'ADMIN', label: 'Administrateur', icon: <Person />, color: 'default'},
  { value: 'MANAGER', label: 'Manager', icon: <Person />, color: 'default'},
  { value: 'SCE_MANAGER', label: 'Responsable CSE', icon: <Person />, color: 'default'},
  { value: 'QUALITY_MANAGER', label: 'Responsable Qualité', icon: <Person />, color: 'default'},
  { value: 'ACTIVITY_MANAGER', label: 'Responsable Activité', icon: <Person />, color: 'default'},
  { value: 'ADMINISTRATIVE_MANAGER', label: 'Responsable Administratif', icon: <Person />, color: 'default'},
  { value: 'HR_MANAGER', label: 'Responsable RH', icon: <Person />, color: 'default'},
  { value: 'FINANCE_MANAGER', label: 'Responsable Finance', icon: <Person />, color: 'default'},
  { value: 'FACILITY_MANAGER', label: 'Responsable Services Généraux', icon: <Person />, color: 'default'},
  { value: 'EMPLOYEE', label: 'Employé', icon: <Person />, color: 'default'},
  { value: 'MECHANIC', label: 'Garagiste', icon: <Person />, color: 'default'}, 
];

export default function CustomizedRolesLabelMenu({roles, loading=false, onChange}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [options, setOptions] = useState(ROLES);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    setAnchorEl(null);
    if(option && option.value) {
      const newRoles = roles.includes(option.value)
        ? roles.filter(r => r !== option.value)
        : [...roles, option.value];
      onChange(newRoles);
    }
  };

  const handleDelete = (event) => {
    handleClick(event);
  };

  const getRolesLabel = () => {
    return roles.map(role => options.find(s => s.value === role)?.label).join(' / ') || 'choisissez un rôle';
  };

  const getRolesIcons = () => {
    return roles.map(role => options.find(s => s.value === role)?.icon);
  };

  return (
    <Box>
      <Chip
        icon={loading ? <CircularProgress size={20} /> : <AddCircleOutline />}
        label={getRolesLabel()}
        onClick={handleClick}
        onDelete={handleDelete}
        deleteIcon={<ArrowDropDown />}
        color="default"
        sx={{ marginBottom: 1, flexWrap: 'wrap' }}
      />
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-chip',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleClose(option)}
            selected={roles.includes(option.value)}
          >
            {option.icon}
            <Typography variant="inherit">
              {option.label}
            </Typography>
            {roles.includes(option.value) && <Done sx={{ marginLeft: 3 }} />}
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
}
