import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import EstablishmentChip from "../../companies/establishments/EstablishmentChip";

const SynthesisEstablishmentsTableItem = ({activitySynthesisEstablishment}) => {
  const dataEffectif = [
    { nom: "ARANDA Nolan", admission: false },
    { nom: "BELLOUR Emma", admission: false },
    { nom: "BERSOT Louna", admission: false },
    { nom: "FONTEIX Chloé", admission: false },
    { nom: "FRETEY Louna", admission: false },
    { nom: "LEDOUX Nolhan", admission: false },
    { nom: "ROMULUS Ysadjay", admission: false },
    { nom: "VIGO Léa", admission: false },
  ];

  const dataDemandes = [
    {
      dateDemande: "12/01/2024",
      nom: "LEDAIN Sullyvan",
      admission: null,
      refus: "06/02/2024",
      motif: "besoin d'accompagnement individuel",
    },
    {
      dateDemande: "17/01/2024",
      nom: "PALMAR Louane",
      admission: "12/03/2024",
      refus: null,
      motif: "",
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Année : {activitySynthesisEstablishment?.year}</Typography>
        {activitySynthesisEstablishment?.establishment ? 
        <EstablishmentChip establishment={activitySynthesisEstablishment?.establishment} /> 
        : <Typography variant="h6" gutterBottom>{activitySynthesisEstablishment?.title}</Typography>}
        <Grid container spacing={2} sx={{marginY: 1}}>
            {/* Tableau 1 : Effectif */}
            <Grid item xs={3}>
            <TableContainer component={Paper}>
                <Typography
                variant="subtitle1"
                align="center"
                sx={{ fontWeight: "bold", py: 1 }}
                >
                Effectif au 31/01/2024
                </Typography>
                <Table>
                <TableBody>
                    {dataEffectif.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell style={{ color: row.admission ? "green" : "red" }}>
                        {row.nom}
                        </TableCell>
                    </TableRow>
                    ))}
                    <TableRow>
                    <TableCell style={{ color: "red" }}>4 places</TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </TableContainer>
            </Grid>

            {/* Tableau 2 : Demandes */}
            <Grid item xs={9}>
            <TableContainer component={Paper}>
                <Typography
                variant="subtitle1"
                align="center"
                sx={{ fontWeight: "bold", py: 1 }}
                >
                Demandes d'admission
                </Typography>
                <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Date de demande</TableCell>
                    <TableCell>Nom - Prénom</TableCell>
                    <TableCell>Admission le</TableCell>
                    <TableCell>Refus le</TableCell>
                    <TableCell>Motif</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataDemandes.map((demande, index) => (
                    <TableRow key={index}>
                        <TableCell>{demande.dateDemande}</TableCell>
                        <TableCell>{demande.nom}</TableCell>
                        <TableCell style={{ color: demande.admission ? "green" : "" }}>
                        {demande.admission || ""}
                        </TableCell>
                        <TableCell style={{ color: demande.refus ? "red" : "" }}>
                        {demande.refus || ""}
                        </TableCell>
                        <TableCell>{demande.motif || ""}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
            </Grid>
        </Grid>
    </Box>
  );
};


const SynthesisEstablishmentsTable = ({ activitySynthesis }) => {
    const {activitySynthesisEstablishments=[]} = activitySynthesis
    return (
        <Box sx={{ flexGrow: 1, marginTop: 2 }}>
            {activitySynthesisEstablishments?.map((activitySynthesisEstablishment, index) => (
                <Box key={index} sx={{backgroundColor: index % 2 === 0 ? "#f7f7f7" : "#e0e0e0"}}>
                    <SynthesisEstablishmentsTableItem activitySynthesisEstablishment={activitySynthesisEstablishment} />
                </Box>
            ))}
        </Box>
    );
};

export default SynthesisEstablishmentsTable;