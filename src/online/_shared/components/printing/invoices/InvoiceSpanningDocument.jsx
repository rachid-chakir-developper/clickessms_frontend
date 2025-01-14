import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { alpha, Stack, styled, Typography } from '@mui/material';
import AppLabel from '../../../../../_shared/components/app/label/AppLabel';
import { formatCurrencyAmount, getFormatDate, getPaymentMethodLabel } from '../../../../../_shared/tools/functions';
import { INVOICE_TYPES } from '../../../../../_shared/tools/constants';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.activatedOpacity,
        ),
        color: theme.palette.secondary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        verticalAlign: 'baseline',
        border: 0,
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
    borderRadius: 10
  }));
  
const Item = styled(Stack)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function ccyFormat(num) {
    if (typeof num === 'number' && !isNaN(num)) {
        return `${num.toFixed(2)}`;
    }
    return '0.00'; // ou une autre valeur par défaut que vous souhaitez retourner
}

export default function InvoiceSpanningDocument({ invoice, items=[] }) {
    return (
        <>
            <Table aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Noms</StyledTableCell>
                        <StyledTableCell>Prénoms</StyledTableCell>
                        <StyledTableCell>Date nai.</StyledTableCell>
                        <StyledTableCell>Date adm.</StyledTableCell>
                        <StyledTableCell>Date sor.</StyledTableCell>
                        <StyledTableCell align="center">Ap.</StyledTableCell>
                        <StyledTableCell align="center">Apjm</StyledTableCell>
                        <StyledTableCell align="center">Garde</StyledTableCell>
                        <StyledTableCell align="center">Plt direct</StyledTableCell>
                        <StyledTableCell align="center">Nbr jour.</StyledTableCell>
                        <StyledTableCell align="right">Prix joru.</StyledTableCell>
                        <StyledTableCell align="right">Toutaux</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {items.map((item, index) => (
                    <StyledTableRow key={index}>
                        <StyledTableCell>
                            <Typography>{item?.lastName}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography>{item?.firstName}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography>{getFormatDate(item?.birthDate)}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography>{getFormatDate(item?.entryDate)}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography>{getFormatDate(item?.releaseDate)}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography></Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography></Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography></Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography></Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography>{item?.quantity}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                            <Typography>{formatCurrencyAmount(item?.unitPrice)}</Typography>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            <Typography>{formatCurrencyAmount(item?.amountTtc)}</Typography>
                        </StyledTableCell>
                    </StyledTableRow>
                ))}
                    <TableRow>
                        <StyledTableCell rowSpan={3} colSpan={7} sx={{ border: 0 }}>
                        </StyledTableCell>
                        <StyledTableCell colSpan={5} sx={{padding: theme => theme.spacing(0)}}>
                            <Table>
                                <TableRow sx={{ backgroundColor: theme => theme.palette.grey[500] }}>
                                    <StyledTableCell
                                        sx={{ color: theme => theme.palette.common.white, fontWeight: 700, fontStyle: 'italic' }}
                                        colSpan={2}
                                    >
                                        Total.TTC
                                    </StyledTableCell>
                                    <StyledTableCell
                                        sx={{ color: theme => theme.palette.common.white, fontWeight: 700 }}
                                        colSpan={2}
                                        align="right"
                                    >
                                        <Typography sx={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic' }}>{formatCurrencyAmount(invoice?.totalTtc)}</Typography>
                                    </StyledTableCell>
                                </TableRow>
                            </Table>
                        </StyledTableCell>
                    </TableRow>

                </TableBody>
            </Table>
        </>
    );
}
