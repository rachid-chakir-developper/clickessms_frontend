
import React from 'react';
import { Typography, Paper, Grid, Stack } from '@mui/material';
import { useLazyQuery } from '@apollo/client';
import { GET_TASK_RECAP } from '../../../../../_shared/graphql/queries/TaskQueries';
import ProgressService from '../../../../../_shared/services/feedbacks/ProgressService';
import { getFormatDateTime } from '../../../../../_shared/tools/functions';
import ChecklistsList from '../../feedBacks/ChecklistsList';

export default function TaskReport({task}) {
    const [getTask, { 
        loading : loadingTask,
        data: taskData, 
        error: taskError, 
      }] = useLazyQuery(GET_TASK_RECAP)
    React.useEffect(()=>{
        if(task?.id){
            getTask(({ variables: { id: task.id } }));
        }
    }, [task])
    
    if(loadingTask) return <ProgressService type="form" />
    return (
            <Stack sx={{ height : '100%', alignItems : 'center', justifyContent : 'center'}}>
                <Paper elevation={0} sx={{ width: '100%'}}>
                    <Typography variant="h5" sx={{ marginBottom: 3, fontWeight: 700 }}>COMPTE RENDU</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>Numéro: <b>{taskData?.task?.number}</b></Typography>
                            <Typography>Date d'arrivée: <b>{taskData?.task?.startedAt ? `${getFormatDateTime(taskData?.task?.startedAt)}` : 'Pas encore commencée'}</b></Typography>
                            <Typography>Durée:</Typography>
                            <Typography>Date de départ: <b>{taskData?.task?.finishedAt ? `${getFormatDateTime(taskData?.task?.finishedAt)}` : 'Pas encore finie'}</b></Typography>
                            <Typography>Lieu de l'intervention:<br /><b>{taskData?.task?.address}</b></Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{fontWeight: 700}}>{taskData?.task?.client?.name}</Typography>
                            <Typography>{taskData?.task?.client?.address}</Typography>
                            {taskData?.task?.client?.email && <Typography>{taskData?.task?.client?.email}</Typography>}
                            {taskData?.task?.client?.fix && <Typography>{taskData?.task?.client?.fix}</Typography>}
                            {taskData?.task?.client?.mobile && <Typography>{taskData?.task?.client?.mobile}</Typography>}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{marginY: 4}}> 
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                <b>{taskData?.task?.name}</b>
                            </Typography>
                            <Paper sx={{ padding : 2, marginBottom: 2}} variant="outlined">
                                <Typography gutterBottom variant="subtitle3" component="h3">
                                    Déscription
                                </Typography>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    {taskData?.task?.description}
                                </Typography>
                            </Paper>
                            {/* <Paper sx={{ padding : 2, marginBottom: 2}} variant="outlined">
                                <Typography gutterBottom variant="subtitle3" component="h3">
                                    Les tâches traitées
                                </Typography>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    <ChecklistsList checklist={taskData?.task?.taskChecklist} isFromQuote={taskData?.task?.isFromQuote} />
                                </Typography>
                            </Paper> */}
                            <Paper sx={{ padding : 2, marginBottom: 2}} variant="outlined">
                                <Typography gutterBottom variant="subtitle3" component="h3">
                                    Commentaire
                                </Typography>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    {taskData?.task?.comment}
                                </Typography>
                            </Paper>
                            <Paper sx={{ padding : 2}} variant="outlined">
                                <Typography gutterBottom variant="subtitle3" component="h3">
                                    Observation
                                </Typography>
                                <Typography gutterBottom variant="subtitle1" component="div">
                                    {taskData?.task?.observation}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography>Fait le:</Typography>
                            <Typography>À:</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>Signature de l'intervenant:</Typography>
                            {taskData?.task?.employeeSignature && <>
                                <Typography sx={{fontWeight: 700}}>{`${taskData?.task?.employeeSignature?.creator?.firstName} ${taskData?.task?.employeeSignature?.creator?.lastName}`}</Typography>
                                <img src={taskData?.task?.employeeSignature?.base64Encoded} width={100} alt="Signature de l'intervenant" title="Signature de l'intervenant" />
                            </>}
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>Signature du client: </Typography>
                            {taskData?.task?.clientSignature && <>
                                <Typography sx={{fontWeight: 700}}> {taskData?.task?.clientSignature?.authorName}</Typography>
                                <img src={taskData?.task?.clientSignature?.base64Encoded} width={100} alt="Signature de l'intervenant" title="Signature de l'intervenant" />
                            </>}
                        </Grid>
                    </Grid>
                </Paper>
            </Stack>
        );
}