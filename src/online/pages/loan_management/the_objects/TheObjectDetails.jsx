import { useLazyQuery } from '@apollo/client';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {Box, Grid, Paper, ButtonBase, Typography, Divider, Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { THE_OBJECT_RECAP } from '../../../../_shared/graphql/queries/TheObjectQueries';
import ProgressService from '../../../../_shared/services/feedbacks/ProgressService';
import CommentsList from '../../../_shared/components/feedBacks/CommentsList';
import TitlebarImageList from '../../../_shared/components/media/TitlebarImageList';
import { getFormatDateTime, getLevelLabel, getPriorityLabel, getStatusLabel, getStepTypeLabel } from '../../../../_shared/tools/functions';
import PersonCard from '../../../_shared/components/persons/PersonCard';
import ChecklistsList from '../../../_shared/components/feedBacks/ChecklistsList';
import SignatureCard from '../../../_shared/components/feedBacks/SignatureCard';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function TheObjectDetails() {
  let { idTheObject } = useParams();
  const [getTheObject, { 
    loading : loadingTheObject,
    data: theObjectData, 
    error: theObjectError, 
  }] = useLazyQuery(THE_OBJECT_RECAP)
  React.useEffect(()=>{
      if(idTheObject){
          getTheObject(({ variables: { id: idTheObject } }));
      }
  }, [idTheObject])

  if(loadingTheObject) return <ProgressService type="form" />
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <TheObjectMiniInfos theObject={theObjectData?.theObject}/>
          </Grid>
          <Grid item xs={5}>
            <TheObjectOtherInfos theObject={theObjectData?.theObject}/>
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
                {theObjectData?.theObject?.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ padding : 2}} variant="outlined">
              <Typography gutterBottom variant="subtitle3" component="h3">
                Observation
              </Typography>
              <Typography gutterBottom variant="subtitle1" component="div">
                {theObjectData?.theObject?.observation}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{marginTop: 3, marginBottom: 3}}>
            <Divider/>
          </Grid>
          <Grid item xs={12}>
          <Typography gutterBottom variant="subtitle3" component="h3">
            Historique des récupérations
          </Typography>
          </Grid>
          {theObjectData?.theObject?.theObjectRecoveries?.map((theObjectRecovery, index) => (
            <Grid item xs={12} key={index}>
              <TheObjectLoansHistoryInfos theObjectRecovery={theObjectRecovery}/>
            </Grid>
          ))}
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

function TheObjectMiniInfos({theObject}) {
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
        {(theObject?.image && theObject?.image != '') &&
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 'auto' }}>
            <Img alt="complex" src={theObject?.image} />
          </ButtonBase>
        </Grid>}
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {theObject?.name}
              </Typography>
              <Divider sx={{marginTop : 2, marginBottom : 2}}/>
              <Typography variant="body2" color="text.secondary">
                <b>Crée le: </b> {`${getFormatDateTime(theObject?.createdAt)}`} <br />
                <b>Dernière modification: </b>{`${getFormatDateTime(theObject?.updatedAt)}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function TheObjectOtherInfos({theObject}) {
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              {theObject?.client && <Box>
                <Typography gutterBottom variant="subtitle3" component="h3">
                  Client
                </Typography>
                <PersonCard person={theObject?.client}/>
              </Box>}
              {theObject?.partner && <Box>
                <Typography gutterBottom variant="subtitle3" component="h3">
                  Partenaire
                </Typography>
                <PersonCard person={theObject?.partner}/>
              </Box>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

function TheObjectLoansHistoryInfos({theObjectRecovery}) {
  return (
    <Paper
      elevation={1}
      variant="outlined"
      sx={{
        p: 2,
        margin: 'auto',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs sx={{ display : 'flex', flexDirection: 'row'}}>
              <Box sx={{width: '100%', padding: 2}}>
                <Typography variant="body2" color="text.secondary">
                  <b>Récupération le:</b> {getFormatDateTime(theObjectRecovery?.recoveryDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Retour le:</b> {getFormatDateTime(theObjectRecovery?.recoveryDate)}
                </Typography>
                <Divider sx={{marginY : 2}}/>
                <Box>
                  <PersonCard person={theObjectRecovery?.creator}/>
                </Box>
                <Divider sx={{marginY : 2}}/>
                <Typography variant="body2" color="text.secondary">
                  <b>Date de création:</b> {getFormatDateTime(theObjectRecovery?.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Dernière modification:</b> {getFormatDateTime(theObjectRecovery?.updatedAt)}
                </Typography>
                <Divider sx={{marginY : 2}}/>
                <Typography variant="body2" color="text.secondary">
                  <b>Description:</b> {theObjectRecovery?.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <b>Observation:</b> {theObjectRecovery?.observation}
                </Typography>
              </Box>
              <Box>
                <TitlebarImageList images={theObjectRecovery?.images} videos={theObjectRecovery?.videos}/>
              </Box>
              {/* <Box>
                <CommentsList comments={theObjectRecovery?.comments}/>
              </Box> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
