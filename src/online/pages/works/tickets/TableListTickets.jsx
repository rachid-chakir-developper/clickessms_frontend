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
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVert,
} from '@mui/icons-material';
import { Alert, Avatar, Chip, Collapse, FormControlLabel, FormGroup, Menu, MenuItem, Popover, Stack, TablePagination } from '@mui/material';
import AppLabel from '../../../../_shared/components/app/label/AppLabel';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TableExportButton from '../../../_shared/components/data_tools/export/TableExportButton';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import { render } from 'react-dom';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import { getCritAirVignetteLabel, getFormatDate, getOwnershipTypeLabel, getPriorityLabel, truncateText } from '../../../../_shared/tools/functions';
import TableFilterButton from '../../../_shared/components/table/TableFilterButton';
import ChipGroupWithPopover from '../../../_shared/components/persons/ChipGroupWithPopover';
import CircularProgressWithLabel from '../../../../_shared/components/feedbacks/CircularProgressWithLabel';
import TicketStatusLabelMenu from './TicketStatusLabelMenu';
import TaskActionStatusLabelMenu from '../actions/TaskActionStatusLabelMenu';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';

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
      id: 'title',
      property: 'title',
      exportField: 'title',
      numeric: false,
      disablePadding: true,
      isDefault: true,
      label: 'Libellé',
    },
    {
        id: 'establishments',
        property: 'establishments__name',
        exportField: ['establishments__name'],
        numeric: false,
        disablePadding: false,
        isDefault: true,
        disableClickDetail: true,
        sortDisabled: true,
        label: 'Structure(s)',
        render: ({establishments}) => establishments && establishments.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
        {establishments?.map((establishment, index) => {
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
        id: 'priority',
        property: 'priority',
        exportField: 'priority',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        label: 'Priorité',
        render: ({priority})=> getPriorityLabel(priority)
    },
    {
        id: 'efcReports__title',
        property: 'efc_reports__title',
        exportField: 'efc_reports__title',
        numeric: false,
        disablePadding: false,
        label: 'Intitulé CREX',
        render: ({efcReports})=> efcReports?.length > 0 && efcReports[0]?.title
    },
    {
        id: 'efcReports__efcDate',
        property: 'efc_reports__efc_date',
        exportField: 'efc_reports__efc_date',
        numeric: false,
        disablePadding: false,
        label: 'Date CREX',
        render: ({efcReports})=> efcReports?.length > 0 && getFormatDate(efcReports[0]?.efcDate)
    },
    {
        id: 'efcReports__employees',
        property: 'efc_reports__employees__first_name',
        exportField: ['efc_reports__employees__first_name', 'efc_reports__employees__last_name'],
        numeric: false,
        disablePadding: false,
        disableClickDetail: true,
        sortDisabled: true,
        label: 'CREX-Participant(s)',
        render: ({efcReports}) => efcReports?.length > 0 && efcReports[0] && efcReports[0]?.employees.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
            <ChipGroupWithPopover people={efcReports[0]?.employees} />
      </Stack>
    },
    {
        id: 'efcReports__declarationDate',
        property: 'efc_reports__declaration_date',
        exportField: 'efc_reports__declaration_date',
        numeric: false,
        disablePadding: false,
        label: 'Date de déclaration aux autorités compétentes',
        render: ({efcReports})=> efcReports?.length > 0 && getFormatDate(efcReports[0]?.declarationDate)
    },
    {
        id: 'description',
        property: 'description',
        exportField: 'description',
        numeric: false,
        disablePadding: false,
        label: 'Analyse',
        render: ({description})=> <Tooltip title={description}>{truncateText(description, 160)}</Tooltip>
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
        id: 'status',
        property: 'status',
        exportField: 'status',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        disableClickDetail: true,
        label: 'Status',
        render: (data)=> <TicketStatusLabelMenu ticket={data} />
    },
    {
        id: 'completionPercentage',
        property: 'completion_percentage',
        exportField: 'completion_percentage',
        numeric: false,
        disablePadding: false,
        disableClickDetail: true,
        isDefault: true,
        label: 'Progression',
        render: ({completionPercentage})=> <CircularProgressWithLabel value={completionPercentage}/>
    },
    {
        id: 'action',
        numeric: true,
        disablePadding: false,
        isDefault: true,
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
  const [selectedColumns, setSelectedColumns] = React.useState(
    headCells.filter(c => c?.isDefault).map((column) => column.id) // Tous les colonnes sélectionnées par défaut
  );

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
         Plan d’amélioration continue de la qualité et de la gestion des risques
        </Typography>
      )}
      <TableExportButton 
        entity={'Ticket'}
        fileName={'Plan-action'}
        fields={headCells?.filter(c=> selectedColumns?.includes(c.id) && c.exportField).map(c=>c?.exportField)}
        titles={headCells?.filter(c=> selectedColumns?.includes(c.id) && c.exportField).map(c=>c?.label)} />
      {numSelected > 0 ? (
        <Tooltip title="Traité">
          <IconButton>
            <Done />
          </IconButton>
        </Tooltip>
      ) : (
        <TableFilterButton headCells={headCells} 
          onFilterChange={(currentColumns)=>{
            setSelectedColumns(currentColumns);
            onFilterChange(headCells?.filter(c=> currentColumns?.includes(c.id)))
          }
        }/>
      )}
    </Toolbar>
  );
}

