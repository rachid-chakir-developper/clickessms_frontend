import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import { GET_ESTABLISHMENT } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import styled from '@emotion/styled';
import EstablishmentItemCard from './EstablishmentItemCard';
import { Edit } from '@mui/icons-material';

const Item = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function EstablishmentDetails() {
  let { idEstablishment } = useParams();
  const [
    getEstablishment,
    { loading: loadingEstablishment, data: establishmentData },
  ] = useLazyQuery(GET_ESTABLISHMENT);
  React.useEffect(() => {
    if (idEstablishment) {
      getEstablishment({ variables: { id: idEstablishment } });
    }
  }, [idEstablishment]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 1 }}>
        <Link
          to={`/online/associations/structures/modifier/${establishmentData?.establishment?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      {establishmentData?.establishment && (
        <EstablishmentDetailsPage
          establishment={establishmentData?.establishment}
        />
      )}
    </Stack>
  );
}
const EstablishmentDetailsPage = ({ establishment }) => {
  const {
    id,
    logo,
    coverImage,
    number,
    name,
    siret,
    managerName,
    establishmentType,
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
    establishmentChilds,
    establishmentParent,
    isActive,
    createdAt,
    updatedAt,
  } = establishment;

  return (
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
              src={logo}
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
              <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
                {siret}
              </Typography>
              {address && address !== '' && (
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  {address} {additionalAddress} <br />
                  {zipCode} {city}
                </Typography>
              )}
              {establishmentType && establishmentType !== '' && (
                <Typography variant="body2">
                  Type: {establishmentType?.name}
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
          {establishmentParent && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Etablissement parent
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Item>
                  <EstablishmentItemCard establishment={establishmentParent} />
                </Item>
              </Paper>
            </>
          )}
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
      {establishmentChilds?.length > 0 && (
        <Grid item xs={12} sm={12}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Les structures fils
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                {establishmentChilds?.map((establishment, index) => (
                  <Grid xs={2} sm={4} md={3} key={index}>
                    <Item>
                      <EstablishmentItemCard establishment={establishment} />
                    </Item>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};
