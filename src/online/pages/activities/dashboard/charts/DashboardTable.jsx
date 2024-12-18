import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box } from "@mui/material";

const DashboardTable = ({activityTracking}) => {
  const data = [
    {
      label: "Nombre d'entrée",
      values: [1, 0, 0, 1, 0, 1, 0, 1, 2, 0, 2, 1, 7],
    },
    {
      label: "Nombre de sortie",
      values: [0, 0, 1, 0, 0, 0, 1, 2, 0, 2, 1, 1, 7],
    },
    {
      label: "Nombre de sortie prévue (fin date d'échéance)",
      values: [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 5],
    },
    {
      label: "Nombre de présent au dernier jour du mois",
      values: [11, 11, 11, 10, 9, 10, 9, 10, 12, 11, 10, 10, 10],
      bold: true,
    },
    {
      label: "Nombre de journée",
      values: [323, 319, 341, 303, 309, 309, 309, 367, 393, 351, 305, 164, 3621],
    },
    {
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
      label: "Objectif TO",
      values: Array(12).fill("95,0%").concat(["95,0%"]),
    },
    {
      label: "ECART en journées",
      values: [-30, -12, -12, -39, -42, -42, -44, 14, 51, -2, -37, -189, -198],
    },
    {
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

  const months = [
    "janv. 24",
    "fév. 24",
    "mars 24",
    "avr. 24",
    "mai 24",
    "juin 24",
    "juil. 24",
    "août 24",
    "sept. 24",
    "oct. 24",
    "nov. 24",
    "déc. 24",
    "Cumul à fin nov. 24",
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Tableau de Suivi - Groupe A
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }} aria-label="dashboard table">
          <TableHead>
            <TableRow>
              <TableCell>A date :</TableCell>
              {months.map((month, index) => (
                <TableCell key={index} align="center" sx={{ fontWeight: "bold", backgroundColor: "#003366", color: "#fff" }}>
                  {month}
                </TableCell>
              ))}
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

export default DashboardTable;
