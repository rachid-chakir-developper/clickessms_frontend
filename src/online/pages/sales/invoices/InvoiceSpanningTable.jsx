import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { alpha, Button, IconButton, Stack, styled, Tooltip, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useLazyQuery } from '@apollo/client';
import TheTextField from '../../../../_shared/components/form-fields/TheTextField';
import TheAutocomplete from '../../../../_shared/components/form-fields/TheAutocomplete';
import TheDesktopDatePicker from '../../../../_shared/components/form-fields/TheDesktopDatePicker';
import { GET_BENEFICIARIES } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import dayjs from 'dayjs';


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
  }));
  
const Item = styled(Stack)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function ccyFormat(num) {
    const n = Number(num);
    return !isNaN(n) ? n.toFixed(2) : '0.00';
}
function amountHt(item){
    const amountHtOriginal = item.unitPrice * item.quantity
    return amountHtOriginal * (1 - item.discount/100);
}
function amountTtc(item, beneficiaryTvas=[]){
    const tva = beneficiaryTvas?.find(tvaItem => Number(tvaItem.id) === Number(item.beneficiaryTva));
    const tvaValue = tva ? tva.tvaValue : item.tva;
    const amountHtOriginal = item.unitPrice * item.quantity
    const amountHt = amountHtOriginal * (1 - item.discount/100);
    return amountHt * (1 + tvaValue/100);
}

function getTotalHt(items) {
    return items.map((item) => amountHt(item)).reduce((sum, i) => sum + i, 0);
}

function getTotalTtc(items, beneficiaryTvas=[]) {
    return items.map((item) => amountTtc(item, beneficiaryTvas)).reduce((sum, i) => sum + i, 0);
}

