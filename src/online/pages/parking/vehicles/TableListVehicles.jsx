import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import styled from '@emotion/styled';
import {
  Article,
  Delete,
  Done,
  Edit,
  Folder,
  MoreVert,
} from '@mui/icons-material';
import { Alert, Avatar, Chip, FormControlLabel, FormGroup, Menu, MenuItem, Popover, Stack } from '@mui/material';
import AppLabel from '../../../../_shared/components/app/label/AppLabel';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import ExportButtonIcon from '../../../_shared/components/data_tools/export/ExportButtonIcon';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import { render } from 'react-dom';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import { getCritAirVignetteLabel, getVehicleStateLabel } from '../../../../_shared/tools/functions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: alpha(
      theme.palette.secondary.main,
      theme.palette.action.activatedOpacity,
    ),
    color: theme.palette.secondary.contrastText,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: selected
      ? alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
      : theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
      id: 'name',
      property: 'name',
      exportField: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Nom',
    },
    {
        id: 'registrationNumber',
        property: 'registration_number',
        exportField: 'registration_number',
        numeric: false,
        disablePadding: false,
        label: 'Matricule',
    },
    {
        id: 'vehicleBrand',
        property: 'vehicle_brand__name',
        exportField: 'vehicle_brand__name',
        numeric: false,
        disablePadding: false,
        label: 'Marque',
        render: (data) => data?.name,
    },
    {
        id: 'vehicleModel',
        property: 'vehicle_model__name',
        exportField: 'vehicle_model__name',
        numeric: false,
        disablePadding: false,
        label: 'Modèle',
        render: (data) => data?.name,
    },
    {
        id: 'vehicleEstablishments',
        property: 'vehicle_establishments__establishments__name',
        exportField: ['vehicle_establishments__establishments__name'],
        numeric: false,
        disablePadding: false,
        sortDisabled: true,
        label: 'Structures actuelles',
        render: (data) => data && data.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
        {data[data?.length - 1]?.establishments?.map((establishment, index) => {
          return (
            <EstablishmentChip
              key={index}
              establishment={establishment}
            />
          );
        })}
      </Stack>
    },
    {
        id: 'vehicleEmployees',
        property: 'vehicle_employees__employees__first_name',
        exportField: ['vehicle_employees__employees__first_name', 'vehicle_employees__employees__last_name'],
        numeric: false,
        disablePadding: false,
        sortDisabled: true,
        label: 'Employées actuels',
        render: (data) => data && data.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
        {data[data?.length - 1]?.employees?.map((employee, index) => {
          return (
            <EmployeeChip
              key={index}
              employee={employee}
            />
          );
        })}
      </Stack>
    },
    {
        id: 'state',
        property: 'state',
        exportField: 'state',
        numeric: false,
        disablePadding: false,
        label: 'Etats',
        render: (data) => getVehicleStateLabel(data),
    },
    {
        id: 'critAirVignette',
        property: 'crit_air_vignette',
        exportField: 'crit_air_vignette',
        numeric: false,
        disablePadding: false,
        label: 'Vignette Crit’Air',
        render: (data) => getCritAirVignetteLabel(data),
    },
    {
        id: 'vehicleOwnerships',
        property: 'vehicle_ownerships__ownership_type',
        exportField: ['vehicle_ownerships__ownership_type'],
        numeric: false,
        disablePadding: false,
        sortDisabled: true,
        label: 'Status de détention',
        render: (data) => data && data?.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
                  <Chip
                    label={data[data?.length - 1]?.ownershipType}
                    variant="outlined"
                  />
            </Stack>,
    },
    {
        id: 'description',
        property: 'description',
        exportField: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Description',
    },
    {
        id: 'observation',
        property: 'observation',
        exportField: 'observation',
        numeric: false,
        disablePadding: false,
        label: 'Observation',
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        label: 'Actions',
    },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    selectedColumns = []
  } = props;
  const createSortHandler = (property, sortDisabled=false) => (event) => {
    if(!sortDisabled) onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </StyledTableCell>
        {selectedColumns.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon={headCell.sortDisabled}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.property, headCell?.sortDisabled)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, onFilterChange } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [selectedColumns, setSelectedColumns] = React.useState(
    headCells.map((column) => column.id) // Tous les colonnes sélectionnées par défaut
  );

  // Fonction pour gérer la sélection/déselection des colonnes
  const handleColumnToggle = (columnId) => {
    setSelectedColumns((prevSelected) =>
      {
        let currentColumns = prevSelected.includes(columnId)
        ? prevSelected.filter((id) => id !== columnId) // Si déjà sélectionné, retirer
        : [...prevSelected, columnId] // Sinon, ajouter
        onFilterChange(headCells?.filter(c=> currentColumns?.includes(c.id)))
        return currentColumns
      }
    );
    
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected === 1
            ? 'un élément séléctionné'
            : `${numSelected} éléments séléctionnés`}
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Les véhicules
        </Typography>
      )}
      <ExportButtonIcon 
        entity={'Vehicle'} 
        fields={headCells?.filter(c=> selectedColumns?.includes(c.id) && c.exportField).map(c=>c?.exportField)}
        titles={headCells?.filter(c=> selectedColumns?.includes(c.id) && c.exportField).map(c=>c?.label)} />
      {numSelected > 0 ? (
        <Tooltip title="Traité">
          <IconButton>
            <Done />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filtre">
          <IconButton 
              aria-label="filter"
              id="long-button"
              onClick={handleClick}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
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
    </Toolbar>
  );
}

