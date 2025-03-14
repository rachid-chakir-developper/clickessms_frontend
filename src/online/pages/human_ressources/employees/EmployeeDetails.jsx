import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Box, Button, Divider, Paper, Stack, alpha } from '@mui/material';
import { Grid, Typography, Avatar, Chip } from '@mui/material';
// Assurez-vous d'importer dayjs si vous l'utilisez pour la gestion des dates

import { GET_RECAP_EMPLOYEE } from '../../../../_shared/graphql/queries/EmployeeQueries';
import {
  getFormatDate,
  getFormatDateTime,
} from '../../../../_shared/tools/functions';
import { Edit, ArrowBack, Person, Event, Home, Phone, Email, Language, ContactMail, AccountBalance, Description, Notes, Badge, Work, CalendarMonth } from '@mui/icons-material';
import EmployeeTabs from './employee-tabs/EmployeeTabs';

export default function EmployeeDetails() {
  let { idEmployee } = useParams();
  const [getEmployee, { loading: loadingEmployee, data: employeeData }] =
    useLazyQuery(GET_RECAP_EMPLOYEE);
  React.useEffect(() => {
    if (idEmployee) {
      getEmployee({ variables: { id: idEmployee } });
    }
  }, [idEmployee]);

  return (
    <Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/ressources-humaines/employes/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        <Link
          to={`/online/ressources-humaines/employes/modifier/${employeeData?.employee?.id}`}
          className="no_style"
        >
          <Button variant="outlined" endIcon={<Edit />}>
            Modifier
          </Button>
        </Link>
      </Box>
      {employeeData?.employee && (
        <EmployeeDetailsPage employee={employeeData?.employee} />
      )}
    </Stack>
  );
}

const EmployeeDetailsPage = ({ employee }) => {
  const {
    id,
    photo,
    coverImage,
    signature,
    number,
    registrationNumber,
    firstName,
    lastName,
    preferredName,
    socialSecurityNumber,
    birthDate,
    birthPlace,
    nationality,
    position,
    hiringDate,
    probationEndDate,
    workEndDate,
    startingSalary,
    additionalAddress,
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
  } = employee;

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
              src={photo}
              alt={firstName}
              sx={{
                width: 100,
                height: 100,
                boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', // Ajoutez l'ombre extérieure ici
                border: '2px solid white', // Ajoutez une bordure blanche autour de l'avatar si nécessaire
              }}
            />
            {signature && (
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>Signature :</Typography>
                <img 
                  src={signature} 
                  alt="Signature" 
                  style={{ 
                    maxWidth: '120px', 
                    maxHeight: '50px', 
                    backgroundColor: 'white', 
                    padding: '5px', 
                    borderRadius: '4px' 
                  }} 
                />
              </Box>
            )}
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
                {`${firstName} ${preferredName && preferredName !== '' ? preferredName : lastName}`}
              </Typography>
              <Typography variant="body2">{`Nom de naissance: ${lastName}`}</Typography>
              {position && position !== '' && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <Chip 
                    icon={<Work />} 
                    label={position} 
                    variant="outlined" 
                    size="small" 
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                  />
                </Typography>
              )}
              {address && address !== '' && (
                <Typography variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Home fontSize="small" sx={{ mr: 0.5 }} />
                  {address}
                </Typography>
              )}
              {(zipCode || city) && (
                <Typography variant="body2">
                  {zipCode} {city}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1, display: 'flex', alignItems: 'center' }}>
                <Email fontSize="small" sx={{ mr: 0.5 }} />
                {email}
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                <Badge fontSize="small" sx={{ mr: 0.5 }} />
                N°SS: <b>{socialSecurityNumber}</b>
              </Typography>
              {registrationNumber && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                  <Badge fontSize="small" sx={{ mr: 0.5 }} />
                  Matricule: <b>{registrationNumber}</b>
                </Typography>
              )}
              {mobile && mobile !== '' && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                  <Phone fontSize="small" sx={{ mr: 0.5 }} />
                  {mobile}
                </Typography>
              )}
              {fix && fix !== '' && (
                <Typography variant="body2" sx={{ fontStyle: 'italic', display: 'flex', alignItems: 'center' }}>
                  <Phone fontSize="small" sx={{ mr: 0.5 }} />
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
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 1 }} /> Informations personnelles
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">Référence: {number}</Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              <b>Date de naissance:</b> {getFormatDate(birthDate) || '-'}
            </Typography>
            <Typography variant="body1">
              <b>Lieu de naissance:</b> {birthPlace || '-'}
            </Typography>
            <Typography variant="body1">
              <b>Nationalité:</b> {nationality || '-'}
            </Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              <b>Date d'embauche:</b> {getFormatDate(hiringDate) || '-'}
            </Typography>
            {probationEndDate && (
              <Typography variant="body1">
                <b>Fin de période d'essai:</b> {getFormatDate(probationEndDate)}
              </Typography>
            )}
            {workEndDate && (
              <Typography variant="body1">
                <b>Fin de contrat:</b> {getFormatDate(workEndDate)}
              </Typography>
            )}
            {startingSalary > 0 && (
              <Typography variant="body1">
                <b>Salaire initial:</b> {startingSalary} €
              </Typography>
            )}
          </Paper>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <ContactMail sx={{ mr: 1 }} /> Coordonnées
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1">
              <b>Adresse:</b> {address || '-'}
            </Typography>
            {additionalAddress && (
              <Typography variant="body1">
                <b>Complément d'adresse:</b> {additionalAddress}
              </Typography>
            )}
            <Typography variant="body1">
              <b>Code postal:</b> {zipCode || '-'} <b>Ville:</b> {city || '-'}
            </Typography>
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              <b>Mobile:</b> {mobile || '-'}
            </Typography>
            <Typography variant="body1">
              <b>Fixe:</b> {fix || '-'}
            </Typography>
            {fax && (
              <Typography variant="body1">
                <b>Fax:</b> {fax}
              </Typography>
            )}
            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            <Typography variant="body1">
              <b>Email:</b> {email || '-'}
            </Typography>
            {webSite && (
              <Typography variant="body1">
                <b>Site web:</b> {webSite}
              </Typography>
            )}
            {otherContacts && (
              <Typography variant="body1">
                <b>Autres contacts:</b> {otherContacts}
              </Typography>
            )}
          </Paper>
          
          {/* <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <AccountBalance sx={{ mr: 1 }} /> Informations Bancaires
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1"><b>IBAN:</b> {iban || '-'}</Typography>
            <Typography variant="body1"><b>BIC:</b> {bic || '-'}</Typography>
            <Typography variant="body1">
              <b>Nom de la banque:</b> {bankName || '-'}
            </Typography>
          </Paper> */}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Description sx={{ mr: 1 }} /> Description
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {description ? description : "Aucune description pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Notes sx={{ mr: 1 }} /> Observation
          </Typography>
          <Paper sx={{ padding: 2 }} variant="outlined">
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {observation ? observation : "Aucune observation pour l'instant"}
            </Typography>
          </Paper>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper sx={{ padding: 2 }}>
          <EmployeeTabs employee={employee}/>
        </Paper>
      </Grid>
    </Grid>
  );
};
