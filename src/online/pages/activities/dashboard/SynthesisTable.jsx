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
import EstablishmentChip from "../../companies/establishments/EstablishmentChip";

const data = [
  {
    mois: "Janvier",
    groupeA: { dispo: 1, recu: 1, af: 1, ad: 1, an: 1 },
    groupeB: { dispo: 1, recu: 5, af: 1, ad: 2, an: 2 },
    groupeC: { dispo: 2, recu: 4, af: 2, ad: 1, an: 1 },
    pava: { dispo: 4, recu: 0, af: 0, ad: 0, an: 0 },
    total: 25,
  },
  {
    mois: "Février",
    groupeA: { dispo: 0, recu: 1, af: 0, ad: 1, an: 1 },
    groupeB: { dispo: 0, recu: 3, af: 2, ad: 3, an: 2 },
    groupeC: { dispo: 1, recu: 3, af: 2, ad: 1, an: 2 },
    pava: { dispo: 3, recu: 0, af: 0, ad: 0, an: 0 },
    total: 18,
  },
  // Ajoutez d'autres mois ici...
];

const SynthesisTable = ({activitySynthesis}) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" align="center" sx={{ margin: 2 }}>
        Demandes d'admission reçues
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">MOIS</TableCell>
            {activitySynthesis?.activitySynthesisEstablishments?.map((activitySynthesisEstablishment, index)=> 
                <TableCell key={index} align="center" colSpan={5}>
                    <EstablishmentChip establishment={activitySynthesisEstablishment?.establishment} /> 
                </TableCell>
            )}
            <TableCell align="center">TOTAL</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center"></TableCell>
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
                </React.Fragment>
            ))}
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activitySynthesis?.months?.map((month, indexMonth) => (
            <TableRow key={indexMonth}>
                <TableCell align="center">{month}</TableCell>
                {activitySynthesis?.activitySynthesisEstablishments?.map((activitySynthesisEstablishment, indexA) => {
                        const activitySynthesisMonthItem = activitySynthesisEstablishment?.activitySynthesisMonth[indexMonth]
                        return (
                            <React.Fragment key={indexA}>
                                {[
                                    "Dispo",
                                    "countReceived",
                                    "countApproved",
                                    "countRejected",
                                    "countCanceled",
                                    ].map((item, index) => (
                                        <TableCell key={index} align="center">
                                            {activitySynthesisMonthItem[item]}
                                        </TableCell>
                                    ))}
                            </React.Fragment>
                        )
                    }
                )}
                <TableCell align="center"></TableCell>
            </TableRow>
          ))}
          <TableRow>
              <TableCell align="center"></TableCell>
              {activitySynthesis?.activitySynthesisEstablishments?.map((activitySynthesisEstablishment, indexA) => {
                      const activityTotalSynthesisMonth = activitySynthesisEstablishment?.activityTotalSynthesisMonth
                      return (
                          <React.Fragment key={indexA}>
                              {[
                                  "Dispo",
                                  "totalReceived",
                                  "totalApproved",
                                  "totalRejected",
                                  "totalCanceled",
                                  ].map((item, index) => (
                                      <TableCell key={index} align="center">
                                          {activityTotalSynthesisMonth[item]}
                                      </TableCell>
                                  ))}
                          </React.Fragment>
                      )
                  }
              )}
              <TableCell align="center"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SynthesisTable;
