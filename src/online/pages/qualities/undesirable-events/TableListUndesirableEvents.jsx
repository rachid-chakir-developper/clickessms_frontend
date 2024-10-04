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
import { Alert, Avatar, Button, Chip, FormControlLabel, FormGroup, Menu, MenuItem, Popover, Stack, TablePagination } from '@mui/material';
import AppLabel from '../../../../_shared/components/app/label/AppLabel';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import CircularProgressWithLabel from '../../../../_shared/components/feedbacks/CircularProgressWithLabel';
import TableExportButton from '../../../_shared/components/data_tools/export/TableExportButton';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import TableFilterButton from '../../../_shared/components/table/TableFilterButton';
import { getFormatDate, getFormatDateTime, getPriorityLabel, getUndesirableEventSeverityLabel, getUndesirableEventTypeLabel, getUndesirableEventTypeMiniLabel } from '../../../../_shared/tools/functions';
import UndesirableEventStatusLabelMenu from './UndesirableEventStatusLabelMenu';
import ChipGroupWithPopover from '../../../_shared/components/persons/ChipGroupWithPopover';
import { POST_UNDESIRABLE_EVENT_TICKET } from '../../../../_shared/graphql/mutations/UndesirableEventMutations';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';
import { useMutation } from '@apollo/client';
import { EI_STATUS } from '../../../../_shared/tools/constants';

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
      label: 'Titre',
    },
    {
        id: 'startingDateTime',
        property: 'starting_date_time',
        exportField: 'starting_date_time',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        label: 'Date',
        render: ({startingDateTime})=> getFormatDate(startingDateTime)
    },
    {
        id: 'establishments',
        property: 'establishments__establishment__name',
        exportField: ['establishments__establishment__name'],
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
              establishment={establishment.establishment}
            />
          );
        })}
      </Stack>
    },
    {
        id: 'employee',
        property: 'employee__first_name',
        exportField: ['employee__first_name', 'employee__last_name'],
        numeric: false,
        disablePadding: false,
        isDefault: true,
        disableClickDetail: true,
        sortDisabled: true,
        label: 'Déclaré par',
        render: ({employee}) => <EmployeeChip employee={employee} />
    },
    {
      id: 'declarants',
      property: 'declarants__first_name',
      exportField: ['declarants__first_name', 'declarants__last_name'],
      numeric: false,
      disablePadding: false,
      disableClickDetail: true,
      sortDisabled: true,
      label: 'Autres décalarants',
      render: ({declarants}) => declarants && declarants?.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
        <ChipGroupWithPopover people={declarants} />
    </Stack>
    },
    {
        id: 'undesirableEventType',
        property: 'undesirable_event_type',
        exportField: 'undesirable_event_type',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        label: 'Type',
        render: ({undesirableEventType})=>
          <Tooltip title={getUndesirableEventTypeLabel(undesirableEventType)}>
            <Chip variant="outlined" 
                  color={undesirableEventType === 'NORMAL' ? 'secondary' : 'warning'}
                  label={getUndesirableEventTypeMiniLabel(undesirableEventType)}
            />
          </Tooltip>
    },
    {
        id: 'normalTypes',
        property: 'normal_types',
        exportField: 'normal_types',
        numeric: false,
        disablePadding: false,
        label: 'Types normal',
        render: ({normalTypes})=> normalTypes?.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
              {normalTypes?.map((t, i)=> <Chip key={i} label={t?.name} />)}
        </Stack>
    },
    {
        id: 'seriousTypes',
        property: 'serious_types',
        exportField: 'serious_types',
        numeric: false,
        disablePadding: false,
        label: 'Types grave',
        render: ({seriousTypes})=> seriousTypes?.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
              {seriousTypes?.map((t, i)=> <Chip key={i} label={t?.name} />)}
        </Stack>
    },
    {
        id: 'otherTypes',
        property: 'other_types',
        exportField: 'other_types',
        numeric: false,
        disablePadding: false,
        label: 'Autres type',
    },
    {
      id: 'employees',
      property: 'employees__employee__first_name',
      exportField: ['employees__employee__first_name', 'employees__employee__last_name'],
      numeric: false,
      disablePadding: false,
      disableClickDetail: true,
      sortDisabled: true,
      label: 'Professionnel(s)',
      render: ({employees}) => employees && employees?.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
        <ChipGroupWithPopover people={employees?.map((employee)=>employee.employee)} />
    </Stack>
    },
    {
      id: 'beneficiaries',
      property: 'beneficiaries__beneficiary__first_name',
      exportField: ['beneficiaries__beneficiary__first_name', 'beneficiaries__beneficiary__last_name'],
      numeric: false,
      disablePadding: false,
      disableClickDetail: true,
      sortDisabled: true,
      label: 'Bénificiaire(s)',
      render: ({beneficiaries}) => beneficiaries && beneficiaries?.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
        <ChipGroupWithPopover people={beneficiaries?.map((beneficiarie)=>beneficiarie?.beneficiary)} />
    </Stack>
    },
    {
        id: 'concernedFamilies',
        property: 'concerned_families',
        exportField: 'concerned_families',
        numeric: false,
        disablePadding: false,
        label: 'Famille(s)',
    },
    {
        id: 'courseFactsDateTime',
        property: 'course_facts_date_time',
        exportField: 'course_facts_date_time',
        numeric: false,
        disablePadding: false,
        label: 'Date et heure des faits',
        render: ({courseFactsDateTime})=> getFormatDateTime(courseFactsDateTime)
    },
    {
        id: 'courseFactsPlace',
        property: 'course_facts_place',
        exportField: 'course_facts_place',
        numeric: false,
        disablePadding: false,
        label: 'Lieu des faits',
    },
    {
        id: 'circumstanceEventText',
        property: 'circumstance_event_text',
        exportField: 'circumstance_event_text',
        numeric: false,
        disablePadding: false,
        label: 'Circonstance de l’événement',
    },
    {
        id: 'frequency',
        property: 'frequency',
        exportField: 'frequency',
        numeric: false,
        disablePadding: false,
        label: 'Fréquence',
        render: ({frequency})=> frequency?.name
    },
    {
        id: 'severity',
        property: 'severity',
        exportField: 'severity',
        numeric: false,
        disablePadding: false,
        label: 'Gravité',
        render: ({severity})=> getUndesirableEventSeverityLabel(severity)
    },
    {
      id: 'notifiedPersons',
      property: 'notified_persons__employee__first_name',
      exportField: ['notified_persons__employee__first_name', 'notified_persons__employee__last_name'],
      numeric: false,
      disablePadding: false,
      disableClickDetail: true,
      sortDisabled: true,
      label: 'Notifié(s)',
      render: ({notifiedPersons}) => notifiedPersons && notifiedPersons?.length > 0 && <Stack direction="row" flexWrap='wrap' spacing={1}>
        <ChipGroupWithPopover people={notifiedPersons?.map((notifiedPerson)=>notifiedPerson.employee)} />
    </Stack>
    },
    {
        id: 'otherNotifiedPersons',
        property: 'other_notified_persons',
        exportField: 'other_notified_persons',
        numeric: false,
        disablePadding: false,
        label: 'Autres notifié(s)',
    },
    {
        id: 'actionsTakenText',
        property: 'actions_taken_text',
        exportField: 'actions_taken_text',
        numeric: false,
        disablePadding: false,
        label: 'Mesure(s) prise(s)',
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
        id: 'completionPercentage',
        property: 'completion_percentage',
        exportField: 'completion_percentage',
        numeric: false,
        disablePadding: false,
        disableClickDetail: true,
        isDefault: true,
        label: 'Progression',
        render: ({id, status, completionPercentage, ticket}, canManageQuality, onCreateUndesirableEventTicket)=> {
          return (status !== EI_STATUS.DRAFT && <>
          {ticket && <CircularProgressWithLabel value={completionPercentage}/>}
          {!ticket && canManageQuality && <Button variant="text" size="small" endIcon={<Done />} 
                            onClick={() => {
                              onCreateUndesirableEventTicket(id);
                            }}>
                            Analyser
                          </Button>}
          {!ticket && !canManageQuality && `En attente d'analyse`}
        </>)}
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
        render: (data)=> <UndesirableEventStatusLabelMenu undesirableEvent={data} />
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
          Les événements indésirables
        </Typography>
      )}
      <TableExportButton 
        entity={'UndesirableEvent'}
        fileName={'Evenements-indesirables'}
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

