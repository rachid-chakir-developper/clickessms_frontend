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
} from "@mui/material";

const ActivityTable = () => {
  const data = {
    groups: [
      { name: "Groupe A", capacity: 12, outside: 0, occupied: 10, available: 2, ages: "15-17 ans" },
      { name: "Groupe B", capacity: 11, outside: 1, occupied: 11, available: 0, ages: "12-15 ans" },
      { name: "Groupe C", capacity: 11, outside: 1, occupied: 8, available: 3, ages: "6-12 ans" },
      { name: "Groupe grands mineurs - Jeunes Majeurs", capacity: 12, outside: 0, occupied: 8, available: 4, ages: "17-20 ans" },
    ],
    totals: { capacity: 46, outside: 2, occupied: 37, available: 9 },
    presentList: [
      { name: "ANDRE Loeiza", dob: "29/05/2008", entryDate: "19/01/2024", exitDate: "31/01/2025", counselor: "Mme FRERET" },
      { name: "DEPRUN Rachel", dob: "22/09/2006", entryDate: "01/03/2024", exitDate: "21/09/2025", counselor: "Mme BROSSET" },
      { name: "FIQUET Abigaelle", dob: "13/06/2007", entryDate: "21/12/2018", exitDate: "13/06/2025", counselor: "Mme NOLTINCX" },
      // Ajoutez plus de données ici
    ],
  };

  return (
    <Paper sx={{ padding: "20px", marginY: 3 }}>
      <Typography variant="h6" gutterBottom align="center">
        Capacité CD27
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Groupe</TableCell>
              <TableCell align="center">Capacité</TableCell>
              <TableCell align="center">Places Hors département</TableCell>
              <TableCell align="center">Places occupées</TableCell>
              <TableCell align="center">Places disponibles</TableCell>
              <TableCell align="center">Âges</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.groups.map((group, index) => (
              <TableRow key={index}>
                <TableCell>{group.name}</TableCell>
                <TableCell align="center">{group.capacity}</TableCell>
                <TableCell align="center">{group.outside}</TableCell>
                <TableCell align="center">{group.occupied}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: group.available < 0 ? "red" : "green",
                  }}
                >
                  {group.available}
                </TableCell>
                <TableCell align="center">{group.ages}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#ffe0b2" }}>
              <TableCell>Sous-total</TableCell>
              <TableCell align="center">{data.totals.capacity}</TableCell>
              <TableCell align="center">{data.totals.outside}</TableCell>
              <TableCell align="center">{data.totals.occupied}</TableCell>
              <TableCell align="center">{data.totals.available}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" gutterBottom align="center" sx={{ marginTop: "20px" }}>
        Liste des présents
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#424242", color: "#ffffff" }}>
              <TableCell sx={{ color: "white" }}>Nom Prénom</TableCell>
              <TableCell sx={{ color: "white" }}>Date de naissance</TableCell>
              <TableCell sx={{ color: "white" }}>Date d'entrée dans le service</TableCell>
              <TableCell sx={{ color: "white" }}>Date de sortie</TableCell>
              <TableCell sx={{ color: "white" }}>IEF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.presentList.map((person, index) => (
              <TableRow key={index}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.dob}</TableCell>
                <TableCell>{person.entryDate}</TableCell>
                <TableCell>{person.exitDate}</TableCell>
                <TableCell>{person.counselor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ActivityTable;
