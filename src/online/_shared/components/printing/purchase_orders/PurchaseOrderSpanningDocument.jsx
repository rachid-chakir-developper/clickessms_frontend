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
    padding: 6,
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
    borderRadius: 10,
    padding: 0,
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

export default function PurchaseOrderSpanningDocument({ order, items=[], deposits=[] }) {
    const detailTva = JSON.parse(order?.detailTva || '{}'); 
    return (
        <>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell sx={{minWidth: 280}}>Libellé</StyledTableCell>
                        <StyledTableCell align="center" sx={{width: 100}}>Qté.</StyledTableCell>
                        <StyledTableCell align="center" sx={{width: 200}}>P.unitaire.TTC</StyledTableCell>
                        <StyledTableCell align="right">Mt.TTC</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {items.map((item, index) => (
                    <StyledTableRow key={index}>
                        <StyledTableCell>
                            <Item sx={{textAlign: 'left'}}>
                                <Typography
                                    gutterBottom
                                    component="div"
                                    dangerouslySetInnerHTML={{ __html: item?.description }}
                                />
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            <Item>
                                <Typography>{item?.quantity}</Typography>
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            <Item>
                                <Typography>{item?.amountTtc / item?.quantity}&nbsp;€</Typography>
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                            <Item>
                                <Typography>{item?.amountTtc}&nbsp;€</Typography>
                            </Item>
                        </StyledTableCell>
                    </StyledTableRow>
                ))}
                    <TableRow>
                        <StyledTableCell rowSpan={3} colSpan={3} sx={{ border: 0 }}>
                            <Table sx={{marginY: 2}}>
                                <TableRow sx={{borderBottom: 0}}>
                                    <TableCell sx={{borderBottom: 0, padding: 0}}>Règlement</TableCell>
                                    <TableCell sx={{borderBottom: 0, padding: 0}}><em>{getPaymentMethodLabel(order?.paymentMethod)}</em></TableCell>
                                </TableRow>
                            </Table>
                        </StyledTableCell>
                        <StyledTableCell colSpan={4}  sx={{ padding: 0 }}>
                            <Table>
                                <TableRow sx={{ backgroundColor: theme => theme.palette.grey[500] }}>
                                    <StyledTableCell colSpan={2} sx={{ color: theme => theme.palette.common.white, fontWeight: 700, fontStyle: 'italic' }}>Total.TTC</StyledTableCell>
                                    <StyledTableCell colSpan={2} align="right" sx={{ color: theme => theme.palette.common.white, fontWeight: 700 }}>
                                        <Typography>{formatCurrencyAmount(order.totalTtc)}</Typography>
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
