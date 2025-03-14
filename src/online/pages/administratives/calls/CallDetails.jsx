import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Paper,
  ButtonBase,
  Typography,
  Divider,
} from '@mui/material';

import { CALL_RECAP } from '../../../../_shared/graphql/queries/CallQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import BeneficiaryItemCard from '../../human_ressources/beneficiaries/BeneficiaryItemCard';

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
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <CallMiniInfos call={callData?.call} />
          </Grid>
          <Grid item xs={5}>
            <CallOtherInfos call={callData?.call} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 3, marginBottom: 3 }}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {callData?.call?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding: 2 }} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {callData?.call?.observation}
              </Typography>
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
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{call?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {call?.title}
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Type d'appel : <b>{call?.callType === 'INCOMING' ? 'Entrant' : 'Sortant'}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                Date et heure : <b>{getFormatDateTime(call?.entryDateTime)}</b>
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
      {call?.caller && (
        <>
          <Typography gutterBottom variant="subtitle3" component="h3">
            Appelant
          </Typography>
          <Typography gutterBottom variant="body1" component="div">
            {call?.caller?.callerType === 'PhoneNumber' 
              ? call?.caller?.phoneNumber 
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
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {call?.establishments && call?.establishments.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle3" component="h3">
            Structures concernées
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            {call?.establishments?.map((est, index) => (
              <Grid item key={index}>
                <Paper variant="outlined" sx={{ padding: 1 }}>
                  <Typography variant="body2">
                    {est?.establishment?.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      {call?.employees && call?.employees.length > 0 && (
        <>
          <Typography gutterBottom variant="subtitle3" component="h3">
            Employés concernés
          </Typography>
          <Grid container spacing={1} sx={{ marginBottom: 2 }}>
            {call?.employees?.map((emp, index) => (
              <Grid item key={index}>
                <Paper variant="outlined" sx={{ padding: 1 }}>
                  <Typography variant="body2">
                    {`${emp?.employee?.firstName} ${emp?.employee?.lastName}`}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        </>
      )}

      <Typography gutterBottom variant="subtitle3" component="h3">
        Les Personnes accompagnées
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {call?.beneficiaries?.map((beneficiary, index) => (
          <Grid item xs={12} sm={12} md={12} key={index}>
            <Item>
              <BeneficiaryItemCard beneficiary={beneficiary?.beneficiary} />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
