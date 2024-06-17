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
  getFormatDate,
  formatCurrencyAmount,
} from '../../../../_shared/tools/functions';
import {
  Article,
  Delete,
  Done,
  Edit,
  Folder,
  MoreVert,
} from '@mui/icons-material';
import { Alert, Avatar, Chip, MenuItem, Popover, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { useFeedBacks } from '../../../../_shared/context/feedbacks/FeedBacksProvider';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import CustomizedStatusLabelMenu from '../../../../_shared/components/app/menu/CustomizedStatusLabelMenu';
import { PUT_TASK_ACTION } from '../../../../_shared/graphql/mutations/TaskActionMutations';
import { useMutation } from '@apollo/client';
import { GET_TICKETS } from '../../../../_shared/graphql/queries/TicketQueries';
import { GET_UNDESIRABLE_EVENTS } from '../../../../_shared/graphql/queries/UndesirableEventQueries';

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
    id: 'description',
    numeric: false,
    disablePadding: true,
    label: 'Description',
  },,
  {
    id: 'dueDate',
    numeric: false,
    disablePadding: false,
    label: 'Échéance',
  },
  {
    id: 'employees',
    numeric: false,
    disablePadding: true,
    label: 'Responsables',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Statut',
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
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
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
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
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
  const { numSelected } = props;

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
          Les actions
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Traité">
          <IconButton>
            <Done />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function TableListTaskActions({
  loading,
  rows,
  onDeleteTaskAction,
  onUpdateTaskActionState,
}) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [touchedItem, setTouchedItem] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [updateTaskAction, { loading: loadingPut }] = useMutation(PUT_TASK_ACTION, {
    refetchQueries: [{ query: GET_UNDESIRABLE_EVENTS }, { query: GET_TICKETS }],
    update(cache, { data: { updateTaskAction } }) {
      const updatedTaskAction = updateTaskAction.taskAction;

      cache.modify({
        fields: {
          taskActions(
            existingTaskActions = { totalCount: 0, nodes: [] },
            { readField },
          ) {
            const updatedTaskActions = existingTaskActions.nodes.map((taskAction) =>
              readField('id', taskAction) === updatedTaskAction.id
                ? updatedTaskAction
                : taskAction,
            );

            return {
              totalCount: existingTaskActions.totalCount,
              nodes: updatedTaskActions,
            };
          },
        },
      });
    },
  });
  

  React.useEffect(() => {
    console.log(loading, rows);
  }, [loading, rows]);

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
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
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
                  <StyledTableCell colSpan="7">
                    <ProgressService type="text" />
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {rows?.length < 1 && !loading && (
                <StyledTableRow>
                  <StyledTableCell colSpan="7">
                    <Alert severity="warning">Aucune action trouvé.</Alert>
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
                    <StyledTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.description}
                    </StyledTableCell>
                    <StyledTableCell align="left">{`${getFormatDate(row?.dueDate)}`}</StyledTableCell>
                    <StyledTableCell align="left">
                      <Stack direction="row" flexWrap='wrap' spacing={1}>
                        {row?.employees?.map((employee, index) => {
                          return (
                            <Chip
                              key={index}
                              avatar={
                                <Avatar
                                  alt={employee?.firstName}
                                  src={
                                    employee?.photo
                                      ? employee?.photo
                                      : '/default-placeholder.jpg'
                                  }
                                />
                              }
                              label={employee?.firstName}
                              variant="outlined"
                            />
                          );
                        })}
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <CustomizedStatusLabelMenu 
                          status={row?.status}
                          type="action"
                          loading={loadingPut && touchedItem && touchedItem?.id === row?.id}
                          onChange={(status)=> {setTouchedItem(row); updateTaskAction({ variables: {id: row?.id, taskActionData: {status}} })}}
                        />
                    </StyledTableCell>
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
                        {/* <Link
                          to={`/online/travaux/actions/details/${row?.id}`}
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
                        </MenuItem> */}
                        <Link
                          to={`/online/travaux/actions/modifier/${row?.id}`}
                          className="no_style"
                        >
                          <MenuItem onClick={handleCloseMenu}>
                            <Edit sx={{ mr: 2 }} />
                            Modifier
                          </MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            onDeleteTaskAction(row?.id);
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
                  <StyledTableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
