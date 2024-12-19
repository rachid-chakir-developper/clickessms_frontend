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
              <TableCell>Année : {activityTrackingEstablishment?.year}</TableCell>
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
            {data.map((row, rowIndex) => (
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
                {row.values.map((value, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align="center"
                    sx={{
                      color: row.highlightNegative && value < 0 ? "red" : "inherit",
                      fontWeight: row.bold ? "bold" : "normal",
                    }}
                  >
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DashboardTable = ({activityTrackingEstablishments=[]}) => {
  const data = [
    { 
      key: "entriesCount",
      label: "Nombre d'entrée",
      values: [1, 0, 0, 1, 0, 1, 0, 1, 2, 0, 2, 1, 7],
    },
    {
      key: "exitsCount",
      label: "Nombre de sortie",
      values: [0, 0, 1, 0, 0, 0, 1, 2, 0, 2, 1, 1, 7],
    },
    {
      key: "plannedExitsCount",
      label: "Nombre de sortie prévue (fin date d'échéance)",
      values: [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 5],
    },
    {
      key: "presentsMonthCount",
      label: "Nombre de présent au dernier jour du mois",
      values: [11, 11, 11, 10, 9, 10, 9, 10, 12, 11, 10, 10, 10],
      bold: true,
    },
    {
      key: "daysCount",
      label: "Nombre de journée",
      values: [323, 319, 341, 303, 309, 309, 309, 367, 393, 351, 305, 164, 3621],
    },
    {
      key: "valuation",
      label: "Valorisation en €",
      values: [
        "57 278 €",
        "56 568 €",
        "60 470 €",
        "53 731 €",
        "54 972 €",
        "53 199 €",
        "54 795 €",
        "65 080 €",
        "69 691 €",
        "62 243 €",
        "54 086 €",
        "29 082 €",
        "642 112 €",
      ],
    },
    {
      key: "occupancyRate",
      label: "Taux d'occupation",
      values: [
        "86,8%",
        "91,7%",
        "91,7%",
        "84,2%",
        "83,3%",
        "83,3%",
        "83,1%",
        "98,7%",
        "109,2%",
        "94,3%",
        "87,1%",
        "44,1%",
        "1005,8%",
      ],
    },
    {
      key: "objectiveOccupancyRate",
      label: "Objectif TO",
      values: Array(12).fill("95,0%").concat(["95,0%"]),
    },
    {
      key: "gapDaysCount",
      label: "ECART en journées",
      values: [-30, -12, -12, -39, -42, -42, -44, 14, 51, -2, -37, -189, -198],
    },
    {
      key: "gapValuation",
      label: "Valorisation de l'écart",
      values: [
        "-5 391 €",
        "-2 057 €",
        "-2 199 €",
        "-6 916 €",
        "-7 696 €",
        "-7 448 €",
        "-7 873 €",
        "2 412 €",
        "9 044 €",
        "-426 €",
        "-6 561 €",
        "-33 586 €",
        "-35 111 €",
      ],
      highlightNegative: true,
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      {activityTrackingEstablishments?.map((activityTrackingEstablishment, index) => (
        <DashboardTableItem key={index} activityTrackingEstablishment={activityTrackingEstablishment} />
      ))}
    </Box>
  );
};

export default DashboardTable;

