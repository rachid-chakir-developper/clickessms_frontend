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
import InputSendDashboardComment from "./comments/InputDashboardComment";

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
                            <StyledTableCell key={index} align="center" colSpan={9}>
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
                                    "Réel",
                                    "Reçu",
                                    "Ecart",
                                    "AF",
                                    "AD",
                                    "Ecart",
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
                                            "dashboardComment",
                                            "countReceived",
                                            "gapReceived",
                                            "countApproved",
                                            "countRejected",
                                            "gapRejected",
                                            "countCanceled",
                                            ].map((item, index) => (
                                                <TableCell key={index} align="center">
                                                    {item!=='dashboardComment' && <>{activitySynthesisMonthItem[item]}</>}
                                                    {item==='dashboardComment' && 
                                                        <InputSendDashboardComment
                                                            inputType="number"
                                                            multiline={false}
                                                            establishment={activitySynthesisEstablishment?.establishment?.id}
                                                            commentType="SYNTHESIS_ALL"
                                                            year={activitySynthesis?.year}
                                                            month={indexMonth+1}
                                                            onDashboardCommentSent={()=> console.log()}
                                                            defaultDashboardComment={activitySynthesisMonthItem[item]} />
                                                    }
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
                                    "totalDashboardComment",
                                    "totalReceived",
                                    "totalGapReceived",
                                    "totalApproved",
                                    "totalRejected",
                                    "totalGapRejected",
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
