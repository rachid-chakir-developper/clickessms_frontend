import React from "react";
import { Card, CardContent, CardHeader, Typography, Grid } from "@mui/material";
import { getCareerEntryLabel, getFormatDate } from "../../../../_shared/tools/functions";

const CareerEntryList = ({ careerEntries = [] }) => {
  return (
    <Grid container spacing={2}>
      {careerEntries.length === 0 ? (
        <Typography variant="body1" sx={{ padding: 2 }}>
          Aucune entrée de carrière disponible.
        </Typography>
      ) : (
        careerEntries.map((entry) => (
          <Grid item xs={12} sm={6} md={4} key={entry.id}>
            <Card variant="outlined">
              <CardHeader
                title={entry.title || "Intitulé du poste inconnu"}
                subheader={`${entry.institution || "Institution non renseignée"}`}
                titleTypographyProps={{
                  sx: { fontWeight: "bold" },
                }}
                subheaderTypographyProps={{
                  sx: { fontStyle: "italic" },
                }}
              />
              <CardContent>
                <Typography variant="body2">
                  <strong>Type :</strong> {getCareerEntryLabel(entry.careerType)}
                </Typography>
                <Typography variant="body2">
                  <strong>Statut professionnel :</strong> {entry.professionalStatus?.name || ""}
                </Typography>
                <Typography variant="body2">
                    <strong>Début :</strong> {getFormatDate(entry.startingDate)}
                </Typography>
                <Typography variant="body2">
                    <strong>Fin :</strong> {getFormatDate(entry.endingDate)}
                </Typography>
                <Typography variant="body2">
                  <strong>Email :</strong> {entry.email || ""}
                </Typography>
                <Typography variant="body2">
                  <strong>Adresse :</strong> {entry.fullAddress || ""}
                </Typography>
                {entry.city && <Typography variant="body2">
                  <strong>Ville :</strong> {entry.city || ""}, {entry.country || "Pays inconnu"}
                </Typography>}
                <Typography variant="body2">
                  <strong>Téléphone :</strong> {entry.mobile || ""}
                </Typography>
                {entry.fix && (
                  <Typography variant="body2">
                    <strong>Fixe :</strong> {entry.fix}
                  </Typography>
                )}
                {entry.fax && (
                  <Typography variant="body2">
                    <strong>Fax :</strong> {entry.fax}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Détail :</strong> {entry.description || "Aucune description"}
                </Typography>
                {entry.createdAt && (
                  <Typography variant="caption" color="text.secondary">
                    Créé le : {getFormatDate(entry.createdAt)}
                  </Typography>
                )}
                {entry.updatedAt && (
                  <Typography variant="caption" color="text.secondary">
                    Mis à jour le : {getFormatDate(entry.updatedAt)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default CareerEntryList;
