import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, List, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import { GET_SUPPLIER } from '../../../../_shared/graphql/queries/SupplierQueries';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import { Edit } from '@mui/icons-material';

export default function SupplierDetails() {
  let { idSupplier } = useParams();
  const [getSupplier, { loading: loadingSupplier, data: supplierData }] =
    useLazyQuery(GET_SUPPLIER);
  React.useEffect(() => {
    if (idSupplier) {
      getSupplier({ variables: { id: idSupplier } });
    }
  }, [idSupplier]);

  return (
    <Stack>
      {supplierData?.supplier && (
        <SupplierDetailsPage supplier={supplierData?.supplier} />
      )}
    </Stack>
  );
}

const SupplierDetailsPage = ({ supplier }) => {
  const {
    id,
    photo,
    coverImage,
    number,
    externalNumber,
    name,
    managerName,
    supplierType,
    latitude,
    longitude,
    city,
    zipCode,
    address,
    mobile,
    fix,
    fax,
    email,
    webSite,
    otherContacts,
    iban,
    bic,
    bankName,
    description,
    observation,
    isActive,
    createdAt,
    updatedAt,
  } = supplier;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Box sx={{marginX: 2}}>
          <Link
            to={`/online/achats/fournisseurs/liste`}
            className="no_style"
          >
            <Button variant="text" startIcon={<List />}  size="small">
              Retour à la Liste
            </Button>
          </Link>
        </Box>
        <Link to={`/online/achats/fournisseurs/modifier/${id}`} className="no_style">
          <Button variant="outlined" startIcon={<Edit />} size="small">
            Modifier
          </Button>
        </Link>
      </Box>
      <Grid container spacing={3}>
        {/* Informations de l'employé */}
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundImage: `url(${coverImage})`, // Ajoutez l'image d'arrière-plan ici
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 1),
            }}
          >
            <Box
              sx={{
                py: 1.2,
                px: 2,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
                boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2) inset',
              }}
            >
              <Avatar
                src={photo}
                alt={name}
                sx={{
                  width: 100,
                  height: 100,
                  boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', // Ajoutez l'ombre extérieure ici
                  border: '2px solid white', // Ajoutez une bordure blanche autour de l'avatar si nécessaire
                }}
              />
              <Box
                sx={{
                  mt: 1,
                  width: '100%',
                  display: 'flex',
                  borderRadius: 1.5,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: (theme) => theme.palette.primary.contrastText,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  {name}
                </Typography>
                {address && address !== '' && (
                  <Typography variant="body2">{address}</Typography>
                )}
                {supplierType && supplierType !== '' && (
                  <Typography variant="body2">
                    Type:
                    {supplierType === 'BUSINESS' && <b> Entreprise</b>}
                    {supplierType === 'INDIVIDUAL' && <b> Particulier</b>}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {email}
                </Typography>
                {mobile && mobile !== '' && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {mobile}
                  </Typography>
                )}
                {fix && fix !== '' && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {fix}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
        {/* Autres informations de l'employé */}
        <Grid item xs={12} sm={8}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Informations supplémentaires
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="body1">Réference: {number}</Typography>
              <Typography variant="body1">
                Réference sur SAGE: {externalNumber}
              </Typography>
              <Typography variant="body1">
                Nom de responsable: {managerName}
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body1">
                Ajouté le: {getFormatDateTime(createdAt)}
              </Typography>
              <Typography variant="body1">
                Dernière modification: {getFormatDateTime(updatedAt)}
              </Typography>
            </Paper>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Informations Bancaires
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="body1">IBAN: {iban}</Typography>
              <Typography variant="body1">BIC: {bic}</Typography>
              <Typography variant="body1">
                Nom de la banque: {bankName}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="body1">
                {description ? description : "Aucune description pour l'instant"}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Observation
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="body1">
                {observation ? observation : "Aucune observation pour l'instant"}
              </Typography>
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
