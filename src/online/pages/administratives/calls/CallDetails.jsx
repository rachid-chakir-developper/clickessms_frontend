import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {Box, Grid, Paper, ButtonBase, Typography, Divider,} from '@mui/material';

import { CALL_RECAP } from '../../../../_shared/graphql/queries/CallQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import TitlebarImageList from '../../../_shared/components/media/TitlebarImageList';
import { getFormatDateTime } from '../../../../_shared/tools/functions';
import PersonCard from '../../../_shared/components/persons/PersonCard';
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
  const [getCall, { 
    loading : loadingCall,
    data: callData, 
    error: callError, 
  }] = useLazyQuery(CALL_RECAP)
  React.useEffect(()=>{
      if(idCall){
          getCall(({ variables: { id: idCall } }));
      }
  }, [idCall])

  if(loadingCall) return <ProgressService type="form" />
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <CallMiniInfos call={callData?.call}/>
          </Grid>
          <Grid item xs={5}>
            <CallOtherInfos call={callData?.call}/>
          </Grid>
          <Grid item xs={12} sx={{marginTop: 3, marginBottom: 3}}>
            <Divider/>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding : 2}} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Description
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {callData?.call?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding : 2}} variant="outlined">
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

function CallMiniInfos({call}) {
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
        {(call?.image && call?.image != '') &&
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 'auto' }}>
            <Img alt="complex" src={call?.image} />
          </ButtonBase>
        </Grid>}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                Réference : <b>{call?.number}</b>
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {call?.title}
              </Typography>
              <Divider sx={{marginTop : 2, marginBottom : 2}}/>
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(call?.createdAt)}`} <br />
                <b>Dernière modification: </b>{`${getFormatDateTime(call?.updatedAt)}`}
              </Typography>
              <Divider sx={{marginTop : 2, marginBottom : 2}}/>
              <Typography variant="body2" color="text.secondary">
                <b>Date début prévue: </b> {`${getFormatDateTime(call?.startingDateTime)}`} <br />
                <b>Date fin prévue: </b> {`${getFormatDateTime(call?.endingDateTime)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function CallOtherInfos({call}) {
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
      <Typography gutterBottom variant="subtitle3" component="h3">
        Les Bénificiaires
      </Typography>
      <Grid container columns={{ xs: 12, sm: 12, md: 12 }}>
        {call?.beneficiaries?.map((beneficiary, index) => (
          <Grid xs={12} sm={12} md={12} key={index}>
            <Item>
              <BeneficiaryItemCard 
                                beneficiary={beneficiary?.beneficiary} 
              />
            </Item>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