export default function TableListVehicles({
  loading,
  rows,
  onDeleteVehicle,
  onFilterChange,
}) {
  const navigate = useNavigate();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const { setDialogListLibrary } = useFeedBacks();
  const onOpenDialogListLibrary = (folderParent) => {
    setDialogListLibrary({
      isOpen: true,
      folderParent,
      onClose: () => {
        setDialogListLibrary({ isOpen: false });
      },
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    onFilterChange({orderBy: `${isAsc ? '-' : ''}${property}`})
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows?.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;
  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [rows, order, orderBy, page, rowsPerPage],
  );

  const [anchorElList, setAnchorElList] = React.useState([]);
  const [selectedColumns, setSelectedColumns] = React.useState(headCells);
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} onFilterChange={(selectedColumns)=>setSelectedColumns(selectedColumns)}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              selectedColumns={selectedColumns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length}
            />
            <TableBody>
              {loading && (
                <StyledTableRow>
                  <StyledTableCell colSpan={headCells.length + 1}>
                    <ProgressService type="text" />
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {rows?.length < 1 && !loading && (
                <StyledTableRow>
                  <StyledTableCell colSpan={headCells.length + 1}>
                    <Alert severity="warning">
                      Aucun véhicule trouvé.
                    </Alert>
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {visibleRows?.map((row, index) => {
                if (!anchorElList[index]) {
                  anchorElList[index] = null;
                }

                const handleOpenMenu = (event) => {
                  // Utilisez l'index de la ligne pour mettre à jour l'état d'ancrage correspondant
                  const newAnchorElList = [...anchorElList];
                  newAnchorElList[index] = event.currentTarget;
                  setAnchorElList(newAnchorElList);
                };

                const handleCloseMenu = () => {
                  // Réinitialisez l'état d'ancrage de la ligne correspondante à null
                  const newAnchorElList = [...anchorElList];
                  newAnchorElList[index] = null;
                  setAnchorElList(newAnchorElList);
                };

                const open = Boolean(anchorElList[index]);
                const id = open ? `simple-popover-${index}` : undefined;

                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        onClick={(event) => handleClick(event, row.id)}
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </StyledTableCell>
                    {
                      selectedColumns?.filter(c=>c?.id !== 'action')?.map((column, index) => {
                        return <StyledTableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding={column?.disablePadding ? "none" : "normal"}
                          key={index}
                          onClick={()=> navigate(`/online/parc-automobile/vehicules/details/${row?.id}`)}
                        >
                        {column?.render ? column?.render(row[column?.id]) : row[column?.id]}
                        </StyledTableCell>
                      })
                    }
                    <StyledTableCell align="right">
                      <IconButton
                        aria-describedby={id}
                        onClick={handleOpenMenu}
                      >
                        <MoreVert />
                      </IconButton>
                      <Popover
                        open={open}
                        anchorEl={anchorElList[index]}
                        onClose={handleCloseMenu}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <Link
                          to={`/online/parc-automobile/vehicules/details/${row?.id}`}
                          className="no_style"
                        >
                          <MenuItem onClick={handleCloseMenu}>
                            <Article sx={{ mr: 2 }} />
                            Détails
                          </MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            onOpenDialogListLibrary(row?.folder);
                            handleCloseMenu();
                          }}
                        >
                          <Folder sx={{ mr: 2 }} />
                          Bibliothèque
                        </MenuItem>
                        <Link
                          to={`/online/parc-automobile/vehicules/modifier/${row?.id}`}
                          className="no_style"
                        >
                          <MenuItem onClick={handleCloseMenu}>
                            <Edit sx={{ mr: 2 }} />
                            Modifier
                          </MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            onDeleteVehicle(row?.id);
                            handleCloseMenu();
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete sx={{ mr: 2 }} />
                          Supprimer
                        </MenuItem>
                      </Popover>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
              {emptyRows > 0 && (
                <StyledTableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={headCells.length + 1} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
