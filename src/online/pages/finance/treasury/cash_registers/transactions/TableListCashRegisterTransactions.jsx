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
import { visuallyHidden } from '@mui/utils';
import styled from '@emotion/styled';
import {
  ArrowDownward,
  ArrowUpward,
  Article,
  Delete,
  Done,
  Download,
  Edit,
  Folder,
  MoreVert,
} from '@mui/icons-material';
import { Alert, Avatar, Button, Chip, FormControlLabel, FormGroup, Menu, MenuItem, Popover, Stack, TablePagination } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useFeedBacks } from '../../../../../../_shared/context/feedbacks/FeedBacksProvider';
import ProgressService from '../../../../../../_shared/services/feedbacks/ProgressService';
import TableExportButton from '../../../../../_shared/components/data_tools/export/TableExportButton';
import { useAuthorizationSystem } from '../../../../../../_shared/context/AuthorizationSystemProvider';
import TableFilterButton from '../../../../../_shared/components/table/TableFilterButton';
import { formatCurrencyAmount, getFormatDate, getTransactionTypeLabel, truncateText } from '../../../../../../_shared/tools/functions';

import { useMutation } from '@apollo/client';
import ChipGroupWithPopover from '../../../../../_shared/components/persons/ChipGroupWithPopover';
import { TRANSACTION_TYPE_CHOICES } from '../../../../../../_shared/tools/constants';

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
        id: 'date',
        property: 'date',
        exportField: 'date',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        label: "Date",
        render: ({date})=> getFormatDate(date)
    },
    {
        id: 'transactionType',
        property: 'transaction_type',
        exportField: 'transaction_type',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        disableClickDetail: true,
        label: 'Mouvement',
        render: ({transactionType})=> <Chip variant={transactionType!==TRANSACTION_TYPE_CHOICES.CREDIT ? "" : "outlined"} 
                                            label={getTransactionTypeLabel(transactionType)} 
                                            icon={transactionType!==TRANSACTION_TYPE_CHOICES.CREDIT ? <ArrowDownward size="small" /> : <ArrowUpward size="small" />}
                                      />
    },
    {
        id: 'amount',
        property: 'amount',
        exportField: 'amount',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        label: 'Montant',
        render: ({amount, transactionType})=> <b>{transactionType===TRANSACTION_TYPE_CHOICES.CREDIT && amount ? "+" : "-"} {amount ? formatCurrencyAmount(amount) : ''}</b>
    },
    {
        id: 'comment',
        property: 'comment',
        exportField: 'comment',
        numeric: false,
        disablePadding: false,
        isDefault: true,
        label: 'Commentaire',
        render: ({comment})=> <Tooltip title={comment}>{truncateText(comment, 160)}</Tooltip>
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
          Les mouvements
        </Typography>
      )}
      <TableExportButton 
        entity={'CashRegisterTransaction'}
        fileName={'caisses-mouvements'}
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

export default function TableListCashRegisterTransactions({
  loading,
  rows,
  onDeleteCashRegisterTransaction,
  onEditCashRegisterTransaction,
  onFilterChange,
  paginator,
}) {
  const authorizationSystem = useAuthorizationSystem();
  const canManageFinance = authorizationSystem.requestAuthorization({
    type: 'manageFinance',
  }).authorized;
  const navigate = useNavigate();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(paginator?.limit || 10);
  const { setNotifyAlert, setConfirmDialog } = useFeedBacks();
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
                      Aucun mouvement trouvé.
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
                          onClick={()=> {if(!column?.disableClickDetail) navigate(`/online/finance/tresorerie/caisses/details/${row?.id}`)}}
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
                        {canManageFinance && <>
                        <MenuItem
                          onClick={() => {
                            onEditCashRegisterTransaction(row);
                            handleCloseMenu();
                          }}
                        >
                          <Edit sx={{ mr: 2 }} />
                          Modifier
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            onDeleteCashRegisterTransaction(row?.id);
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