export default function InvoiceSpanningTable(
    { 
        invoice,
        items=[],
        onChange,
        addItem,
        removeItem,
        disabled,
        isNotEditable,
    }) {

    const handleFieldChange = (index, field, value) => {
        let totalTtc = ccyFormat(getTotalTtc(items,  []))
        onChange({type: 'item', index, field, value, totalTtc});
    };

    const [getBeneficiaries, {
        loading: loadingBeneficiaries,
        data: beneficiariesData,
        error: beneficiariesError,
        fetchMore: fetchMoreBeneficiaries,
    }] = useLazyQuery(GET_BENEFICIARIES, { variables: { beneficiaryFilter : null, page: 1, limit: 20 } });
    
    const onGetBeneficiaries = (keyword)=>{
        getBeneficiaries({ variables: { beneficiaryFilter : keyword === '' ? null : {keyword}, page: 1, limit: 20 } })
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 1200 }} aria-label="spanning table">
                <TableHead>
                    {/* <TableRow>
                        <StyledTableCell align="center" colSpan={7}>
                            Détails
                        </StyledTableCell>
                        <StyledTableCell align="right">Prix</StyledTableCell>
                    </TableRow> */}
                    <TableRow>
                        <StyledTableCell sx={{minWidth: 240}}>Nom</StyledTableCell>
                        <StyledTableCell sx={{minWidth: 240}}>Prénom</StyledTableCell>
                        <StyledTableCell sx={{minWidth: 190}}>Date&nbsp;naissance</StyledTableCell>
                        <StyledTableCell sx={{minWidth: 190}}>Date&nbsp;admission</StyledTableCell>
                        <StyledTableCell sx={{minWidth: 190}}>Date&nbsp;sortie</StyledTableCell>
                        {/* <StyledTableCell align="center" sx={{width: 140}}>Ap.</StyledTableCell>
                        <StyledTableCell align="center" sx={{width: 140}}>Apjm</StyledTableCell>
                        <StyledTableCell align="center" sx={{width: 140}}>Garde</StyledTableCell>
                        <StyledTableCell align="center" sx={{width: 140}}>Plt direct</StyledTableCell> */}
                        <StyledTableCell sx={{width: 160}}>Nbr&nbsp;journée</StyledTableCell>
                        <StyledTableCell sx={{width: 200}}>Prix&nbsp;journée</StyledTableCell>
                        <StyledTableCell align="right" sx={{minWidth: 170}}>Total</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {items.map((item, index) => (
                    <StyledTableRow key={index}>
                        <StyledTableCell>
                            <Item  sx={{position: 'relative'}}>
                                {!item.beneficiary && 
                                    <TheAutocomplete
                                        options={beneficiariesData?.beneficiaries?.nodes || []}
                                        onInput={(e) => {
                                            onGetBeneficiaries(e.target.value)
                                        }}
                                        onFocus={(e) => {
                                            onGetBeneficiaries(e.target.value)
                                        }}
                                        placeholder="Choisissez une personne accompagnée"
                                        size="small"
                                        multiple={false}
                                        value={item.beneficiary}
                                        onChange={(e, newValue) => {
                                                handleFieldChange(index, 'beneficiary', newValue)
                                                handleFieldChange(index, 'preferredName', newValue?.preferredName)
                                                handleFieldChange(index, 'lastName', newValue?.lastName)
                                                handleFieldChange(index, 'firstName', newValue?.firstName)
                                                handleFieldChange(index, 'birthDate', newValue?.firstName ? dayjs(newValue?.firstName) : null)
                                            }
                                        }
                                        disabled={disabled}
                                        />
                                }
                                {item.beneficiary && 
                                    <TheTextField
                                        variant="outlined"
                                        size="small"
                                        value={item.lastName}
                                        onChange={(e) => handleFieldChange(index, 'lastName', e.target.value)}
                                        disabled={disabled}
                                    />
                                }
                                {!isNotEditable && <Tooltip title="Retirer cet élémént" >
                                    <IconButton sx={{position: 'absolute', top: -3, left: -24}}
                                        onClick={() => removeItem(index)}
                                        edge="end"
                                        color="error"
                                        disabled={disabled}
                                        >
                                        <Close />
                                    </IconButton>
                                </Tooltip>}
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <Item>
                                <TheTextField
                                    variant="outlined"
                                    size="small"
                                    value={item.firstName}
                                    onChange={(e) => handleFieldChange(index, 'firstName', e.target.value)}
                                    disabled={disabled}
                                />
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <Item>
                                <TheDesktopDatePicker
                                    slotProps={{
                                        textField: {
                                        size: 'small'
                                        },
                                    }}
                                    value={item.birthDate}
                                    onChange={(date) => handleFieldChange(index, 'birthDate', date)}
                                    disabled={disabled}
                                />
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <Item>
                                <TheDesktopDatePicker
                                    slotProps={{
                                        textField: {
                                            size: 'small'
                                        },
                                    }}
                                    value={item.entryDate}
                                    onChange={(date) => handleFieldChange(index, 'entryDate', date)}
                                    disabled={disabled}
                                />
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <Item>
                                <TheDesktopDatePicker
                                    slotProps={{
                                        textField: {
                                            size: 'small'
                                        },
                                    }}
                                    value={item.releaseDate}
                                    onChange={(date) => handleFieldChange(index, 'releaseDate', date)}
                                    disabled={disabled}
                                />
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <Item>
                                <TheTextField
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleFieldChange(index, 'quantity', e.target.value)}
                                    disabled={disabled}
                                />
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                            <Item>
                                <TheTextField
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => handleFieldChange(index, 'unitPrice', e.target.value)}
                                    disabled={disabled}
                                />
                            </Item>
                        </StyledTableCell>
                        <StyledTableCell align="right">{`${ccyFormat(amountTtc(item, []))}`}&nbsp;€</StyledTableCell>
                    </StyledTableRow>
                ))}
                
                    {!isNotEditable && <TableRow sx={{borderStyle: 'dashed', borderWidth: 2, borderColor: '#f1f1f1', backgroundColor: '#fcfcfc'}}>
                        <StyledTableCell align="left" colSpan={4} onClick={addItem}>
                            <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                disabled={disabled}
                                sx={{textTransform: 'initial', fontStyle: 'italic'}}
                            >
                                Ajouter une personne accompagnée
                            </Button>
                        </StyledTableCell>
                        <StyledTableCell align="right" colSpan={4} onClick={addItem} sx={{color: '#c1c1c1', fontStyle: 'italic'}}>Cliquez pour ajouter une personne accompagnée</StyledTableCell>
                    </TableRow>}
                    <TableRow>
                        <StyledTableCell rowSpan={3} colSpan={5} sx={{ border: 0 }}>
                        </StyledTableCell>
                        <StyledTableCell colSpan={3} sx={{padding: theme => theme.spacing(0)}}>
                            <Table>
                                <TableBody>
                                    <TableRow sx={{ backgroundColor: theme => theme.palette.grey[400] }}>
                                        <StyledTableCell
                                            sx={{ color: theme => theme.palette.common.white, fontWeight: 700, fontStyle: 'italic' }}
                                            colSpan={2}
                                        >
                                            Sous total.TTC
                                        </StyledTableCell>
                                        <StyledTableCell
                                            sx={{ color: theme => theme.palette.common.white, fontWeight: 700 }}
                                            colSpan={2}
                                            align="right"
                                        >
                                            <Typography component="div" variant="span" sx={{ fontSize: 18, fontWeight: 700, fontStyle: 'italic' }}>
                                            {`${ccyFormat(getTotalTtc(items,  []))}`}&nbsp;€
                                            </Typography>
                                        </StyledTableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </StyledTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
