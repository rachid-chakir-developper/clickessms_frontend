import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import { GET_RECAP_ESTABLISHMENT } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { getFormatDate, getFormatDateTime, getMeasurementActivityUnitLabel } from '../../../../_shared/tools/functions';
import styled from '@emotion/styled';
import EstablishmentItemCard from './EstablishmentItemCard';
import { Edit } from '@mui/icons-material';
import EmployeeItemCard from '../../human_ressources/employees/EmployeeItemCard';
import EstablishmentTabs from './establishments-tabs/EstablishmentTabs';

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
  ] = useLazyQuery(GET_RECAP_ESTABLISHMENT);
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
          <Button variant="outlined" endIcon={<Edit />} size="small">
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
    openingDate,
    currentCapacity,
    currentTemporaryCapacity,
    measurementActivityUnit,
    establishmentType,
    establishmentCategory,
    city,
    zipCode,
    address,
    additionalAddress,
    mobile,
    fix,
    email,
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
              <Typography variant="body2">{`Capacité actuelle: ${currentCapacity} dont temporaire: ${currentTemporaryCapacity}`}</Typography>
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
              {establishmentCategory && establishmentCategory !== '' && (
                <Typography variant="body2">
                  Catégorie: {establishmentCategory?.name}
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
              <Typography variant="body2">{`Unité de mesure de l'activité: ${getMeasurementActivityUnitLabel(measurementActivityUnit)}`}</Typography>
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
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              Ajouté le: {getFormatDateTime(createdAt)}
            </Typography>
            <Typography variant="body1">
              Dernière modification: {getFormatDateTime(updatedAt)}
            </Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              Date d'ouverture: {getFormatDate(openingDate)}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2 }}>
          <EstablishmentTabs establishment={establishment}/>
        </Paper>
      </Grid>
    </Grid>
  );
};
