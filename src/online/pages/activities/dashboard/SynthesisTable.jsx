import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  styled,
  tableCellClasses,
} from "@mui/material";
import EstablishmentChip from "../../companies/establishments/EstablishmentChip";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#e0e0e0',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

const SynthesisTable = ({activitySynthesis}) => {
  return (
    <TableContainer component={Paper} sx={{marginY: 3}}>
        <Typography variant="h6" align="center" sx={{ margin: 2 }}>
            Demandes d'admission reçues
        </Typography>
        <Table>
            <TableHead>
                <TableRow>
                    <StyledTableCell align="center">Année : {activitySynthesis?.year}</StyledTableCell>
                    {activitySynthesis?.activitySynthesisEstablishments?.map((activitySynthesisEstablishment, index)=> 
                        <StyledTableCell key={index} align="center" colSpan={6}>
                            <EstablishmentChip establishment={activitySynthesisEstablishment?.establishment} /> 
                        </StyledTableCell>
                    )}
                    <StyledTableCell align="center">TOTAL</StyledTableCell>
                </TableRow>
                <TableRow>
                    <TableCell align="center" sx={{backgroundColor: "#e0e0e0"}}></TableCell>
                    {activitySynthesis?.activitySynthesisEstablishments?.map((activitySynthesisEstablishment, index) => (
                        <React.Fragment key={index}>
                            {[
                                "Dispo",
                                "Reçu",
                                "AF",
                                "AD",
                                "AN",
                                ].map((header, index) => (
                                    <TableCell key={index} align="center">
                                        {header}
                                    </TableCell>
                                ))}
                            <TableCell align="center" sx={{backgroundColor: "#e0e0e0"}}></TableCell>
                        </React.Fragment>
                    ))}
                    <TableCell align="center" sx={{backgroundColor: "#e0e0e0"}}></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {activitySynthesis?.months?.map((month, indexMonth) => (
                    <StyledTableRow key={indexMonth}>
                        <StyledTableCell align="center" 
                            sx={{
                                fontWeight: "bold",
                                backgroundColor: indexMonth % 2 !== 0 ? "#f3f3f3" : "#e0e0e0",
                            }}>{month}</StyledTableCell>
                        {activitySynthesis?.activitySynthesisEstablishments?.map((activitySynthesisEstablishment, indexA) => {
                                const activitySynthesisMonthItem = activitySynthesisEstablishment?.activitySynthesisMonth[indexMonth]
                                return (
                                    <React.Fragment key={indexA}>
                                        {[
                                            "countAvailablePlaces",
                                            "countReceived",
                                            "countApproved",
                                            "countRejected",
                                            "countCanceled",
                                            ].map((item, index) => (
                                                <TableCell key={index} align="center">
                                                    {activitySynthesisMonthItem[item]}
                                                </TableCell>
                                            ))}
                                        <TableCell align="center" sx={{backgroundColor: "#e0e0e0"}}></TableCell>
                                    </React.Fragment>
                                )
                            }
                        )}
                        <TableCell align="center">{activitySynthesis?.monthTotals[indexMonth]}</TableCell>
                    </StyledTableRow>
                ))}
            <StyledTableRow>
                <TableCell align="center">TOTAL</TableCell>
                {activitySynthesis?.activitySynthesisEstablishments?.map((activitySynthesisEstablishment, indexA) => {
                        const activityTotalSynthesisMonth = activitySynthesisEstablishment?.activityTotalSynthesisMonth
                        return (
                            <React.Fragment key={indexA}>
                                {[
                                    "totalAvailablePlaces",
                                    "totalReceived",
                                    "totalApproved",
                                    "totalRejected",
                                    "totalCanceled",
                                    ].map((item, index) => (
                                        <TableCell key={index} align="center">
                                            {activityTotalSynthesisMonth[item]}
                                        </TableCell>
                                    ))}
                                    <TableCell align="center" sx={{backgroundColor: "#e0e0e0"}}></TableCell>
                            </React.Fragment>
                        )
                    }
                )}
                <TableCell align="center"></TableCell>
            </StyledTableRow>
            </TableBody>
        </Table>
        </TableContainer>
    );
};

export default SynthesisTable;
