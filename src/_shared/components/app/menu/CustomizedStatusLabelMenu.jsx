import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ArrowDropDown, CheckCircleOutline, Done, Face, HourglassEmpty, Pending, TaskAlt } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';

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
    { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: "IN_PROGRESS", label: "En cours de traitement", icon: <Pending />, color: 'info'},
    { value: "DONE", label: "Traité", icon: <TaskAlt />, color: 'success'},
  ];

// Options with icons for each status
const EI_STATUS = [
    { value: 'NEW', label: 'Déclaré', icon: <HourglassEmpty />, color: 'default'},
    { value: "IN_PROGRESS", label: "En cours de traitement", icon: <Pending />, color: 'info'},
    { value: "DONE", label: "Traité", icon: <TaskAlt />, color: 'success'},
  ];
  // Options with icons for each status
  const TICKET_STATUS = [
      { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
      { value: "IN_PROGRESS", label: "En cours de traitement", icon: <Pending />, color: 'info'},
      { value: "COMPLETED", label: "Terminée", icon: <TaskAlt />, color: 'success'},
    ];

  // Options with icons for each status
const ACTION_STATUS = [
  { value: "TO_DO", label: "À traiter", icon: <HourglassEmpty />, color: 'default'},
  { value: "IN_PROGRESS", label: "En cours", icon: <Pending />, color: 'info'},
  { value: "DONE", label: "Traité", icon: <TaskAlt />, color: 'success'},
];

export default function CustomizedStatusLabelMenu({status, type=null, loading=false, onChange}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [options, setOptions] = React.useState(STATUS);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option) => {
    setAnchorEl(null);
    if(option && option?.value) onChange(option?.value)
  };
  const handleDelete = (event) => {
    handleClick(event)
  };
  const getStatusLabel = (status) => {
    return options?.find((s) => s.value == status)?.label;
  };
  const getStatusIcon = (status) => {
    return options?.find((s) => s.value == status)?.icon;
  };
  const getStatusColor = (status) => {
    return options?.find((s) => s.value == status)?.color;
  };
  React.useEffect(()=>{
    switch (type) {
      case 'undesirableEvent':
        setOptions(EI_STATUS)
        break;
      case 'action':
        setOptions(ACTION_STATUS)
        break;
      case 'ticket':
        setOptions(TICKET_STATUS)
        break;
    
      default:
        setOptions(STATUS)
        break;
    }
  }, [type])
  return (
    <Box>
      <Chip
        icon={loading ? <CircularProgress size={20} /> : getStatusIcon(status)}
        label={getStatusLabel(status)}
        onClick={handleClick}
        onDelete={handleDelete}
        deleteIcon={<ArrowDropDown />}
        color={getStatusColor(status)}
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
            selected={status === option.value}
          >
            {option.icon}
            <Typography variant="inherit">
              {option.label}
            </Typography>
            {status === option.value && <Done sx={{marginLeft: 3}} />}
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
}