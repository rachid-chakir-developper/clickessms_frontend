import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import { GET_FINANCIER } from '../../../../_shared/graphql/queries/FinancierQueries';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import { Edit, ArrowBack, Business, Person, AccountBalance, LocationOn, Phone, Email, Language, Description, Note, Info, AttachMoney } from '@mui/icons-material';
import OpenLibraryButton from '../../../_shared/components/library/OpenLibraryButton ';

export default function FinancierDetails() {
  let { idFinancier } = useParams();
  const [getFinancier, { loading: loadingFinancier, data: financierData }] =
    useLazyQuery(GET_FINANCIER);
  React.useEffect(() => {
    if (idFinancier) {
      getFinancier({ variables: { id: idFinancier } });
    }
  }, [idFinancier]);

  return (
    <Stack>
      {financierData?.financier && (
        <FinancierDetailsPage financier={financierData?.financier} />
      )}
    </Stack>
  );
}

const FinancierDetailsPage = ({ financier }) => {
  const {
    id,
    photo,
    coverImage,
    number,
    folder,
    externalNumber,
    name,
    managerName,
    financierType,
    latitude,
    longitude,
    city,
    zipCode,
    address,
    additionalAddress,
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
  } = financier;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/partenariats/financeurs/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link to={`/online/partenariats/financeurs/modifier/${id}`} className="no_style">
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      <Grid container spacing={3}>
        {/* Informations du financeur */}
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
                  <Typography variant="body2" sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
                    {address} {additionalAddress && additionalAddress} <br />
                    {zipCode} {city}
                  </Typography>
                )}
                {financierType && financierType !== '' && (
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Business sx={{ mr: 1, fontSize: 'small' }} />Type:
                    {financierType === 'BUSINESS' && <b> Entreprise</b>}
                    {financierType === 'INDIVIDUAL' && <b> Particulier</b>}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Email sx={{ mr: 1, fontSize: 'small' }} />{email}
                </Typography>
                {webSite && webSite !== '' && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Language sx={{ mr: 1, fontSize: 'small' }} />{webSite}
                  </Typography>
                )}
                {mobile && mobile !== '' && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone sx={{ mr: 1, fontSize: 'small' }} />Mobile: {mobile}
                  </Typography>
                )}
                {fix && fix !== '' && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone sx={{ mr: 1, fontSize: 'small' }} />Fixe: {fix}
                  </Typography>
                )}
                {fax && fax !== '' && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone sx={{ mr: 1, fontSize: 'small' }} />Fax: {fax}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
        {/* Autres informations du financeur */}
        <Grid item xs={12} sm={8}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Info sx={{ mr: 1 }} />Informations supplémentaires
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} />Référence: {number}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} />Référence sur SAGE: {externalNumber}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Person sx={{ mr: 1, fontSize: 'small' }} />Nom du responsable: {managerName}
              </Typography>
              {otherContacts && (
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 'small' }} />Autres contacts: {otherContacts}
                </Typography>
              )}
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} />Ajouté le: {getFormatDateTime(createdAt)}
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} />Dernière modification: {getFormatDateTime(updatedAt)}
              </Typography>
              <OpenLibraryButton folderParent={folder} />
            </Paper>
          </Paper>
          
          {/* Informations bancaires */}
          {(iban || bic || bankName) && (
            <Paper sx={{ padding: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 1 }} />Informations bancaires
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                {iban && (
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, fontSize: 'small' }} />IBAN: {iban}
                  </Typography>
                )}
                {bic && (
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AttachMoney sx={{ mr: 1, fontSize: 'small' }} />BIC: {bic}
                  </Typography>
                )}
                {bankName && (
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccountBalance sx={{ mr: 1, fontSize: 'small' }} />Banque: {bankName}
                  </Typography>
                )}
              </Paper>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1 }} />Description
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
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Note sx={{ mr: 1 }} />Observation
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
