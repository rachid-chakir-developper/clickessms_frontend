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
  Alert,
} from "@mui/material";
import { getFormatDate } from "../../../../_shared/tools/functions";
import EstablishmentChip from "../../companies/establishments/EstablishmentChip";

const ActivityTable = ({activityMonth}) => {
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
  const activityMonthEstablishments = activityMonth?.activityMonthEstablishments || []
  return (
    <Paper sx={{ padding: "20px", marginY: 3 }}>
      <Typography variant="h6" gutterBottom align="center">
        {activityMonth?.title}
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
          {activityMonthEstablishments?.map((activityMonthEstablishment, indexE) => (
              <TableRow key={indexE}>
                <TableCell>{activityMonthEstablishment?.establishment?.name}</TableCell>
                <TableCell align="center">{activityMonthEstablishment?.capacity}</TableCell>
                <TableCell align="center">{activityMonthEstablishment?.countOutsidePlacesDepartment}</TableCell>
                <TableCell align="center">{activityMonthEstablishment?.countOccupiedPlaces}</TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: activityMonthEstablishment?.countAvailablePlaces < 0 ? "red" : "green",
                  }}
                >
                  {activityMonthEstablishment?.countAvailablePlaces}
                </TableCell>
                <TableCell align="center">{activityMonthEstablishment?.agesText}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: "#ffe0b2" }}>
              <TableCell>Total</TableCell>
              <TableCell align="center">-</TableCell>
              <TableCell align="center">-</TableCell>
              <TableCell align="center">-</TableCell>
              <TableCell align="center">-</TableCell>
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
              <TableCell sx={{ color: "white" }}>Service</TableCell>
              <TableCell sx={{ color: "white" }}>Nom Prénom</TableCell>
              <TableCell sx={{ color: "white" }}>Date de naissance</TableCell>
              <TableCell sx={{ color: "white" }}>Date d'entrée dans le service</TableCell>
              <TableCell sx={{ color: "white" }}>Date de sortie</TableCell>
              <TableCell sx={{ color: "white" }}>Date d'échéance</TableCell>
              <TableCell sx={{ color: "white" }}>IEF</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityMonthEstablishments?.map((activityMonthEstablishment, indexE) => (
              <React.Fragment key={indexE}>
                {/* Ligne pour afficher le nom de l'établissement */}
                <TableRow style={{ backgroundColor: '#f1f1f1', fontWeight: 'bold' }}>
                  <TableCell colSpan={7}>
                    {activityMonthEstablishment?.establishment ? 
                              <EstablishmentChip establishment={activityMonthEstablishment?.establishment} /> 
                              : <Typography variant="h6" gutterBottom>{activityMonthEstablishment?.title}</Typography>}
                  </TableCell>
                </TableRow>
                {activityMonthEstablishment?.beneficiaryEntries?.length < 1 && <TableRow>
                  <TableCell colSpan={7}><Alert severity="warning">Aucune entrée trouvée.</Alert></TableCell>
                </TableRow>}

                {/* Lignes des bénéficiaires */}
                {activityMonthEstablishment?.beneficiaryEntries?.map((beneficiaryEntry, indexB) => {
                  const beneficiary = beneficiaryEntry?.beneficiary;
                  return (
                    <TableRow key={indexB}>
                      <TableCell></TableCell>
                      <TableCell>
                        {`${beneficiary?.firstName} ${
                          beneficiary?.preferredName && beneficiary?.preferredName !== ''
                            ? beneficiary?.preferredName
                            : beneficiary?.lastName
                        }`}
                      </TableCell>
                      <TableCell>{getFormatDate(beneficiary?.birthDate)}</TableCell>
                      <TableCell>{getFormatDate(beneficiaryEntry?.entryDate)}</TableCell>
                      <TableCell>{getFormatDate(beneficiaryEntry?.releaseDate)}</TableCell>
                      <TableCell>{getFormatDate(beneficiaryEntry?.dueDate)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  );
                })}
                <TableRow sx={{ backgroundColor: "#fdfdfd", fontWeight: 'bold'  }}>
                  <TableCell sx={{ fontWeight: 'bold'  }}>TOTAL: {activityMonthEstablishment?.establishment?.name}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold'  }} colSpan={3}>
                    Nombre de présent : {activityMonthEstablishment?.countOccupiedPlaces} / Nombre de places libre : {activityMonthEstablishment?.countAvailablePlaces}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold'  }} colSpan={3}>0 sorties d'ici la fin du mois</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ActivityTable;