export default function TableListUndesirableEvents({
  loading,
  rows,
  onDeleteUndesirableEvent,
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
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
  const [createUndesirableEventTicket, { loading: loadingPostTicket }] =
    useMutation(POST_UNDESIRABLE_EVENT_TICKET, {
      onCompleted: (datas) => {
        if (datas.createUndesirableEventTicket.done) {
          let ticket = datas.createUndesirableEventTicket?.undesirableEvent?.ticket
          navigate(`/online/qualites/plan-action/tickets/modifier/${ticket?.id}`);
        } else {
          setNotifyAlert({
            isOpen: true,
            message: `Non analysé ! ${datas.createUndesirableEventTicket.message}.`,
            type: 'error',
          });
        }
      },
      refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }],
      onError: (err) => {
        console.log(err);
        setNotifyAlert({
          isOpen: true,
          message: 'Non changée ! Veuillez réessayer.',
          type: 'error',
        });
      },
    });

  const onCreateUndesirableEventTicket = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'ATTENTION',
      subTitle: 'Voulez vous vraiment analyser ?',
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        createUndesirableEventTicket({ variables: { id: id } });
      },
    });
  };

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
                      Aucun événement indésirable trouvé.
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
                          onClick={()=> {if(!column?.disableClickDetail) navigate(`/online/qualites/evenements-indesirables/details/${row?.id}`)}}
                        >
                        {column?.render ? column?.render(row, canManageQuality, onCreateUndesirableEventTicket) : row[column?.id]}
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
                          to={`/online/qualites/evenements-indesirables/details/${row?.id}`}
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
                        {canManageQuality && <MenuItem
                          onClick={() => {
                            onCreateUndesirableEventTicket(row?.id);
                            handleCloseMenu();
                          }}
                        >
                          <Done sx={{ mr: 2 }} />
                          Analyser
                        </MenuItem>}
                        <Link
                          to={`/online/qualites/evenements-indesirables/modifier/${row?.id}`}
                          className="no_style"
                        >
                          <MenuItem onClick={handleCloseMenu}>
                            <Edit sx={{ mr: 2 }} />
                            Modifier
                          </MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            onDeleteUndesirableEvent(row?.id);
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
