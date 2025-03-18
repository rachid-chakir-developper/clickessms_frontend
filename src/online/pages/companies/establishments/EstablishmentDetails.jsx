import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
import { GET_RECAP_ESTABLISHMENT } from '../../../../_shared/graphql/queries/EstablishmentQueries';
import { getFormatDate, getFormatDateTime, getMeasurementActivityUnitLabel } from '../../../../_shared/tools/functions';
import styled from '@emotion/styled';
import EstablishmentItemCard from './EstablishmentItemCard';
import { Edit, ArrowBack, Business, LocationOn, Phone, Email, Language, Description, Note, Info, AccountBox, GroupWork } from '@mui/icons-material';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/associations/structures/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
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
    finess,
    apeCode,
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
    fax,
    email,
    webSite,
    otherContacts,
    description,
    observation,
    createdAt,
    updatedAt,
    establishmentParent,
    establishmentChilds,
    managers,
    activityAuthorizations
  } = establishment;

  return (
    <Grid container spacing={3}>
      {/* Informations de l'établissement */}
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
              <Typography variant="h6" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 1, fontSize: 'small' }} /> {siret}
              </Typography>
              <Typography variant="body2">{`Capacité actuelle: ${currentCapacity} dont temporaire: ${currentTemporaryCapacity}`}</Typography>
              {address && address !== '' && (
                <Typography variant="body2" sx={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
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
              <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Email sx={{ mr: 1, fontSize: 'small' }} /> {email}
              </Typography>
              {webSite && webSite !== '' && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Language sx={{ mr: 1, fontSize: 'small' }} /> {webSite}
                </Typography>
              )}
              {mobile && mobile !== '' && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone sx={{ mr: 1, fontSize: 'small' }} /> Mobile: {mobile}
                </Typography>
              )}
              {fix && fix !== '' && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone sx={{ mr: 1, fontSize: 'small' }} /> Fixe: {fix}
                </Typography>
              )}
              {fax && fax !== '' && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone sx={{ mr: 1, fontSize: 'small' }} /> Fax: {fax}
                </Typography>
              )}
              <Typography variant="body2">{`Unité de mesure de l'activité: ${getMeasurementActivityUnitLabel(measurementActivityUnit)}`}</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
      {/* Autres informations de l'établissement */}
      <Grid item xs={12} sm={8}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Info sx={{ mr: 1 }} /> Informations supplémentaires
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /> Référence: {number}
            </Typography>
            {finess && (
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} /> N° FINESS: {finess}
              </Typography>
            )}
            {apeCode && (
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} /> Code APE: {apeCode}
              </Typography>
            )}
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /> Ajouté le: {getFormatDateTime(createdAt)}
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /> Dernière modification: {getFormatDateTime(updatedAt)}
            </Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Info sx={{ mr: 1, fontSize: 'small' }} /> Date d'ouverture: {getFormatDate(openingDate)}
            </Typography>
            {otherContacts && (
              <>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 'small' }} /> Autres contacts: {otherContacts}
                </Typography>
              </>
            )}
          </Paper>
        </Paper>
        
        {(description || observation) && (
          <Paper sx={{ padding: 2, mt: 2 }}>
            {description && (
              <>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Description sx={{ mr: 1 }} /> Description
                </Typography>
                <Paper sx={{ padding: 2, mb: 2 }} variant="outlined">
                  <Typography variant="body1">
                    {description}
                  </Typography>
                </Paper>
              </>
            )}
            
            {observation && (
              <>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Note sx={{ mr: 1 }} /> Observation
                </Typography>
                <Paper sx={{ padding: 2 }} variant="outlined">
                  <Typography variant="body1">
                    {observation}
                  </Typography>
                </Paper>
              </>
            )}
          </Paper>
        )}
        
        {(establishmentParent || (establishmentChilds && establishmentChilds.length > 0)) && (
          <Paper sx={{ padding: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <GroupWork sx={{ mr: 1 }} /> Relations hiérarchiques
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              {establishmentParent && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Structure parente:</Typography>
                  <EstablishmentItemCard establishment={establishmentParent} />
                  <Divider sx={{ my: 2 }} />
                </>
              )}
              
              {establishmentChilds && establishmentChilds.length > 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Structures filles:</Typography>
                  <Grid container spacing={2}>
                    {establishmentChilds.map((child, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <EstablishmentItemCard establishment={child} />
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Paper>
          </Paper>
        )}
        
        {managers && managers.length > 0 && (
          <Paper sx={{ padding: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBox sx={{ mr: 1 }} /> Responsables
            </Typography>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Grid container spacing={2}>
                {managers.map((manager, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <EmployeeItemCard employee={manager.employee} />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Paper>
        )}
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2 }}>
          <EstablishmentTabs establishment={establishment}/>
        </Paper>
      </Grid>
    </Grid>
  );
};
