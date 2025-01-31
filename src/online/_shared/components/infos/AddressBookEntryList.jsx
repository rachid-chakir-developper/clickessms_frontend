import React from "react";
import { Card, CardContent, CardHeader, Typography, Grid } from "@mui/material";
import { getFormatDate } from "../../../../_shared/tools/functions";

const AddressBookEntryList = ({ addressBookEntries = [] }) => {
  return (
    <Grid container spacing={2}>
      {addressBookEntries.length === 0 ? (
        <Typography variant="body1" sx={{ padding: 2 }}>
          Aucun contact disponible.
        </Typography>
      ) : (
        addressBookEntries.map((entry) => (
          <Grid item xs={12} sm={6} md={4} key={entry.id}>
            <Card variant="outlined">
              <CardHeader
                title={entry.title || ""}
                subheader={`${entry?.firstName || ""} ${entry?.lastName || ""}`}
                titleTypographyProps={{
                    sx: { fontWeight: "bold"},
                }}
                subheaderTypographyProps={{
                    sx: { fontStyle: "italic" },
                }}
              />
              <CardContent>
                <Typography variant="body2">
                  <strong>Adresse:</strong> {entry.fullAddress}
                </Typography>
                <Typography variant="body2">
                  <strong>Mobile:</strong> {entry.mobile}
                </Typography>
                {entry.fix && <Typography variant="body2">
                  <strong>Fixe:</strong> {entry.fix || ""}
                </Typography>}
                {entry.fax && <Typography variant="body2">
                  <strong>Fax:</strong> {entry.fax || ""}
                </Typography>}
                {entry.createdAt && <Typography variant="caption" color="text.secondary">
                  Créé le : {getFormatDate(entry.createdAt)}
                </Typography>}
                {entry.updatedAt && <Typography variant="caption" color="text.secondary">
                  Mis à jour le : {getFormatDate(entry.updatedAt)}
                </Typography>}
                <Typography variant="body2">
                  <strong>Email:</strong> {entry.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Note:</strong> {entry.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default AddressBookEntryList;
