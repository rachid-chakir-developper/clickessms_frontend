import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar,} from '@mui/material';
import { GET_CLIENT } from '../../../../_shared/graphql/queries/ClientQueries';
import { getFormatDateTime } from '../../../../_shared/tools/functions';

export default function ClientDetails() {
  let { idClient } = useParams();
  const [getClient, { loading : loadingClient, data: clientData }] = useLazyQuery(GET_CLIENT)
React.useEffect(()=>{
    if(idClient){
        getClient(({ variables: { id: idClient } }));
    }
}, [idClient])

  return (
    <Stack>
        {clientData?.client && <ClientDetailsPage client={clientData?.client} />}
    </Stack>
  );
}


const ClientDetailsPage = ({ client }) => {
  const {
    id,
    photo,
    coverImage,
    number,
    externalNumber,
    name,
    managerName ,
    clientType,
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
    updatedAt
  } = client;

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
              boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2) inset'
            }}
          >
            <Avatar
                src={photo}
                alt={name}
                sx={{
                  width: 100, height: 100,
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
              {address && address!=='' && <Typography variant="body2">
                  {address}
              </Typography>}
              {clientType && clientType!=='' && <Typography variant="body2">
                Type: 
                  {clientType === 'BUSINESS' && <b> Entreprise</b>}
                  {clientType === 'INDIVIDUAL' && <b> Particulier</b>}
              </Typography>}
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {email}
              </Typography>
              {mobile && mobile!=='' && <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {mobile}
              </Typography>}
              {fix && fix!=='' && <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {fix}
              </Typography>}
            </Box>
          </Box>
        </Paper>
      </Grid>
      {/* Autres informations de l'employé */}
      <Grid item xs={12} sm={8}>
        <Paper sx={{ padding : 2}}>
          <Typography variant="h6" gutterBottom>
            Informations supplémentaires
          </Typography>
          <Paper sx={{ padding : 2}} variant="outlined">
            <Typography variant="body1">
              Réference: {number}
            </Typography>
            <Typography variant="body1">
              Réference sur SAGE: {externalNumber}
            </Typography>
            <Typography variant="body1">
              Nom de responsable: {managerName}
            </Typography>
            <Divider sx={{marginTop : 2, marginBottom : 2}}/>
            <Typography variant="body1">
                Ajouté le: {getFormatDateTime(createdAt)}
            </Typography>
            <Typography variant="body1">
                Dernière modification: {getFormatDateTime(updatedAt)}
            </Typography>
          </Paper>
          <Typography variant="h6" gutterBottom sx={{ mt:3 }}>
            Informations Bancaires
          </Typography>
          <Paper sx={{ padding : 2}} variant="outlined">
            <Typography variant="body1">
              IBAN: {iban}
            </Typography>
            <Typography variant="body1">
              BIC: {bic}
            </Typography>
            <Typography variant="body1">
              Nom de la banque: {bankName}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding : 2}}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Paper sx={{ padding : 2}} variant="outlined">
            <Typography variant="body1">
              {description ? description : "Aucune description pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding : 2}}>
          <Typography variant="h6" gutterBottom>
            Observation
          </Typography>
          <Paper sx={{ padding : 2}} variant="outlined">
            <Typography variant="body1">
              {observation ? observation : "Aucune observation pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
    </Grid>
  );
};