export default function TableListTickets({
  loading,
  rows,
  onDeleteTicket,
  onFilterChange,
  paginator,
}) {
  const authorizationSystem = useAuthorizationSystem();
    const canManageQuality = authorizationSystem.requestAuthorization({
      type: 'manageQuality',
    }).authorized;
  const navigate = useNavigate();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(paginator?.limit || 10);

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
  const [selectedColumns, setSelectedColumns] = React.useState(headCells.filter(c => c?.isDefault));
  const [anchorElRowList, setAnchorElRowList] = React.useState([]);
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }} >
        <EnhancedTableToolbar numSelected={selected.length} onFilterChange={(selectedColumns)=>setSelectedColumns(selectedColumns)}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            border="0"
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
                  <StyledTableCell colSpan={selectedColumns.length + 1}>
                    <ProgressService type="text" />
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {rows?.length < 1 && !loading && (
                <StyledTableRow>
                  <StyledTableCell colSpan={selectedColumns.length + 1}>
                    <Alert severity="warning">
                      Aucun objectif trouvé.
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

                if (!anchorElRowList[index]) {
                  anchorElRowList[index] = null;
                }
                
                const handleOpenRow = (event) => {
                  // Utilisez l'index de la ligne pour mettre à jour l'état d'ancrage correspondant
                  if(!openRow){
                    const newAnchorElRowList = [...anchorElRowList];
                    newAnchorElRowList[index] = event.currentTarget;
                    setAnchorElRowList(newAnchorElRowList);
                  }else{
                    handleCloseRow()
                  }
                };
                
                const handleCloseRow = () => {
                  // Réinitialisez l'état d'ancrage de la ligne correspondante à null
                  const newAnchorElRowList = [...anchorElRowList];
                  newAnchorElRowList[index] = null;
                  setAnchorElRowList(newAnchorElRowList);
                };
                
                const openRow = Boolean(anchorElRowList[index]);

                return (
                  <React.Fragment key={row.id}>
                    <StyledTableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                    <StyledTableCell padding="checkbox">
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Checkbox
                          onClick={(event) => handleClick(event, row.id)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                        {row?.actions && row?.actions?.length > 0 && <Tooltip title={`${openRow ? 'Cacher' : 'Afficher'} les actions`}><IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={handleOpenRow}
                        >
                          {openRow ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton></Tooltip>}
                      </Stack>
                    </StyledTableCell>
                      {
                        selectedColumns?.filter(c=>c?.id !== 'action')?.map((column, index) => {
                          return <StyledTableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding={column?.disablePadding ? "none" : "normal"}
                            key={index}
                            onClick={()=> {if(!column?.disableClickDetail) navigate(`/online/qualites/plan-action/tickets/details/${row?.id}`)}}
                          >
                          {column?.render ? column?.render(row) : row[column?.id]}
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
                            to={`/online/qualites/plan-action/tickets/details/${row?.id}`}
                            className="no_style"
                          >
                            <MenuItem onClick={handleCloseMenu}>
                              <Article sx={{ mr: 2 }} />
                              Détails
                            </MenuItem>
                          </Link>
                          {canManageQuality && <><MenuItem
                            onClick={() => {
                              onOpenDialogListLibrary(row?.folder);
                              handleCloseMenu();
                            }}
                          >
                            <Folder sx={{ mr: 2 }} />
                            Bibliothèque
                          </MenuItem>
                          <Link
                            to={`/online/qualites/plan-action/tickets/modifier/${row?.id}`}
                            className="no_style"
                          >
                            <MenuItem onClick={handleCloseMenu}>
                              <Edit sx={{ mr: 2 }} />
                              Modifier
                            </MenuItem>
                          </Link>
                          <MenuItem
                            onClick={() => {
                              onDeleteTicket(row?.id);
                              handleCloseMenu();
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <Delete sx={{ mr: 2 }} />
                            Supprimer
                          </MenuItem></>}
                        </Popover>
                      </StyledTableCell>
                    </StyledTableRow>
                    {row?.actions && row?.actions?.length > 0 && <CollapsibleRow rows={row?.actions} open={openRow}/>}
                  </React.Fragment>
                );
              })}
              {emptyRows > 0 && (
                <StyledTableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={selectedColumns.length + 1} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}



function CollapsibleRow({rows, open}) {
  const authorizationSystem = useAuthorizationSystem();
    const canManageQuality = authorizationSystem.requestAuthorization({
      type: 'manageQuality',
    }).authorized;
  return (
    <StyledTableRow>
      <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              Les actions
            </Typography>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Échéance</StyledTableCell>
                  <StyledTableCell>Responsables</StyledTableCell>
                  <StyledTableCell>Statut</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {rows?.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {row.description}
                    </StyledTableCell>
                    <StyledTableCell align="left">{`${getFormatDate(row?.dueDate)}`}</StyledTableCell>
                    <StyledTableCell align="left">
                      <Stack direction="row" flexWrap='wrap' spacing={1}>
                        <ChipGroupWithPopover people={row?.employees} />
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <TaskActionStatusLabelMenu taskAction={row} disabled={!canManageQuality}/>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </StyledTableCell>
    </StyledTableRow>
  );
}