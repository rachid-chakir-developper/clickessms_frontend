import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
  Button,
  Stack,
} from '@mui/material';

import { CALL_RECAP } from '../../../../_shared/graphql/queries/CallQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';
import { ArrowBack, Edit, Business, PersonOutline, Phone, Event, Description, Note, Group, People, Info } from '@mui/icons-material';
import BeneficiaryChip from '../../human_ressources/beneficiaries/BeneficiaryChip';
import EmployeeChip from '../../human_ressources/employees/EmployeeChip';
import EstablishmentChip from '../../companies/establishments/EstablishmentChip';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function CallDetails() {
  let { idCall } = useParams();
  const [getCall, { loading: loadingCall, data: callData, error: callError }] =
    useLazyQuery(CALL_RECAP);
  React.useEffect(() => {
    if (idCall) {
      getCall({ variables: { id: idCall } });
    }
  }, [idCall]);

  if (loadingCall) return <ProgressService type="form" />;
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Link
          to="/online/administratif/appels/liste"
          className="no_style"
        >
          <Button variant="outlined" startIcon={<ArrowBack />}>
            Retour à la liste
          </Button>
        </Link>
        {callData?.call && (
          <Link to={`/online/administratif/appels/modifier/${callData.call.id}`} className="no_style">
            <Button variant="outlined" endIcon={<Edit />}>
              Modifier
            </Button>
          </Link>
        )}
      </Box>
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <CallMiniInfos call={callData?.call} />
          </Grid>
          <Grid item xs={5}>
            <CallOtherInfos call={callData?.call} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Description sx={{ mr: 1 }} />Description
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1">
                  {callData?.call?.description ? callData?.call?.description : "Aucune description pour l'instant"}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Note sx={{ mr: 1 }} />Observation
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1">
                  {callData?.call?.observation ? callData?.call?.observation : "Aucune observation pour l'instant"}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 2, marginBottom: 2 }}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Info sx={{ mr: 1 }} />Informations supplémentaires
              </Typography>
              <Paper sx={{ padding: 2 }} variant="outlined">
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Info sx={{ mr: 1, fontSize: 'small' }} />Ajouté le: {getFormatDateTime(callData?.call?.createdAt)}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Info sx={{ mr: 1, fontSize: 'small' }} />Dernière modification: {getFormatDateTime(callData?.call?.updatedAt)}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
});

function CallMiniInfos({ call }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        //maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Info sx={{ mr: 1 }} />Informations principales
      </Typography>
      <Grid container spacing={2}>
        {call?.image && call?.image != '' && (
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 'auto' }}>
              <Img alt="complex" src={call?.image} />
            </ButtonBase>
          </Grid>
        )}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Info sx={{ mr: 1, fontSize: 'small' }} />Réference : <b>{call?.number}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Description sx={{ mr: 1, fontSize: 'small' }} />Libellé : <b>{call?.title}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, fontSize: 'small' }} />Type d'appel : <b>{call?.callType === 'INCOMING' ? 'Entrant' : 'Sortant'}</b>
              </Typography>
              <Typography gutterBottom variant="body1" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Event sx={{ mr: 1, fontSize: 'small' }} />Date et heure : <b>{getFormatDateTime(call?.entryDateTime)}</b>
              </Typography>
              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function CallOtherInfos({ call }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Typography gutterBottom variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Group sx={{ mr: 1 }} />Personnes concernées
      </Typography>
      
      {call?.caller && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ mr: 1, fontSize: 'small' }} />Appelant
          </Typography>
          <Paper variant="outlined" sx={{ padding: 1, mb: 2 }}>
            <Typography gutterBottom variant="body1" component="div">
              {call?.caller?.callerType === 'PhoneNumber' 
                ? call?.caller?.phoneNumber?.phone
                : call?.caller?.callerType === 'Employee' 
                  ? `${call?.caller?.employee?.firstName} ${call?.caller?.employee?.lastName}`
                  : call?.caller?.callerType === 'Beneficiary'
                    ? `${call?.caller?.beneficiary?.firstName} ${call?.caller?.beneficiary?.lastName}`
                    : call?.caller?.callerType === 'Client'
                      ? call?.caller?.client?.name
                      : call?.caller?.callerType === 'Establishment'
                        ? call?.caller?.establishment?.name
                        : call?.caller?.callerType === 'Partner'
                          ? call?.caller?.partner?.name
                          : call?.caller?.callerType === 'Supplier'
                            ? call?.caller?.supplier?.name
                            : ''}
            </Typography>
          </Paper>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {call?.establishments && call?.establishments.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ mr: 1, fontSize: 'small' }} />Structures concernées
          </Typography>
          <Stack direction="row" flexWrap='wrap' spacing={1}>
            {call?.establishments?.map((establishment, index) => (
              <EstablishmentChip establishment={establishment?.establishment} key={index}/>
            ))}
          </Stack>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {call?.employees && call?.employees.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonOutline sx={{ mr: 1, fontSize: 'small' }} />Employés concernés
          </Typography>
          <Stack direction="row" flexWrap='wrap' spacing={1}>
            {call?.employees?.map((employee, index) => (
              <EmployeeChip employee={employee?.employee} key={index}/>
            ))}
          </Stack>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {call?.beneficiaries && call?.beneficiaries.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <People sx={{ mr: 1, fontSize: 'small' }} />Personnes accompagnées
          </Typography>
          <Stack direction="row" flexWrap='wrap' spacing={1}>
            {call?.beneficiaries?.map((beneficiary, index) => (
              <BeneficiaryChip beneficiary={beneficiary?.beneficiary} key={index}/>
            ))}
          </Stack>
        </>
      )}
    </Paper>
  );
}
