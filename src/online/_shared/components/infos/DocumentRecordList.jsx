import React from "react";
import { Card, CardContent, CardHeader, Typography, Grid, Link } from "@mui/material";
import { getFormatDate } from "../../../../_shared/tools/functions";

const DocumentRecordList = ({ documentRecords = [] }) => {
  return (
    <Grid container spacing={2}>
      {documentRecords.length === 0 ? (
        <Typography variant="body1" sx={{ padding: 2 }}>
          Aucun document disponible.
        </Typography>
      ) : (
        documentRecords.map((record) => (
          <Grid item xs={12} sm={6} md={4} key={record.id}>
            <Card variant="outlined">
              <CardHeader
                title={record.name || "Document sans nom"}
                subheader={record.documentType?.name || "Type inconnu"}
                titleTypographyProps={{
                  sx: { fontWeight: "bold" },
                }}
                subheaderTypographyProps={{
                  sx: { fontStyle: "italic" },
                }}
              />
              <CardContent>
                {record.document && (
                  <Typography variant="body2">
                    <strong>Fichier :</strong>{" "}
                    <Link href={record.document} target="_blank" rel="noopener noreferrer">
                      Télécharger
                    </Link>
                  </Typography>
                )}
                {record.startingDate && (
                  <Typography variant="body2">
                    <strong>Début :</strong> {getFormatDate(record.startingDate)}
                  </Typography>
                )}
                {record.endingDate && (
                  <Typography variant="body2">
                    <strong>Valide jusqu'à :</strong> {getFormatDate(record.endingDate)}
                  </Typography>
                )}
                <Typography variant="body2">
                  <strong>Notification activée :</strong> {record.isNotificationEnabled ? "Oui" : "Non"}
                </Typography>
                <Typography variant="body2">
                  <strong>Description :</strong> {record.description || "Aucune description"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default DocumentRecordList;
