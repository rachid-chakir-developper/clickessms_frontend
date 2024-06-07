import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ArrowDropDown, CheckCircleOutline, Done, Face, HourglassEmpty, Pending, TaskAlt } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

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

// Options with icons for each status
const STATUS = [
    { value: 'NEW', label: 'En cours de traitement', icon: <Pending /> },
    { value: 'PENDING', label: 'En attente', icon: <HourglassEmpty /> },
    { value: 'VALIDATED', label: 'Validé', icon: <CheckCircleOutline /> },
    { value: 'COMPLETED', label: 'Traité', icon: <TaskAlt /> },
  ];

export default function CustomizedStatusLabelMenu({status}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = (event) => {
    handleClick(event)
  };
  const getStatusLabel = (status) => {
    return STATUS?.find((s) => s.value == status)?.label;
  };
  const getStatusIcon = (status) => {
    return STATUS?.find((s) => s.value == status)?.icon;
  };
  
  return (
    <Box>
      <Chip
        icon={getStatusIcon(status)}
        label={getStatusLabel(status)}
        onClick={handleClick}
        onDelete={handleDelete}
        deleteIcon={<ArrowDropDown />}
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
        {STATUS.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleClose(option)}
            selected={status === option.value}
          >
            {status === option.value ? <Done /> : option.icon}
            <Typography variant="inherit">
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
}