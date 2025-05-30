import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, List as ListComponent, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar } from '@mui/material';
// Assurez-vous d'importer dayjs si vous l'utilisez pour la gestion des dates

import { GET_BENEFICIARY_RECAP } from '../../../../_shared/graphql/queries/BeneficiaryQueries';
import {
  getFormatDate,
  getFormatDateTime,
  getGenderLabel,
} from '../../../../_shared/tools/functions';
import { Edit, ArrowBack, List as ListIcon } from '@mui/icons-material';
import BeneficiaryTabs from './beneficiary-tabs/BeneficiaryTabs';
import CustomFieldValuesDetails from '../../../../_shared/components/form-fields/costum-fields/CustomFieldValuesDetails';
import { useAuthorizationSystem } from '../../../../_shared/context/AuthorizationSystemProvider';
import OpenLibraryButton from '../../../_shared/components/library/OpenLibraryButton ';

export default function BeneficiaryDetails() {
  const authorizationSystem = useAuthorizationSystem();
  const canManageBeneficiaries = authorizationSystem.requestAuthorization({
    type: 'manageBeneficiaries',
  }).authorized;
  let { idBeneficiary } = useParams();
  const [
    getBeneficiary,
    { loading: loadingBeneficiary, data: beneficiaryData },
  ] = useLazyQuery(GET_BENEFICIARY_RECAP);
  React.useEffect(() => {
    if (idBeneficiary) {
      getBeneficiary({ variables: { id: idBeneficiary } });
    }
  }, [idBeneficiary]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/ressources-humaines/beneficiaires/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        {canManageBeneficiaries && <Box>
          <Link
            to={`/online/ressources-humaines/beneficiaires/modifier/${beneficiaryData?.beneficiary?.id}`}
            className="no_style"
          >
            <Button variant="outlined" endIcon={<Edit />}>
              Modifier
            </Button>
          </Link>
        </Box>}
      </Box>
      {beneficiaryData?.beneficiary && (
        <BeneficiaryDetailsPage beneficiary={beneficiaryData?.beneficiary} />
      )}
    </Stack>
  );
}

const BeneficiaryDetailsPage = ({ beneficiary }) => {
  const {
    id,
    gender,
    photo,
    coverImage,
    number,
    folder,
    preferredName,
    firstName,
    lastName,
    birthDate,
    age,
    birthCity,
    birthCountry,
    nationality,
    professionalStatus,
    city,
    zipCode,
    address,
    mobile,
    fix,
    fax,
    email,
    createdAt,
    updatedAt,
  } = beneficiary;

  return (
    <Grid container spacing={3}>
      {/* Informations de la personne accompagnée */}
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
              alt={firstName}
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
              <Typography variant="body2">Genre: {getGenderLabel(gender)}</Typography>
              <Typography variant="h5" gutterBottom>
                {`${firstName} ${preferredName && preferredName !== '' ? preferredName : lastName}`}
              </Typography>
              <Typography variant="body2">{`Nom de naissance: ${lastName}`}</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{getFormatDate(birthDate)} (âge: {age})</Typography>
              {address && address !== '' && (
                <Typography variant="body2">{address}</Typography>
              )}
              <Typography variant="body2">{zipCode} {city}</Typography>
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
      {/* Autres informations de la personne accompagnée */}
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
              Date de naissance: {getFormatDate(birthDate)}<br />
              Âge: {age}<br />
              Ville de naissance: {birthCity}<br />
              Pays de naissance: {birthCountry}<br />
              Nationnalité: {nationality}<br />
              Statut professionnel: {professionalStatus?.name}
            </Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <OpenLibraryButton folderParent={folder} />
          </Paper>
          <CustomFieldValuesDetails formModel="Beneficiary" idObject={id} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2 }}>
          <BeneficiaryTabs beneficiary={beneficiary}/>
        </Paper>
      </Grid>
    </Grid>
  );
};
