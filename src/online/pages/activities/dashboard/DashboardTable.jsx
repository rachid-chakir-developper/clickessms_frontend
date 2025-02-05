import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box } from "@mui/material";
import EstablishmentChip from "../../companies/establishments/EstablishmentChip";

const DashboardTableItem = ({activityTrackingEstablishment}) => {
  const extractValues = (key, suffix = '') => {
    const monthValues =
      activityTrackingEstablishment?.activityTrackingMonth?.map(
        (item) => `${item[key]}${suffix}`
      ) || [];
    const accumulationValue = activityTrackingEstablishment?.activityTrackingAccumulation?.[key];
    return [...monthValues, accumulationValue !== undefined ? `${accumulationValue}${suffix}` : accumulationValue];
  };
  const data = [
    { 
      key: "entriesCount",
      label: "Nombre d'entrée",
      values: extractValues('entriesCount'),
    },
    {
      key: "exitsCount",
      label: "Nombre de sortie",
      values: extractValues('exitsCount'),
    },
    {
      key: "plannedExitsCount",
      label: "Nombre de sortie prévue (fin date d'échéance)",
      values: extractValues('plannedExitsCount'),
    },
    {
      key: "presentsMonthCount",
      label: "Nombre de présent au dernier jour du mois",
      values: extractValues('presentsMonthCount'),
      bold: true,
    },
    {
      key: "daysCount",
      label: "Nombre de journée",
      values: extractValues('daysCount'),
    },
    {
      key: "valuation",
      label: "Valorisation en €",
      values: extractValues('valuation', '€'),
    },
    {
      key: "occupancyRate",
      label: "Taux d'occupation",
      values: extractValues('occupancyRate', '%'),
    },
    {
      key: "objectiveOccupancyRate",
      label: "Objectif TO",
      values: extractValues('objectiveOccupancyRate', '%'),
    },
    {
      key: "objectiveDaysCount",
      label: "Nombre de journées théoriques",
      values: extractValues('objectiveDaysCount'),
    },
    {
      key: "gapDaysCount",
      label: "ECART en journées",
      values: extractValues('gapDaysCount'),
    },
    {
      key: "gapValuation",
      label: "Valorisation de l'écart",
      values: extractValues('gapValuation', '€'),
      highlightNegative: true,
    },
  ];
  return (
    <Box sx={{ padding: 2 }}>
        {activityTrackingEstablishment?.establishment ? 
          <EstablishmentChip establishment={activityTrackingEstablishment?.establishment} /> 
          : <Typography variant="h6" gutterBottom>{activityTrackingEstablishment?.title}</Typography>}
      <TableContainer component={Paper} sx={{marginTop: 2}}>
        <Table sx={{ minWidth: 1200 }} aria-label="dashboard table">
          <TableHead>
            <TableRow>
              <TableCell
                  sx={{
                    width: 200,
                    maxWidth: 200,
                    minWidth: 200,
                  }}
                  >Année : {activityTrackingEstablishment?.year}</TableCell>
                {activityTrackingEstablishment?.months?.map((month, index) => (
                  <TableCell key={index} align="center" sx={{ fontWeight: "bold", backgroundColor: "#003366", color: "#fff" }}>
                    {month}
                  </TableCell>
                ))}
              <TableCell align="center" sx={{ fontWeight: "bold", backgroundColor: "#003366", color: "#fff" }}>
                {activityTrackingEstablishment?.activityTrackingAccumulation?.label}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) =>(
              <TableRow key={rowIndex}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: row.bold ? "bold" : "normal",
                    backgroundColor: rowIndex % 2 === 0 ? "#f3f3f3" : "#e0e0e0",
                  }}
                >
                  {row.label}
                </TableCell>
                {row.values.map((value, colIndex) => {
                  // Récupérer les informations du mois correspondant
                  const monthData = activityTrackingEstablishment?.activityTrackingMonth?.[colIndex] || {};
                  
                  const isCurrent = monthData?.isCurrentMonth;
                  const isFuture = monthData?.isFutureMonth;
                  return (
                    <TableCell
                      key={colIndex}
                      align="center"
                      sx={{
                        color: row.highlightNegative && value < 0 ? "red" : "inherit",
                        fontWeight: row.bold ? "bold" : "normal",
                        backgroundColor: isCurrent ? "#efefef" : "",  // Fond foncé pour le mois courant
                        opacity: isFuture ? 0.1 : 1,  // Opacité réduite pour les mois futurs
                        fontSize: isFuture ? 13 : '',  // Opacité réduite pour les mois futurs
                      }}
                    >
                      {value}
                    </TableCell>
                  )}
                )}
              </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DashboardTable = ({activityTrackingEstablishments=[]}) => {


  return (
    <Box sx={{ padding: 2 }}>
      {activityTrackingEstablishments?.map((activityTrackingEstablishment, index) => (
        <DashboardTableItem key={index} activityTrackingEstablishment={activityTrackingEstablishment} />
      ))}
    </Box>
  );
};

export default DashboardTable;

