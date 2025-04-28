import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import {  ArrowDropDown, Cancel, Done, HourglassEmpty, HourglassFull, HourglassTop, Pending, TaskAlt } from '@mui/icons-material';
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

// MenuOptions with icons for each status
const STATUS = [
    { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: "IN_PROGRESS", label: "En cours de traitement", icon: <Pending />, color: 'info'},
    { value: "DONE", label: "Traité", icon: <TaskAlt />, color: 'success'},
  ];

  // MenuOptions with icons for each status
  const EI_STATUS = [
      { value: 'NEW', label: 'Déclaré', icon: <HourglassEmpty />, color: 'default'},
      { value: "IN_PROGRESS", label: "En cours de traitement", icon: <Pending />, color: 'info'},
      { value: "DONE", label: "Traité", icon: <TaskAlt />, color: 'success'},
    ];
  // MenuOptions with icons for each status
  const TICKET_STATUS = [
      { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
      { value: "IN_PROGRESS", label: "En cours de traitement", icon: <Pending />, color: 'info'},
      { value: "COMPLETED", label: "Terminée", icon: <TaskAlt />, color: 'success'},
    ];

  // MenuOptions with icons for each status
  const ABSENCE_STATUS = [
    { value: 'PENDING', label: 'En Attente', icon: <Pending />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success'},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
  ];
  
    // MenuOptions with icons for each status
  const TASK_STATUS = [
    { value: 'NEW', label: 'Nouveau', icon: <HourglassEmpty />, color: 'default'},
    { value: 'PENDING', label: 'En attente', icon: <HourglassTop />, color: 'default'},
    { value: "APPROVED", label: "Approuvé", icon: <Done />, color: 'success'},
    { value: "REJECTED", label: "Rejeté", icon: <Cancel />, color: 'warning'},
    { value: "TO_DO", label: "À faire", icon: <HourglassFull />, color: 'default'},
    { value: "IN_PROGRESS", label: "En cours", icon: <Pending />, color: 'info'},
    { value: "COMPLETED", label: "Terminée", icon: <TaskAlt />, color: 'success'},
  ];

  // MenuOptions with icons for each status
  const ACTION_STATUS = [
    { value: "TO_DO", label: "À traiter", icon: <HourglassEmpty />, color: 'default'},
    { value: "IN_PROGRESS", label: "En cours", icon: <Pending />, color: 'info'},
    { value: "DONE", label: "Traité", icon: <TaskAlt />, color: 'success'},
  ];

export default function CustomizedStatusLabelMenu({status, type=null, loading=false, onChange, disabled, options=null}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOptions, setMenuOptions] = React.useState(STATUS);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (menuOption) => {
    setAnchorEl(null);
    if(menuOption && menuOption?.value && !disabled) onChange(menuOption?.value)
  };
  const handleDelete = (event) => {
    handleClick(event)
  };
  const getStatusLabel = (status) => {
    return menuOptions?.find((s) => s.value == status)?.label;
  };
  const getStatusIcon = (status) => {
    return menuOptions?.find((s) => s.value == status)?.icon;
  };
  const getStatusColor = (status) => {
    return menuOptions?.find((s) => s.value == status)?.color;
  };
  React.useEffect(()=>{
    if(options){
      setMenuOptions(options)
    }else{
      switch (type) {
        case 'undesirableEvent':
          setMenuOptions(EI_STATUS)
          break;
        case 'task':
          setMenuOptions(TASK_STATUS)
          break;
        case 'action':
          setMenuOptions(ACTION_STATUS)
          break;
        case 'ticket':
          setMenuOptions(TICKET_STATUS)
          break;
        case 'absence':
          setMenuOptions(ABSENCE_STATUS)
          break;
      
        default:
          setMenuOptions(STATUS)
          break;
      }
    }
  }, [type, options])
  return (<>
    {!disabled ? <Box>
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
        {menuOptions?.filter((o)=> !o?.hidden)?.map((menuOption, index) => (
          <MenuItem
            key={index}
            onClick={() => handleClose(menuOption)}
            selected={status === menuOption.value}
          >
            {menuOption.icon}
            <Typography variant="inherit">
              {menuOption.label}
            </Typography>
            {status === menuOption.value && <Done sx={{marginLeft: 3}} />}
          </MenuItem>
        ))}
      </StyledMenu>
    </Box> :
    <Box>
      <Chip
        label={getStatusLabel(status)}
        color={getStatusColor(status)}
      />
    </Box>
  }
  </>
  );
}